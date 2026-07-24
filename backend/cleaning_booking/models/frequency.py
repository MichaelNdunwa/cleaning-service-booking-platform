# -*- coding: utf-8 -*-
from odoo import models, fields


class CleanFrequency(models.Model):
    _name = "clean.frequency"
    _description = "Booking Frequency Option"
    _order = "sequence, name"

    name = fields.Char(string="Frequency", required=True)
    code = fields.Char(string="Code", required=True)
    description = fields.Text(string="Description")
    discount_pct = fields.Float(string="Discount (%)", digits=(5, 2), default=0.0)
    sequence = fields.Integer(string="Sequence", default=10)
    active = fields.Boolean(string="Active", default=True)

    _sql_constraints = [
        ("code_unique", "UNIQUE(code)", "Frequency code must be unique."),
    ]
