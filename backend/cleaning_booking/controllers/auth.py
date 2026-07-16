# -*- coding: utf-8 -*-
import logging
import os
import secrets
from markupsafe import Markup, escape

from odoo import http
from odoo.http import request
from odoo.exceptions import AccessDenied, UserError, ValidationError

from .common import CleaningAPIBase

_logger = logging.getLogger(__name__)


class CleaningAuthAPI(CleaningAPIBase, http.Controller):
    """Authentication endpoints for the Next.js frontend."""

    # ── Signup ──

    @http.route("/api/v1/auth/signup", type="http", auth="public", methods=["POST", "OPTIONS"], csrf=False)
    def auth_signup(self, **kwargs):
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        data, err = self._parse_json()
        if err:
            return err

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
            try:
                new_user.partner_id.sudo().write({"customer_rank": 1})
            except (KeyError, ValueError):
                pass
        except (ValidationError, UserError) as e:
            _logger.warning("Signup failed: %s", e)
            return self._error_response(str(e), status=400)
        except Exception:
            _logger.exception("Signup error")
            return self._error_response("Signup failed.", status=500)

        return self._json_response({
            "success": True,
            "message": "Account created successfully. You can now log in.",
            "user": {"id": new_user.id, "name": name, "email": email},
        }, status=201)

    # ── Login ──

    @http.route("/api/v1/auth/login", type="http", auth="none", methods=["POST", "OPTIONS"], csrf=False)
    def auth_login(self, **kwargs):
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        data, err = self._parse_json()
        if err:
            return err

        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not email or not password:
            return self._error_response("Email and password are required.")

        try:
            credential = {"login": email, "password": password, "type": "password"}
            auth_info = request.session.authenticate(request.env, credential)
            if not auth_info.get("uid"):
                return self._error_response("Invalid email or password.", status=401)

            request._save_session()

            user = request.env["res.users"].sudo().browse(auth_info["uid"])
            user_data = {"id": user.id, "name": user.name, "email": user.login}
        except AccessDenied:
            return self._error_response("Invalid email or password.", status=401)
        except Exception:
            _logger.exception("Login error")
            return self._error_response("Login failed. Please try again.", status=500)

        return self._json_response({"success": True, "user": user_data})

    # ── OAuth (Google / Apple) ──

    @http.route("/api/v1/auth/oauth", type="http", auth="none", methods=["POST", "OPTIONS"], csrf=False)
    def auth_oauth(self, **kwargs):
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        try:
            request.session.logout(keep_db=True)
        except Exception:
            pass

        data, err = self._parse_json()
        if err:
            return err

        provider = data.get("provider", "")
        email = data.get("email", "").strip().lower()
        name = data.get("name", "").strip()

        if not email:
            return self._error_response("Email is required.")
        if provider not in ("google", "apple"):
            return self._error_response("Unsupported provider.")

        oauth_secret = os.getenv("CLEANING_OAUTH_SECRET", "")
        provided_secret = (request.httprequest.headers.get("X-OAuth-Secret") or "").strip()
        if oauth_secret and provided_secret != oauth_secret:
            return self._error_response("Invalid OAuth secret.", status=403)

        try:
            env = request.env(su=True)
            existing_user = env["res.users"].search([("login", "=", email)], limit=1)

            if existing_user:
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
                existing_user = new_user

            env["res.users.log"].with_user(existing_user.id).sudo().create({})
            user_data = {"id": existing_user.id, "name": existing_user.name, "email": email}
        except Exception:
            _logger.exception("OAuth login error")
            return self._error_response("OAuth login failed. Please try again.", status=500)

        return self._json_response({"success": True, "user": user_data})

    # ── Logout ──

    @http.route("/api/v1/auth/logout", type="http", auth="public", methods=["POST", "OPTIONS"], csrf=False)
    def auth_logout(self, **kwargs):
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        request.session.logout(keep_db=True)
        return self._json_response({"success": True, "message": "Logged out."})

    # ── Current User ──

    @http.route("/api/v1/auth/me", type="http", auth="public", methods=["GET", "OPTIONS"], csrf=False)
    def auth_me(self, **kwargs):
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        user, err = self._require_auth()
        if err:
            return err

        return self._json_response({
            "user": {"id": user.id, "name": user.name, "email": user.login},
        })

    # ── Forgot Password ──

    @http.route("/api/v1/auth/forgot-password", type="http", auth="none", methods=["POST", "OPTIONS"], csrf=False)
    def auth_forgot_password(self, **kwargs):
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        data, err = self._parse_json()
        if err:
            return err

        email = (data.get("email") or "").strip().lower()
        if not email:
            return self._error_response("Email is required.")

        try:
            env = request.env(su=True)
            user = env["res.users"].search([("login", "=", email)], limit=1)
            if user:
                Token = env["clean.password.reset.token"]
                token_str = Token.create_token_for_user(user)

                frontend_url = os.getenv("CLEANING_FRONTEND_URL", "http://localhost:3000")
                reset_url = f"{frontend_url}/reset-password?token={token_str}"

                _logger.info("[Password Reset] URL for %s : %s", email, reset_url)

                company_name = os.getenv("CLEANING_COMPANY_NAME", "Shield Cleaning")
                try:
                    safe_name = escape(user.name)
                    body_html = Markup(
                        "<div style='font-family:Arial,sans-serif;max-width:560px;margin:0 auto;'>"
                        "<p>Hi %(name)s,</p>"
                        "<p>We received a request to reset your <strong>%(company)s</strong> account password.</p>"
                        "<p style='margin:28px 0;'>"
                        "<a href='%(url)s' "
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
                        "<p style='color:#9ca3af;font-size:12px;'>The %(company)s team</p>"
                        "</div>"
                    ) % {"name": safe_name, "company": escape(company_name), "url": reset_url}

                    email_from = os.getenv(
                        "CLEANING_EMAIL_FROM",
                        f"{company_name} <noreply@shieldcleaning.co>",
                    )
                    env["mail.mail"].create({
                        "subject": f"Reset your {company_name} password",
                        "email_from": email_from,
                        "email_to": email,
                        "body_html": body_html,
                        "auto_delete": True,
                    }).send()
                except Exception as mail_err:
                    _logger.warning("[Password Reset] Email not sent for %s: %s", email, mail_err)

        except Exception:
            _logger.exception("Forgot-password error")

        return self._json_response({
            "success": True,
            "message": "If that email is registered, a reset link has been sent.",
        })

    # ── Reset Password ──

    @http.route("/api/v1/auth/reset-password", type="http", auth="none", methods=["POST", "OPTIONS"], csrf=False)
    def auth_reset_password(self, **kwargs):
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        data, err = self._parse_json()
        if err:
            return err

        token_str = (data.get("token") or "").strip()
        password = data.get("password", "")

        if not token_str:
            return self._error_response("Reset token is required.")
        if len(password) < 8:
            return self._error_response("Password must be at least 8 characters.")

        try:
            env = request.env(su=True)
            Token = env["clean.password.reset.token"]
            token_record = Token.validate_token(token_str)

            if not token_record:
                return self._error_response(
                    "This reset link is invalid or has expired. Please request a new one.",
                    status=400,
                )

            user = token_record.user_id
            user._change_password(password)
            token_record.write({"used": True})
        except Exception:
            _logger.exception("Reset-password error")
            return self._error_response("Password reset failed. Please try again.", status=500)

        return self._json_response({
            "success": True,
            "message": "Password updated successfully. You can now log in.",
        })
