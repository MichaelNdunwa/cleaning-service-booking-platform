# -*- coding: utf-8 -*-
from odoo import models, fields, api
from odoo.exceptions import UserError


class CleanBooking(models.Model):
    _name = "clean.booking"
    _description = "Cleaning Service Booking"
    _inherit = ["mail.thread", "mail.activity.mixin"]
    _order = "booking_date desc, id desc"

    VALID_TRANSITIONS = {
        "draft": {"confirmed", "cancelled"},
        "confirmed": {"scheduled", "cancelled"},
        "scheduled": {"in_progress", "cancelled"},
        "in_progress": {"done"},
        "done": set(),
        "cancelled": {"draft"},
    }

    # ── Identification ──
    name = fields.Char(
        string="Reference",
        required=True,
        copy=False,
        readonly=True,
        default="New",
    )

    # ── Customer ──
    customer_id = fields.Many2one(
        "res.partner",
        string="Customer",
        required=True,
        tracking=True,
    )
    customer_email = fields.Char(related="customer_id.email", string="Email", store=True)
    customer_phone = fields.Char(related="customer_id.phone", string="Phone", store=True)

    # ── Service Details ──
    pricing_id = fields.Many2one(
        "clean.pricing",
        string="Property / Size",
        required=True,
        tracking=True,
    )
    clean_level_id = fields.Many2one(
        "clean.level",
        string="Clean Level",
        tracking=True,
    )
    addon_ids = fields.Many2many(
        "clean.addon",
        "clean_booking_addon_rel",
        "booking_id",
        "addon_id",
        string="Add-ons",
    )

    # ── Scheduling ──
    booking_date = fields.Date(string="Booking Date", required=True, tracking=True)
    time_slot_id = fields.Many2one(
        "clean.time.slot",
        string="Time Slot",
        required=True,
        tracking=True,
    )

    # ── Frequency ──
    frequency = fields.Selection(
        [
            ("one_time", "One-time"),
            ("weekly", "Weekly"),
            ("fortnightly", "Fortnightly"),
            ("monthly", "Monthly"),
        ],
        string="Frequency",
        default="one_time",
        required=True,
        tracking=True,
    )

    # ── Address ──
    address_line_1 = fields.Char(string="Address Line 1")
    address_line_2 = fields.Char(string="Address Line 2")
    city = fields.Char(string="City")
    postcode = fields.Char(string="Postcode")
    access_method_id = fields.Many2one(
        "clean.access.method",
        string="Access Method",
    )
    access_instructions = fields.Text(
        string="Access Instructions",
        help="How the cleaner can access the property (key, doorbell, etc.)",
    )

    # ── Contact Preference ──
    contact_preference_id = fields.Many2one(
        "clean.contact.preference",
        string="Preferred Contact",
    )

    # ── Property Details ──
    bedrooms = fields.Integer(string="Bedrooms", default=1)
    bathrooms = fields.Integer(string="Bathrooms", default=1)

    # ── Pricing ──
    base_amount = fields.Float(
        string="Base Amount",
        digits=(10, 2),
        compute="_compute_amounts",
        store=True,
    )
    extras_amount = fields.Float(
        string="Extras Amount",
        digits=(10, 2),
        compute="_compute_amounts",
        store=True,
    )
    bathroom_amount = fields.Float(
        string="Bathroom Surcharge",
        digits=(10, 2),
        compute="_compute_amounts",
        store=True,
    )
    discount_amount = fields.Float(
        string="Frequency Discount",
        digits=(10, 2),
        compute="_compute_amounts",
        store=True,
    )
    amount_total = fields.Float(
        string="Total Amount",
        digits=(10, 2),
        compute="_compute_amounts",
        store=True,
        tracking=True,
    )

    # ── Workflow State ──
    state = fields.Selection(
        [
            ("draft", "Draft"),
            ("confirmed", "Confirmed"),
            ("scheduled", "Scheduled"),
            ("in_progress", "In Progress"),
            ("done", "Done"),
            ("cancelled", "Cancelled"),
        ],
        string="Status",
        default="draft",
        required=True,
        tracking=True,
    )

    # ── Payment ──
    payment_reference = fields.Char(string="Payment Reference", copy=False)
    payment_status = fields.Selection(
        [
            ("pending", "Pending"),
            ("paid", "Paid"),
            ("failed", "Failed"),
            ("refunded", "Refunded"),
        ],
        string="Payment Status",
        default="pending",
        tracking=True,
    )

    # ── Notes ──
    notes = fields.Text(string="Customer Notes")
    internal_notes = fields.Text(string="Internal Notes")

    # ── Computed Fields ──
    @api.depends(
        "pricing_id.base_price",
        "clean_level_id.base_price",
        "addon_ids.price",
        "bathrooms",
        "frequency",
    )
    def _compute_amounts(self):
        FreqModel = self.env["clean.frequency"]
        BathModel = self.env["clean.bathroom.option"]

        for booking in self:
            # 1. Bedroom base price
            base = booking.pricing_id.base_price if booking.pricing_id else 0.0

            # 2. Clean level surcharge
            clean = booking.clean_level_id.base_price if booking.clean_level_id else 0.0

            # 3. Add-ons
            addons = sum(addon.price for addon in booking.addon_ids)

            # 4. Bathroom surcharge — look up by integer value
            bath_opt = BathModel.search(
                [("value", "=", booking.bathrooms), ("active", "=", True)], limit=1
            )
            bath = bath_opt.surcharge if bath_opt else 0.0

            subtotal = base + clean + addons + bath

            # 5. Frequency discount — applied to the full subtotal
            freq_rec = FreqModel.search(
                [("code", "=", booking.frequency), ("active", "=", True)], limit=1
            )
            discount_pct = freq_rec.discount_pct if freq_rec else 0.0
            discount = round(subtotal * (discount_pct / 100.0), 2)

            booking.base_amount = base
            booking.extras_amount = clean + addons + bath
            booking.bathroom_amount = bath
            booking.discount_amount = discount
            booking.amount_total = subtotal - discount

    # ── Sequence ──
    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get("name", "New") == "New":
                vals["name"] = self.env["ir.sequence"].next_by_code("clean.booking") or "New"
        return super().create(vals_list)

    # ── State Actions ──
    def _validate_state_transition(self, new_state):
        for record in self:
            allowed = self.VALID_TRANSITIONS.get(record.state, set())
            if new_state not in allowed:
                raise UserError(
                    self.env._(
                        "Cannot move booking %(name)s from '%(current)s' to '%(target)s'.",
                        name=record.name,
                        current=record.state,
                        target=new_state,
                    )
                )

    def action_confirm(self):
        self._validate_state_transition("confirmed")
        self.write({"state": "confirmed"})

    def action_schedule(self):
        self._validate_state_transition("scheduled")
        self.write({"state": "scheduled"})

    def action_start(self):
        self._validate_state_transition("in_progress")
        self.write({"state": "in_progress"})

    def action_done(self):
        self._validate_state_transition("done")
        self.write({"state": "done"})

    def action_cancel(self):
        self._validate_state_transition("cancelled")
        self.write({"state": "cancelled"})

    def action_reset_draft(self):
        self._validate_state_transition("draft")
        self.write({"state": "draft"})
