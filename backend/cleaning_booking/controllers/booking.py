# -*- coding: utf-8 -*-
from datetime import datetime

from odoo import http
from odoo.http import request

from .common import CleaningAPIBase


class CleaningBookingAPI(CleaningAPIBase, http.Controller):
    """Booking and customer endpoints. Require authentication."""

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

    def _serialize_booking(self, booking):
        return {
            "id": booking.id,
            "reference": booking.name,
            "customer": {
                "name": booking.customer_id.name,
                "email": booking.customer_email,
                "phone": booking.customer_phone or "",
            },
            "pricing": {
                "id": booking.pricing_id.id,
                "name": booking.pricing_id.name,
                "label": booking.pricing_id.label,
            },
            "clean_level": {
                "id": booking.clean_level_id.id,
                "name": booking.clean_level_id.name,
            } if booking.clean_level_id else None,
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
            "access_method": {
                "id": booking.access_method_id.id,
                "name": booking.access_method_id.name,
                "code": booking.access_method_id.code,
            } if booking.access_method_id else None,
            "access_instructions": booking.access_instructions or "",
            "contact_preference": {
                "id": booking.contact_preference_id.id,
                "name": booking.contact_preference_id.name,
                "code": booking.contact_preference_id.code,
            } if booking.contact_preference_id else None,
            "bedrooms": booking.bedrooms,
            "bathrooms": booking.bathrooms,
            "base_amount": booking.base_amount,
            "extras_amount": booking.extras_amount,
            "bathroom_amount": booking.bathroom_amount,
            "discount_amount": booking.discount_amount,
            "amount_total": booking.amount_total,
            "state": booking.state,
            "payment_status": booking.payment_status,
            "payment_reference": booking.payment_reference or "",
            "notes": booking.notes or "",
        }

    # ── Create Booking ──

    @http.route("/api/v1/booking", type="http", auth="public", methods=["POST", "OPTIONS"], csrf=False)
    def create_booking(self, **kwargs):
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        data, err = self._parse_json()
        if err:
            return err

        required = ["pricing_id", "booking_date", "time_slot_id"]
        missing = [f for f in required if f not in data]
        if missing:
            return self._error_response(f"Missing required fields: {', '.join(missing)}")

        customer_data = data.get("customer", {})
        if not customer_data.get("email"):
            return self._error_response("Customer email is required.")

        customer = self._find_or_create_customer(customer_data)
        if not customer:
            return self._error_response("Customer email is required.")

        try:
            booking_date = datetime.strptime(data["booking_date"], "%Y-%m-%d").date()
        except ValueError:
            return self._error_response("Invalid booking_date format. Use YYYY-MM-DD.")

        vals = {
            "customer_id": customer.id,
            "pricing_id": int(data["pricing_id"]),
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

        clean_level_id = data.get("clean_level_id")
        if clean_level_id:
            vals["clean_level_id"] = int(clean_level_id)

        addon_ids = data.get("addon_ids", [])
        if addon_ids:
            vals["addon_ids"] = [(6, 0, [int(a) for a in addon_ids])]

        # Resolve access method code to FK
        access_method_code = data.get("access_method_code")
        if access_method_code:
            method = request.env["clean.access.method"].sudo().search(
                [("code", "=", access_method_code), ("active", "=", True)], limit=1
            )
            if method:
                vals["access_method_id"] = method.id

        # Resolve contact preference code to FK
        contact_preference_code = data.get("contact_preference_code")
        if contact_preference_code:
            pref = request.env["clean.contact.preference"].sudo().search(
                [("code", "=", contact_preference_code), ("active", "=", True)], limit=1
            )
            if pref:
                vals["contact_preference_id"] = pref.id

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
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        user, err = self._require_auth()
        if err:
            return err

        booking = request.env["clean.booking"].sudo().browse(booking_id)
        if not booking.exists():
            return self._error_response("Booking not found.", status=404)

        if booking.customer_id.id != user.partner_id.id and not user._is_admin():
            return self._error_response("Access denied.", status=403)

        return self._json_response({"booking": self._serialize_booking(booking)})

    # ── Create / Update Customer ──

    @http.route("/api/v1/customer", type="http", auth="public", methods=["POST", "OPTIONS"], csrf=False)
    def create_customer(self, **kwargs):
        if request.httprequest.method == "OPTIONS":
            return self._json_response({})

        data, err = self._parse_json()
        if err:
            return err

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
