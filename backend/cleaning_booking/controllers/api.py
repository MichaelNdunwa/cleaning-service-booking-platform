# -*- coding: utf-8 -*-
import json
import logging
from datetime import datetime

import odoo
from odoo import http
from odoo.http import request, Response
from odoo.exceptions import AccessDenied, UserError, ValidationError

_logger = logging.getLogger(__name__)


class CleaningAPI(http.Controller):
    """REST API controller for the Next.js frontend."""

    def _json_response(self, data, status=200):
        """Return a JSON response with proper headers."""
        return Response(
            json.dumps(data, default=str),
            status=status,
            content_type="application/json",
            headers={
                "Access-Control-Allow-Origin": "http://localhost:3000",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Credentials": "true",
            },
        )

    def _error_response(self, message, status=400):
        """Return a JSON error response."""
        return self._json_response({"error": message}, status=status)

    # ── Auth: Signup ──

    @http.route("/api/v1/auth/signup", type="http", auth="public", methods=["POST", "OPTIONS"], csrf=False, cors="http://localhost:3000")
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

        # Use sudo env for user creation
        env = request.env

        # Check if user already exists
        existing = env["res.users"].sudo().search([("login", "=", email)], limit=1)
        if existing:
            return self._error_response("An account with this email already exists.", status=409)

        try:
            # Create a portal user
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
            # Set customer_rank on the partner (only if sale module is installed)
            try:
                new_user.partner_id.sudo().write({"customer_rank": 1})
            except (KeyError, ValueError):
                pass  # customer_rank field not available
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

    @http.route("/api/v1/auth/login", type="http", auth="none", methods=["POST", "OPTIONS"], csrf=False, cors="http://localhost:3000")
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

            # Build env manually for auth="none" route, matching Odoo 19's pattern
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
        except Exception as e:
            _logger.exception("Login error")
            return self._error_response("Login failed. Please try again.", status=500)

        return self._json_response({
            "success": True,
            "user": user_data,
        })

    # ── Auth: Logout ──

    @http.route("/api/v1/auth/logout", type="http", auth="public", methods=["POST", "OPTIONS"], csrf=False, cors="http://localhost:3000")
    def auth_logout(self, **kwargs):
        """Destroy the current session."""
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        request.session.logout(keep_db=True)
        return self._json_response({"success": True, "message": "Logged out."})

    # ── Auth: Current User ──

    @http.route("/api/v1/auth/me", type="http", auth="public", methods=["GET", "OPTIONS"], csrf=False, cors="http://localhost:3000")
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

    @http.route("/api/v1/services", type="http", auth="public", methods=["GET", "OPTIONS"], csrf=False, cors="http://localhost:3000")
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

    @http.route("/api/v1/addons", type="http", auth="public", methods=["GET", "OPTIONS"], csrf=False, cors="http://localhost:3000")
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

    @http.route("/api/v1/availability", type="http", auth="public", methods=["GET", "OPTIONS"], csrf=False, cors="http://localhost:3000")
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

        # Count bookings per slot
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

    @http.route("/api/v1/booking", type="http", auth="public", methods=["POST", "OPTIONS"], csrf=False, cors="http://localhost:3000")
    def create_booking(self, **kwargs):
        """Create a new booking from frontend data."""
        # Handle CORS preflight
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        try:
            data = json.loads(request.httprequest.data)
        except (json.JSONDecodeError, TypeError):
            return self._error_response("Invalid JSON body.")

        # Required fields
        required = ["service_type_id", "booking_date", "time_slot_id"]
        missing = [f for f in required if f not in data]
        if missing:
            return self._error_response(f"Missing required fields: {', '.join(missing)}")

        # Find or create customer
        customer_data = data.get("customer", {})
        customer = self._find_or_create_customer(customer_data)
        if not customer:
            return self._error_response("Customer email is required.")

        # Parse booking date
        try:
            booking_date = datetime.strptime(data["booking_date"], "%Y-%m-%d").date()
        except ValueError:
            return self._error_response("Invalid booking_date format. Use YYYY-MM-DD.")

        # Prepare booking values
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

        # Add-ons (list of IDs)
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

    @http.route("/api/v1/booking/<int:booking_id>", type="http", auth="public", methods=["GET", "OPTIONS"], csrf=False, cors="http://localhost:3000")
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

    @http.route("/api/v1/customer", type="http", auth="public", methods=["POST", "OPTIONS"], csrf=False, cors="http://localhost:3000")
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
            # Update existing partner with new data
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
