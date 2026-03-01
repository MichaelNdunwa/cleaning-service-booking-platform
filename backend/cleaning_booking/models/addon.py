# -*- coding: utf-8 -*-
from odoo import models, fields


class CleanAddon(models.Model):
    _name = "clean.addon"
    _description = "Cleaning Add-on Service"
    _order = "sequence, name"

    name = fields.Char(string="Add-on Name", required=True)
    code = fields.Char(string="Code", required=True)
    description = fields.Text(string="Description")
    price = fields.Float(string="Price", required=True, digits=(10, 2))
    duration_delta = fields.Float(
        string="Extra Duration (hours)",
        default=0.0,
        help="Additional time this add-on adds to the booking duration.",
    )
    sequence = fields.Integer(string="Sequence", default=10)
    active = fields.Boolean(string="Active", default=True)

    _sql_constraints = [
        ("code_unique", "UNIQUE(code)", "Add-on code must be unique."),
    ]
