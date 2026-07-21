# -*- coding: utf-8 -*-
from odoo import models, fields, api
from odoo.exceptions import ValidationError


class CleanPricing(models.Model):
    _name = "clean.pricing"
    _description = "Cleaning Pricing Configuration"
    _order = "sequence, name"

    name = fields.Char(string="Plan Name", required=True)
    code = fields.Char(string="Code", required=True)
    pricing_type = fields.Selection([
        ("bedroom", "By Bedroom"),
        ("flat", "Flat Rate"),
    ], string="Pricing Type", required=True, default="bedroom")
    bedrooms = fields.Integer(
        string="Bedrooms",
        help="Number of bedrooms. 0 = Studio. Only used for 'By Bedroom' pricing.",
    )
    base_price = fields.Float(string="Base Price", required=True, digits=(10, 2))
    sequence = fields.Integer(string="Sequence", default=10)
    active = fields.Boolean(string="Active", default=True)

    _sql_constraints = [
        ("code_unique", "UNIQUE(code)", "Pricing code must be unique."),
    ]

    @api.constrains("bedrooms", "pricing_type")
    def _check_bedrooms(self):
        for record in self:
            if record.pricing_type == "bedroom" and record.bedrooms < 0:
                raise ValidationError("Number of bedrooms cannot be negative.")
