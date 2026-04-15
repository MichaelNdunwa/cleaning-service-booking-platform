# -*- coding: utf-8 -*-
from datetime import timedelta

from odoo import models, fields, api


class CleanPasswordResetToken(models.Model):
    """One-time password-reset tokens for the customer-facing API.

    Each token is:
    - Single-use  (used flag is set after a successful reset)
    - Time-limited (expires 24 hours after creation)
    - Linked to a specific Odoo user
    """

    _name = "clean.password.reset.token"
    _description = "Cleaning – Password Reset Token"
    _order = "create_date desc"

    token = fields.Char(
        string="Token",
        required=True,
        index=True,
        readonly=True,
        copy=False,
    )
    user_id = fields.Many2one(
        "res.users",
        string="User",
        required=True,
        ondelete="cascade",
        readonly=True,
    )
    expires_at = fields.Datetime(
        string="Expires At",
        required=True,
        readonly=True,
    )
    used = fields.Boolean(string="Used", default=False)

    @api.model
    def create_token_for_user(self, user):
        """Generate a fresh token for *user* and return the token string.

        Any previous unused tokens for this user are invalidated first to
        prevent token accumulation.
        """
        import secrets

        # Invalidate any existing unused tokens for this user
        self.search([("user_id", "=", user.id), ("used", "=", False)]).write(
            {"used": True}
        )

        token_str = secrets.token_urlsafe(48)
        expires = fields.Datetime.now() + timedelta(hours=24)

        self.create(
            {
                "token": token_str,
                "user_id": user.id,
                "expires_at": expires,
            }
        )
        return token_str

    @api.model
    def validate_token(self, token_str):
        """Return the token record if valid, or None.

        A token is valid when it:
        - exists
        - has not been used
        - has not expired
        """
        record = self.search([("token", "=", token_str), ("used", "=", False)], limit=1)
        if not record:
            return None
        if record.expires_at < fields.Datetime.now():
            return None
        return record
