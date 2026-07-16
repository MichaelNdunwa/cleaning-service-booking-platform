# -*- coding: utf-8 -*-
from odoo import models, fields, api
from odoo.exceptions import ValidationError


class CleanServiceType(models.Model):
    _name = "clean.service.type"
    _description = "Cleaning Service Type"
    _order = "sequence, name"

    name = fields.Char(string="Service Name", required=True)
    code = fields.Char(string="Code", required=True)
    description = fields.Text(string="Description")
    base_price = fields.Float(string="Base Price", required=True, digits=(10, 2))
    category = fields.Selection([
        ("property", "Property Type"),
        ("clean_level", "Clean Level"),
        ("specialty", "Specialty"),
    ], string="Category", required=True, default="property")
    bedrooms = fields.Integer(string="Bedrooms", help="Number of bedrooms for property types. 0=Studio.")
    sequence = fields.Integer(string="Sequence", default=10)
    active = fields.Boolean(string="Active", default=True)
    image = fields.Binary(string="Image", attachment=True)

    _sql_constraints = [
        ("code_unique", "UNIQUE(code)", "Service type code must be unique."),
    ]

    @api.constrains("bedrooms")
    def _check_bedrooms(self):
        for record in self:
            if record.bedrooms < 0:
                raise ValidationError("Number of bedrooms cannot be negative.")
