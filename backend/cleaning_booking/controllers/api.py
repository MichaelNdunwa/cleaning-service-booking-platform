# -*- coding: utf-8 -*-
import json
import logging
import os
import secrets
from datetime import datetime

import odoo
from odoo import http
from odoo.http import request, Response
from odoo.exceptions import AccessDenied, UserError, ValidationError

_logger = logging.getLogger(__name__)


class CleaningAPI(http.Controller):
    """REST API controller for the Next.js frontend."""

    def _allowed_origins(self):
        """Return the allowed frontend origins for browser requests."""
        raw_origins = os.getenv("CLEANING_ALLOWED_ORIGINS", "http://localhost:3000")
        origins = [origin.strip().rstrip("/") for origin in raw_origins.split(",") if origin.strip()]
        return origins or ["http://localhost:3000"]

    def _cors_headers(self):
        """Build CORS headers for the current request origin."""
        origin = (request.httprequest.headers.get("Origin") or "").strip().rstrip("/")
        headers = {
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
            "Vary": "Origin",
        }
        if origin and origin in self._allowed_origins():
            headers["Access-Control-Allow-Origin"] = origin
        return headers

    def _json_response(self, data, status=200):
        """Return a JSON response with proper headers."""
        return Response(
            json.dumps(data, default=str),
            status=status,
            content_type="application/json",
            headers=self._cors_headers(),
        )

    def _error_response(self, message, status=400):
        """Return a JSON error response."""
        return self._json_response({"error": message}, status=status)

    # ── Auth: Signup ──

    @http.route("/api/v1/auth/signup", type="http", auth="public", methods=["POST", "OPTIONS"], csrf=False)
    def auth_signup(self, **kwargs):
        """Create a new portal user account."""
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        try:
            data = json.loads(request.httprequest.data)
        except (json.JSONDecodeError, TypeError):
            return self._error_response("Invalid JSON body.")

        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not name:
            return self._error_response("Full name is required.")
        if not email:
            return self._error_response("Email is required.")
        if len(password) < 8:
            return self._error_response("Password must be at least 8 characters.")

        env = request.env

        existing = env["res.users"].sudo().search([("login", "=", email)], limit=1)
        if existing:
            return self._error_response("An account with this email already exists.", status=409)

        try:
            portal_group = env.ref("base.group_portal")
            new_user = env["res.users"].sudo().with_context(no_reset_password=True).create({
                "name": name,
                "login": email,
                "email": email,
                "password": password,
                "group_ids": [(6, 0, [portal_group.id])],
            })
            user_id = new_user.id
            user_name = name
            user_email = email
            try:
                new_user.partner_id.sudo().write({"customer_rank": 1})
            except (KeyError, ValueError):
                pass
        except (ValidationError, UserError) as e:
            _logger.warning("Signup failed: %s", e)
            return self._error_response(str(e), status=400)
        except Exception as e:
            _logger.exception("Signup error")
            return self._error_response(f"Signup error: {e}", status=500)

        return self._json_response({
            "success": True,
            "message": "Account created successfully. You can now log in.",
            "user": {
                "id": user_id,
                "name": user_name,
                "email": user_email,
            }
        }, status=201)

    # ── Auth: Login ──

    @http.route("/api/v1/auth/login", type="http", auth="none", methods=["POST", "OPTIONS"], csrf=False)
    def auth_login(self, **kwargs):
        """Authenticate user and create session."""
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        try:
            data = json.loads(request.httprequest.data)
        except (json.JSONDecodeError, TypeError):
            return self._error_response("Invalid JSON body.")

        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not email or not password:
            return self._error_response("Email and password are required.")

        try:
            db = request.db
            if not db:
                return self._error_response("Database not configured.", status=500)

            cr = odoo.modules.registry.Registry(db).cursor()
            try:
                env = odoo.api.Environment(cr, None, {})
                credential = {'login': email, 'password': password, 'type': 'password'}
                auth_info = request.session.authenticate(env, credential)
                uid = auth_info.get('uid')
                if not uid:
                    cr.close()
                    return self._error_response("Invalid email or password.", status=401)

                request.session.db = db
                request._save_session(env)

                user = env["res.users"].browse(uid)
                user_data = {
                    "id": user.id,
                    "name": user.name,
                    "email": user.login,
                }
                cr.commit()
            except AccessDenied:
                cr.close()
                return self._error_response("Invalid email or password.", status=401)
            except Exception:
                cr.close()
                raise
            else:
                cr.close()
        except AccessDenied:
            return self._error_response("Invalid email or password.", status=401)
        except Exception:
            _logger.exception("Login error")
            return self._error_response("Login failed. Please try again.", status=500)

        return self._json_response({
            "success": True,
            "user": user_data,
        })

    # ── Auth: OAuth (Google / Apple) ──

    @http.route("/api/v1/auth/oauth", type="http", auth="none", methods=["POST", "OPTIONS"], csrf=False)
    def auth_oauth(self, **kwargs):
        """Find-or-create a portal user from a verified OAuth identity.

        The OAuth token has already been validated by NextAuth (server-side) before
        this endpoint is called — we trust the email/name/provider_uid are authentic.

        NOTE: This endpoint deliberately does NOT set request.session fields.
        Setting session.uid without computing a valid session_token corrupts the
        browser cookie. User state is managed by the frontend via the returned data.
        """
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        # Clear any potentially broken session cookie sent by the browser.
        try:
            request.session.logout(keep_db=True)
        except Exception:
            pass

        try:
            data = json.loads(request.httprequest.data)
        except (json.JSONDecodeError, TypeError):
            return self._error_response("Invalid JSON body.")

        provider = data.get("provider", "")
        email = data.get("email", "").strip().lower()
        name = data.get("name", "").strip()

        if not email:
            return self._error_response("Email is required.")
        if provider not in ("google", "apple"):
            return self._error_response("Unsupported provider.")

        try:
            db = request.db
            if not db:
                return self._error_response("Database not configured.", status=500)

            cr = odoo.modules.registry.Registry(db).cursor()
            try:
                env = odoo.api.Environment(cr, odoo.SUPERUSER_ID, {})

                existing_user = env["res.users"].search([("login", "=", email)], limit=1)

                if existing_user:
                    uid = existing_user.id
                    user_name = existing_user.name
                else:
                    random_password = secrets.token_urlsafe(32)
                    portal_group = env.ref("base.group_portal")
                    new_user = env["res.users"].with_context(no_reset_password=True).create({
                        "name": name or email.split("@")[0],
                        "login": email,
                        "email": email,
                        "password": random_password,
                        "group_ids": [(6, 0, [portal_group.id])],
                    })
                    try:
                        new_user.partner_id.write({"customer_rank": 1})
                    except (KeyError, ValueError):
                        pass
                    uid = new_user.id
                    user_name = new_user.name

                # Mirror Odoo's own _update_last_login() behavior so login_date
                # updates for OAuth sign-ins too.
                env["res.users.log"].with_user(uid).sudo().create({})

                user_data = {"id": uid, "name": user_name, "email": email}
                cr.commit()
            except Exception:
                cr.rollback()
                cr.close()
                raise
            else:
                cr.close()

        except Exception:
            _logger.exception("OAuth login error")
            return self._error_response("OAuth login failed. Please try again.", status=500)

        return self._json_response({
            "success": True,
            "user": user_data,
        })

    # ── Auth: Logout ──

    @http.route("/api/v1/auth/logout", type="http", auth="public", methods=["POST", "OPTIONS"], csrf=False)
    def auth_logout(self, **kwargs):
        """Destroy the current session."""
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        request.session.logout(keep_db=True)
        return self._json_response({"success": True, "message": "Logged out."})

    # ── Auth: Forgot Password ──

    @http.route("/api/v1/auth/forgot-password", type="http", auth="none", methods=["POST", "OPTIONS"], csrf=False)
    def auth_forgot_password(self, **kwargs):
        """Send a password-reset email.

        Always returns { success: true } regardless of whether the email exists
        to prevent user enumeration.
        """
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        try:
            data = json.loads(request.httprequest.data)
        except (json.JSONDecodeError, TypeError):
            return self._error_response("Invalid JSON body.")

        email = (data.get("email") or "").strip().lower()
        if not email:
            return self._error_response("Email is required.")

        try:
            db = request.db
            if not db:
                return self._error_response("Database not configured.", status=500)

            cr = odoo.modules.registry.Registry(db).cursor()
            try:
                env = odoo.api.Environment(cr, odoo.SUPERUSER_ID, {})

                user = env["res.users"].search([("login", "=", email)], limit=1)
                if user:
                    Token = env["clean.password.reset.token"]
                    token_str = Token.create_token_for_user(user)

                    frontend_url = os.getenv("CLEANING_FRONTEND_URL", "http://localhost:3000")
                    reset_url = f"{frontend_url}/reset-password?token={token_str}"

                    # Log the full URL so dev environments without a mail server
                    # can still test the flow by copying it from the Odoo log.
                    _logger.info("[Password Reset] URL for %s : %s", email, reset_url)

                    try:
                        body_html = (
                            "<div style='font-family:Arial,sans-serif;max-width:560px;margin:0 auto;'>"
                            f"<p>Hi {user.name},</p>"
                            "<p>We received a request to reset your <strong>Shield Cleaning</strong> account password.</p>"
                            "<p style='margin:28px 0;'>"
                            f"<a href='{reset_url}' "
                            "style='display:inline-block;padding:13px 28px;background:#1E78FF;"
                            "color:#ffffff;border-radius:8px;text-decoration:none;"
                            "font-weight:700;font-size:15px;'>"
                            "Reset my password"
                            "</a></p>"
                            "<p style='color:#6b7280;font-size:13px;'>"
                            "This link expires in <strong>24 hours</strong>. "
                            "If you did not request a password reset, you can safely ignore this email — "
                            "your password will remain unchanged."
                            "</p>"
                            "<hr style='border:none;border-top:1px solid #e5e7eb;margin:24px 0;'/>"
                            "<p style='color:#9ca3af;font-size:12px;'>The Shield Cleaning team</p>"
                            "</div>"
                        )
                        # CLEANING_EMAIL_FROM must match the "FROM Filtering" value
                        # configured on the outgoing mail server in Odoo Settings.
                        email_from = os.getenv(
                            "CLEANING_EMAIL_FROM",
                            "Shield Cleaning <noreply@shieldcleaning.co>",
                        )
                        env["mail.mail"].create({
                            "subject": "Reset your Shield Cleaning password",
                            "email_from": email_from,
                            "email_to": email,
                            "body_html": body_html,
                            "auto_delete": True,
                        }).send()
                    except Exception as mail_err:
                        _logger.warning("[Password Reset] Email not sent for %s: %s", email, mail_err)
                        # Don't fail the request — the token exists; dev can grab the URL from logs

                cr.commit()
            except Exception:
                cr.rollback()
                cr.close()
                raise
            else:
                cr.close()

        except Exception:
            _logger.exception("Forgot-password error")
            # Fall through and return success to prevent enumeration

        return self._json_response({
            "success": True,
            "message": "If that email is registered, a reset link has been sent.",
        })

    # ── Auth: Reset Password ──

    @http.route("/api/v1/auth/reset-password", type="http", auth="none", methods=["POST", "OPTIONS"], csrf=False)
    def auth_reset_password(self, **kwargs):
        """Consume a reset token and update the user's password."""
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        try:
            data = json.loads(request.httprequest.data)
        except (json.JSONDecodeError, TypeError):
            return self._error_response("Invalid JSON body.")

        token_str = (data.get("token") or "").strip()
        password = data.get("password", "")

        if not token_str:
            return self._error_response("Reset token is required.")
        if len(password) < 8:
            return self._error_response("Password must be at least 8 characters.")

        try:
            db = request.db
            if not db:
                return self._error_response("Database not configured.", status=500)

            cr = odoo.modules.registry.Registry(db).cursor()
            try:
                env = odoo.api.Environment(cr, odoo.SUPERUSER_ID, {})

                Token = env["clean.password.reset.token"]
                token_record = Token.validate_token(token_str)

                if not token_record:
                    cr.close()
                    return self._error_response(
                        "This reset link is invalid or has expired. Please request a new one.",
                        status=400,
                    )

                user = token_record.user_id
                user._change_password(password)
                token_record.write({"used": True})
                cr.commit()

            except Exception:
                cr.rollback()
                cr.close()
                raise
            else:
                cr.close()

        except Exception:
            _logger.exception("Reset-password error")
            return self._error_response("Password reset failed. Please try again.", status=500)

        return self._json_response({
            "success": True,
            "message": "Password updated successfully. You can now log in.",
        })

    # ── Auth: Current User ──

    @http.route("/api/v1/auth/me", type="http", auth="public", methods=["GET", "OPTIONS"], csrf=False)
    def auth_me(self, **kwargs):
        """Return the current authenticated user or 401."""
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        uid = request.session.uid
        if not uid:
            return self._error_response("Not authenticated.", status=401)

        user = request.env["res.users"].sudo().browse(uid)
        if not user.exists():
            return self._error_response("Not authenticated.", status=401)

        return self._json_response({
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.login,
            }
        })

    # ── Service Types ──

    @http.route("/api/v1/services", type="http", auth="public", methods=["GET", "OPTIONS"], csrf=False)
    def get_services(self, **kwargs):
        """Return list of active service types."""
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        services = request.env["clean.service.type"].sudo().search([("active", "=", True)])
        data = [
            {
                "id": s.id,
                "name": s.name,
                "code": s.code,
                "description": s.description or "",
                "base_price": s.base_price,
            }
            for s in services
        ]
        return self._json_response({"services": data})

    # ── Add-ons ──

    @http.route("/api/v1/addons", type="http", auth="public", methods=["GET", "OPTIONS"], csrf=False)
    def get_addons(self, **kwargs):
        """Return list of active add-ons."""
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        addons = request.env["clean.addon"].sudo().search([("active", "=", True)])
        data = [
            {
                "id": a.id,
                "name": a.name,
                "code": a.code,
                "description": a.description or "",
                "price": a.price,
                "duration_delta": a.duration_delta,
            }
            for a in addons
        ]
        return self._json_response({"addons": data})

    # ── Availability ──

    @http.route("/api/v1/availability", type="http", auth="public", methods=["GET", "OPTIONS"], csrf=False)
    def get_availability(self, **kwargs):
        """Return available time slots for a given date."""
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        date_str = kwargs.get("date")
        if not date_str:
            return self._error_response("Missing required parameter: date")

        try:
            booking_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return self._error_response("Invalid date format. Use YYYY-MM-DD.")

        slots = request.env["clean.time.slot"].sudo().search([("active", "=", True)])
        bookings = request.env["clean.booking"].sudo().search([
            ("booking_date", "=", booking_date),
            ("state", "not in", ["cancelled"]),
        ])

        slot_counts = {}
        for b in bookings:
            slot_counts[b.time_slot_id.id] = slot_counts.get(b.time_slot_id.id, 0) + 1

        data = []
        for slot in slots:
            booked = slot_counts.get(slot.id, 0)
            available = max(0, slot.capacity - booked)
            data.append({
                "id": slot.id,
                "name": slot.name,
                "start_hour": slot.start_hour,
                "end_hour": slot.end_hour,
                "capacity": slot.capacity,
                "booked": booked,
                "available": available,
            })

        return self._json_response({
            "date": date_str,
            "slots": data,
        })

    # ── Create Booking ──

    @http.route("/api/v1/booking", type="http", auth="public", methods=["POST", "OPTIONS"], csrf=False)
    def create_booking(self, **kwargs):
        """Create a new booking from frontend data."""
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        try:
            data = json.loads(request.httprequest.data)
        except (json.JSONDecodeError, TypeError):
            return self._error_response("Invalid JSON body.")

        required = ["service_type_id", "booking_date", "time_slot_id"]
        missing = [f for f in required if f not in data]
        if missing:
            return self._error_response(f"Missing required fields: {', '.join(missing)}")

        customer_data = data.get("customer", {})
        customer = self._find_or_create_customer(customer_data)
        if not customer:
            return self._error_response("Customer email is required.")

        try:
            booking_date = datetime.strptime(data["booking_date"], "%Y-%m-%d").date()
        except ValueError:
            return self._error_response("Invalid booking_date format. Use YYYY-MM-DD.")

        vals = {
            "customer_id": customer.id,
            "service_type_id": int(data["service_type_id"]),
            "booking_date": booking_date,
            "time_slot_id": int(data["time_slot_id"]),
            "frequency": data.get("frequency", "one_time"),
            "address_line_1": data.get("address_line_1", ""),
            "address_line_2": data.get("address_line_2", ""),
            "city": data.get("city", ""),
            "postcode": data.get("postcode", ""),
            "access_instructions": data.get("access_instructions", ""),
            "bedrooms": int(data.get("bedrooms", 1)),
            "bathrooms": int(data.get("bathrooms", 1)),
            "notes": data.get("notes", ""),
        }

        addon_ids = data.get("addon_ids", [])
        if addon_ids:
            vals["addon_ids"] = [(6, 0, [int(a) for a in addon_ids])]

        booking = request.env["clean.booking"].sudo().create(vals)

        return self._json_response({
            "booking": {
                "id": booking.id,
                "reference": booking.name,
                "state": booking.state,
                "amount_total": booking.amount_total,
            }
        }, status=201)

    # ── Get Booking ──

    @http.route("/api/v1/booking/<int:booking_id>", type="http", auth="public", methods=["GET", "OPTIONS"], csrf=False)
    def get_booking(self, booking_id, **kwargs):
        """Return booking details by ID."""
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        booking = request.env["clean.booking"].sudo().browse(booking_id)
        if not booking.exists():
            return self._error_response("Booking not found.", status=404)

        data = {
            "id": booking.id,
            "reference": booking.name,
            "customer": {
                "name": booking.customer_id.name,
                "email": booking.customer_email,
                "phone": booking.customer_phone or "",
            },
            "service_type": {
                "id": booking.service_type_id.id,
                "name": booking.service_type_id.name,
            },
            "addons": [
                {"id": a.id, "name": a.name, "price": a.price}
                for a in booking.addon_ids
            ],
            "booking_date": str(booking.booking_date),
            "time_slot": {
                "id": booking.time_slot_id.id,
                "name": booking.time_slot_id.name,
            },
            "frequency": booking.frequency,
            "address": {
                "line_1": booking.address_line_1 or "",
                "line_2": booking.address_line_2 or "",
                "city": booking.city or "",
                "postcode": booking.postcode or "",
            },
            "bedrooms": booking.bedrooms,
            "bathrooms": booking.bathrooms,
            "base_amount": booking.base_amount,
            "addons_amount": booking.addons_amount,
            "amount_total": booking.amount_total,
            "state": booking.state,
            "payment_status": booking.payment_status,
            "payment_reference": booking.payment_reference or "",
            "notes": booking.notes or "",
        }
        return self._json_response({"booking": data})

    # ── Create / Update Customer ──

    @http.route("/api/v1/customer", type="http", auth="public", methods=["POST", "OPTIONS"], csrf=False)
    def create_customer(self, **kwargs):
        """Create or update a res.partner record."""
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        try:
            data = json.loads(request.httprequest.data)
        except (json.JSONDecodeError, TypeError):
            return self._error_response("Invalid JSON body.")

        customer = self._find_or_create_customer(data)
        if not customer:
            return self._error_response("Email is required.")

        return self._json_response({
            "customer": {
                "id": customer.id,
                "name": customer.name,
                "email": customer.email,
            }
        }, status=201)

    # ── Helper Methods ──

    def _find_or_create_customer(self, data):
        """Find a customer by email or create a new one."""
        email = data.get("email")
        if not email:
            return None

        Partner = request.env["res.partner"].sudo()
        customer = Partner.search([("email", "=", email)], limit=1)

        if customer:
            update_vals = {}
            if data.get("name") and data["name"] != customer.name:
                update_vals["name"] = data["name"]
            if data.get("phone") and data["phone"] != customer.phone:
                update_vals["phone"] = data["phone"]
            if update_vals:
                customer.write(update_vals)
        else:
            customer = Partner.create({
                "name": data.get("name", email.split("@")[0]),
                "email": email,
                "phone": data.get("phone", ""),
                "customer_rank": 1,
            })

        return customer
