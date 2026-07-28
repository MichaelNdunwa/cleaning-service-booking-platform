# -*- coding: utf-8 -*-
from odoo import models, fields


class CleanBedroomOption(models.Model):
    _name = "clean.bedroom.option"
    _description = "Bedroom Count Option"
    _order = "sequence"

    name = fields.Char(string="Label", required=True)
    value = fields.Integer(string="Count", required=True)
    surcharge = fields.Float(string="Surcharge", digits=(10, 2), default=0.0)
    sequence = fields.Integer(string="Sequence", default=10)
    active = fields.Boolean(string="Active", default=True)
