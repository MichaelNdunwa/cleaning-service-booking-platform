# -*- coding: utf-8 -*-
from odoo import models, fields, api


class CleanBooking(models.Model):
    _name = "clean.booking"
    _description = "Cleaning Service Booking"
    _inherit = ["mail.thread", "mail.activity.mixin"]
    _order = "booking_date desc, id desc"

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
    service_type_id = fields.Many2one(
        "clean.service.type",
        string="Service Type",
        required=True,
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
    access_instructions = fields.Text(
        string="Access Instructions",
        help="How the cleaner can access the property (key, doorbell, etc.)",
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
    addons_amount = fields.Float(
        string="Add-ons Amount",
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
    @api.depends("service_type_id.base_price", "addon_ids.price")
    def _compute_amounts(self):
        for booking in self:
            base = booking.service_type_id.base_price if booking.service_type_id else 0.0
            addons = sum(addon.price for addon in booking.addon_ids)
            booking.base_amount = base
            booking.addons_amount = addons
            booking.amount_total = base + addons

    # ── Sequence ──
    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get("name", "New") == "New":
                vals["name"] = self.env["ir.sequence"].next_by_code("clean.booking") or "New"
        return super().create(vals_list)

    # ── State Actions ──
    def action_confirm(self):
        self.write({"state": "confirmed"})

    def action_schedule(self):
        self.write({"state": "scheduled"})

    def action_start(self):
        self.write({"state": "in_progress"})

    def action_done(self):
        self.write({"state": "done"})

    def action_cancel(self):
        self.write({"state": "cancelled"})

    def action_reset_draft(self):
        self.write({"state": "draft"})
