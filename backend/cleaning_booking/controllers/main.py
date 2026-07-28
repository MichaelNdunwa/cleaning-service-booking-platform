# -*- coding: utf-8 -*-
from datetime import datetime

from odoo import http
from odoo.http import request

from .common import CleaningAPIBase


class CleaningMainAPI(CleaningAPIBase, http.Controller):
    """Public read-only endpoints for pricing, clean levels, add-ons, and availability."""

    # ── Pricing Plans ──

    @http.route("/api/v1/pricing", type="http", auth="public", methods=["GET", "OPTIONS"], csrf=False)
    def get_pricing(self, **kwargs):
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        plans = request.env["clean.pricing"].sudo().search([("active", "=", True)])
        data = [
            {
                "id": p.id,
                "name": p.name,
                "label": p.label,
                "code": p.code,
                "pricing_type": p.pricing_type,
                "bedrooms": p.bedrooms,
                "base_price": p.base_price,
            }
            for p in plans
        ]
        return self._json_response({"pricing": data})

    # ── Clean Levels ──

    @http.route("/api/v1/levels", type="http", auth="public", methods=["GET", "OPTIONS"], csrf=False)
    def get_levels(self, **kwargs):
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        levels = request.env["clean.level"].sudo().search([("active", "=", True)])
        data = [
            {
                "id": l.id,
                "name": l.name,
                "code": l.code,
                "description": l.description or "",
                "base_price": l.base_price,
            }
            for l in levels
        ]
        return self._json_response({"levels": data})

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

    # ── Unified Catalog ──

    @http.route("/api/v1/catalog", type="http", auth="public", methods=["GET", "OPTIONS"], csrf=False)
    def get_catalog(self, **kwargs):
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        pricing = request.env["clean.pricing"].sudo().search([("active", "=", True)])
        levels = request.env["clean.level"].sudo().search([("active", "=", True)])
        addons = request.env["clean.addon"].sudo().search([("active", "=", True)])
        frequencies = request.env["clean.frequency"].sudo().search([("active", "=", True)])
        bathroom_options = request.env["clean.bathroom.option"].sudo().search([("active", "=", True)])
        bedroom_options = request.env["clean.bedroom.option"].sudo().search([("active", "=", True)])
        access_methods = request.env["clean.access.method"].sudo().search([("active", "=", True)])
        contact_prefs = request.env["clean.contact.preference"].sudo().search([("active", "=", True)])

        data = {
            "pricing": [
                {
                    "id": p.id,
                    "name": p.name,
                    "label": p.label,
                    "code": p.code,
                    "pricing_type": p.pricing_type,
                    "bedrooms": p.bedrooms,
                    "base_price": p.base_price,
                }
                for p in pricing
            ],
            "levels": [
                {
                    "id": l.id,
                    "name": l.name,
                    "code": l.code,
                    "description": l.description or "",
                    "duration": l.duration or "",
                    "base_price": l.base_price,
                }
                for l in levels
            ],
            "addons": [
                {
                    "id": a.id,
                    "name": a.name,
                    "code": a.code,
                    "description": a.description or "",
                    "price": a.price,
                    "duration_delta": a.duration_delta,
                }
                for a in addons
            ],
            "frequencies": [
                {
                    "id": f.id,
                    "name": f.name,
                    "code": f.code,
                    "discount_pct": f.discount_pct,
                    "description": f.description or "",
                }
                for f in frequencies
            ],
            "bathroom_options": [
                {
                    "value": b.value,
                    "name": b.name,
                    "surcharge": b.surcharge,
                }
                for b in bathroom_options
            ],
            "bedroom_options": [
                {
                    "value": b.value,
                    "name": b.name,
                    "surcharge": b.surcharge,
                }
                for b in bedroom_options
            ],
            "access_methods": [
                {
                    "code": m.code,
                    "name": m.name,
                }
                for m in access_methods
            ],
            "contact_preferences": [
                {
                    "code": c.code,
                    "name": c.name,
                }
                for c in contact_prefs
            ],
        }

        return self._json_response(data)

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
