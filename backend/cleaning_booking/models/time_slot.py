# -*- coding: utf-8 -*-
from odoo import models, fields


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
