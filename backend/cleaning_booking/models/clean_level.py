# -*- coding: utf-8 -*-
from odoo import models, fields, api
from odoo.exceptions import ValidationError


class CleanLevel(models.Model):
    _name = "clean.level"
    _description = "Cleaning Level"
    _order = "sequence, name"

    name = fields.Char(string="Level Name", required=True)
    code = fields.Char(string="Code", required=True)
    description = fields.Text(string="Description")
    duration = fields.Char(string="Duration", help="Estimated time, e.g. '2 hours'")
    base_price = fields.Float(string="Surcharge Price", required=True, digits=(10, 2))
    sequence = fields.Integer(string="Sequence", default=10)
    active = fields.Boolean(string="Active", default=True)

    _sql_constraints = [
        ("code_unique", "UNIQUE(code)", "Clean level code must be unique."),
    ]
