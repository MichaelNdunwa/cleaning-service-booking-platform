# -*- coding: utf-8 -*-
import json
import logging
import os

from odoo.http import request, Response

_logger = logging.getLogger(__name__)


class CleaningAPIBase:
    """Shared helpers for all cleaning API controllers."""

    def _allowed_origins(self):
        raw_origins = os.getenv("CLEANING_ALLOWED_ORIGINS", "http://localhost:3000")
        origins = [origin.strip().rstrip("/") for origin in raw_origins.split(",") if origin.strip()]
        return origins or ["http://localhost:3000"]

    def _cors_headers(self):
        origin = (request.httprequest.headers.get("Origin") or "").strip().rstrip("/")
        headers = {
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-OAuth-Secret",
            "Access-Control-Allow-Credentials": "true",
            "Vary": "Origin",
        }
        if origin and origin in self._allowed_origins():
            headers["Access-Control-Allow-Origin"] = origin
        return headers

    def _json_response(self, data, status=200):
        return Response(
            json.dumps(data, default=str),
            status=status,
            content_type="application/json",
            headers=self._cors_headers(),
        )

    def _error_response(self, message, status=400):
        return self._json_response({"error": message}, status=status)

    def _parse_json(self):
        try:
            return json.loads(request.httprequest.data), None
        except (json.JSONDecodeError, TypeError):
            return None, self._error_response("Invalid JSON body.")

    def _require_session(self):
        """Return the authenticated user's env or None. Sets uid to None if unauthenticated."""
        uid = request.session.uid
        if not uid:
            return None
        user = request.env["res.users"].sudo().browse(uid)
        if not user.exists():
            return None
        return user

    def _require_auth(self):
        """Return the current user or a 401 error response tuple."""
        user = self._require_session()
        if not user:
            return None, self._error_response("Not authenticated.", status=401)
        return user, None
