# -*- coding: utf-8 -*-
from odoo import models, fields


class CleanAccessMethod(models.Model):
    _name = "clean.access.method"
    _description = "Property Access Method"
    _order = "sequence, name"

    name = fields.Char(string="Method", required=True)
    code = fields.Char(string="Code", required=True)
    sequence = fields.Integer(string="Sequence", default=10)
    active = fields.Boolean(string="Active", default=True)

    _sql_constraints = [
        ("code_unique", "UNIQUE(code)", "Access method code must be unique."),
    ]
