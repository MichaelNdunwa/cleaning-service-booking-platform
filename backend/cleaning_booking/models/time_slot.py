# -*- coding: utf-8 -*-
from odoo import models, fields, api
from odoo.exceptions import ValidationError


class CleanTimeSlot(models.Model):
    _name = "clean.time.slot"
    _description = "Cleaning Time Slot"
    _order = "sequence, start_hour"

    name = fields.Char(string="Slot Name", required=True)
    start_hour = fields.Float(string="Start Time", required=True, help="24h format, e.g. 9.0 = 09:00")
    end_hour = fields.Float(string="End Time", required=True, help="24h format, e.g. 12.0 = 12:00")
    capacity = fields.Integer(
        string="Max Bookings",
        default=5,
        help="Maximum number of bookings allowed in this time slot per day.",
    )
    sequence = fields.Integer(string="Sequence", default=10)
    active = fields.Boolean(string="Active", default=True)

    _sql_constraints = [
        ("start_before_end", "CHECK(start_hour < end_hour)", "Start time must be before end time."),
    ]

    @api.constrains("start_hour", "end_hour")
    def _check_hours_bounds(self):
        for slot in self:
            if slot.start_hour < 0 or slot.end_hour > 24:
                raise ValidationError("Hours must be between 0 and 24.")
