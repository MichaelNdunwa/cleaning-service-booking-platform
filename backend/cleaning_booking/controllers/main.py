# -*- coding: utf-8 -*-
from datetime import datetime

from odoo import http
from odoo.http import request

from .common import CleaningAPIBase


class CleaningMainAPI(CleaningAPIBase, http.Controller):
    """Public read-only endpoints for services, add-ons, and availability."""

    # ── Service Types ──

    @http.route("/api/v1/services", type="http", auth="public", methods=["GET", "OPTIONS"], csrf=False)
    def get_services(self, **kwargs):
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
                "category": s.category,
                "bedrooms": s.bedrooms,
            }
            for s in services
        ]
        return self._json_response({"services": data})

    # ── Add-ons ──

    @http.route("/api/v1/addons", type="http", auth="public", methods=["GET", "OPTIONS"], csrf=False)
    def get_addons(self, **kwargs):
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

        return self._json_response({"date": date_str, "slots": data})
