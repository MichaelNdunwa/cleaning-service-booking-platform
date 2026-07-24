# -*- coding: utf-8 -*-
from odoo import models, fields


class CleanContactPreference(models.Model):
    _name = "clean.contact.preference"
    _description = "Contact Preference"
    _order = "sequence, name"

    name = fields.Char(string="Preference", required=True)
    code = fields.Char(string="Code", required=True)
    sequence = fields.Integer(string="Sequence", default=10)
    active = fields.Boolean(string="Active", default=True)

    _sql_constraints = [
        ("code_unique", "UNIQUE(code)", "Contact preference code must be unique."),
    ]
