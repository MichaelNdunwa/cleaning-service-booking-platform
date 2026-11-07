# -*- coding: utf-8 -*-
"""
Lumora Email Service
====================
A clean, lightweight client for the Lumora transactional email & campaign API
(https://uselumora.io).

Environment variables:
    LUMORA_API_KEY        – secret key (esk_... or lum_sk_...)
    LUMORA_FROM_EMAIL     – verified sending address (e.g. hello@yourdomain.com)
    LUMORA_FROM_NAME      – display name (default: "Shield Cleaning")
    LUMORA_API_BASE_URL   – API base URL (default: "https://uselumora.io")
"""

import json
import logging
import os
import urllib.error
import urllib.parse
import urllib.request

_logger = logging.getLogger(__name__)

_DEFAULT_BASE_URL = "https://uselumora.io"
_TIMEOUT_SECONDS = 15


class LumoraMailService:
    """Stateless client for Lumora REST API."""

    @classmethod
    def _get_config(cls) -> tuple[str, str, str, str]:
        api_key = os.getenv("LUMORA_API_KEY", "").strip()
        base_url = os.getenv("LUMORA_API_BASE_URL", _DEFAULT_BASE_URL).strip().rstrip("/")
        from_email = os.getenv("LUMORA_FROM_EMAIL", "").strip()
        from_name = os.getenv("LUMORA_FROM_NAME", "Shield Cleaning").strip()
        return api_key, base_url, from_email, from_name

    @classmethod
    def _request(
        cls,
        endpoint: str,
        method: str = "GET",
        payload: dict | list | None = None,
    ) -> tuple[bool, dict]:
        """Base request helper with dual authentication headers."""
        api_key, base_url, _, _ = cls._get_config()

        if not api_key:
            _logger.error("[Lumora] API key is missing.")
            return False, {"error": "config_missing", "message": "LUMORA_API_KEY is not configured."}

        url = f"{base_url}{endpoint}"
        headers = {
            "Content-Type": "application/json",
            "x-api-key": api_key,
            "Authorization": f"Bearer {api_key}",
            "User-Agent": "ShieldCleaning-Lumora/1.0",
        }

        data_bytes = json.dumps(payload).encode("utf-8") if payload is not None else None
        req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)

        try:
            with urllib.request.urlopen(req, timeout=_TIMEOUT_SECONDS) as resp:
                raw = resp.read()
                try:
                    result = json.loads(raw) if raw else {}
                except json.JSONDecodeError:
                    result = {"raw": raw.decode("utf-8", errors="replace")}
                return True, result

        except urllib.error.HTTPError as exc:
            raw = exc.read()
            try:
                error_body = json.loads(raw) if raw else {}
            except json.JSONDecodeError:
                error_body = {"raw": raw.decode("utf-8", errors="replace")}
            _logger.warning("[Lumora] HTTP %s on %s %s: %s", exc.code, method, endpoint, error_body)
            return False, {"status": exc.code, **error_body}

        except urllib.error.URLError as exc:
            _logger.warning("[Lumora] Network error on %s %s: %s", method, endpoint, exc.reason)
            return False, {"error": "network_error", "message": str(exc.reason)}

        except Exception as exc:  # noqa: BLE001
            _logger.exception("[Lumora] Unexpected error on %s %s", method, endpoint)
            return False, {"error": "unexpected", "message": str(exc)}

    # ── Core Email Send ────────────────────────────────────────────────────────

    @classmethod
    def send(
        cls,
        to_email: str,
        subject: str,
        html: str,
        *,
        to_name: str = "",
        text: str = "",
        from_email: str = "",
        from_name: str = "",
        reply_to: str = "",
        variables: dict | None = None,
        metadata: dict | None = None,
    ) -> tuple[bool, dict]:
        """
        Send a transactional email via Lumora (POST /v1/email/send).

        Docs format:
          from: { email: "...", name: "..." } (or omitted for default app sender)
          to: [ { email: "...", name: "..." } ]
        """
        _, _, default_from_email, default_from_name = cls._get_config()

        eff_from_email = (from_email or default_from_email).strip()
        eff_from_name = (from_name or default_from_name).strip()

        recipient: dict = {"email": to_email}
        if to_name:
            recipient["name"] = to_name

        payload: dict = {
            "to": [recipient],
            "subject": subject,
            "html": html,
        }

        if eff_from_email:
            from_obj: dict = {"email": eff_from_email}
            if eff_from_name:
                from_obj["name"] = eff_from_name
            payload["from"] = from_obj

        if text:
            payload["text"] = text
        if reply_to:
            payload["replyTo"] = reply_to
        if variables:
            payload["variables"] = variables
        if metadata:
            payload["metadata"] = metadata

        return cls._request("/v1/email/send", method="POST", payload=payload)

    # ── Convenience Email Flows ────────────────────────────────────────────────

    @classmethod
    def send_welcome(
        cls,
        to_email: str,
        to_name: str,
        company_name: str = "",
        from_email: str = "",
        from_name: str = "",
    ) -> tuple[bool, dict]:
        """Send a post-signup welcome email."""
        company = company_name or os.getenv("CLEANING_COMPANY_NAME", "Shield Cleaning")
        subject = f"Welcome to {company}! 🧹"
        frontend_url = os.getenv("CLEANING_FRONTEND_URL", "http://localhost:3000")

        html = f"""\
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;border:1px solid #e5e7eb;border-radius:12px;">
  <h2 style="color:#0B1536;margin-bottom:12px;">Welcome, {to_name or 'there'}!</h2>
  <p style="color:#4b5563;font-size:15px;line-height:1.6;">
    Your <strong>{company}</strong> account is ready. You can now book residential,
    office, or deep cleaning services in under 60 seconds.
  </p>
  <div style="margin:28px 0;">
    <a href="{frontend_url}/booking"
       style="display:inline-block;padding:12px 26px;background:#1E78FF;
              color:#ffffff;border-radius:8px;text-decoration:none;
              font-weight:700;font-size:15px;">
      Book your first clean
    </a>
  </div>
  <p style="color:#9ca3af;font-size:13px;line-height:1.5;">
    If you did not sign up for this account, you can safely ignore this email.
  </p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
  <p style="color:#9ca3af;font-size:12px;">The {company} team &nbsp;·&nbsp; {frontend_url}</p>
</div>"""
        text = (
            f"Welcome, {to_name or 'there'}!\n\n"
            f"Your {company} account is ready. Book your first clean at {frontend_url}/booking\n\n"
            f"— The {company} team"
        )
        return cls.send(
            to_email=to_email,
            to_name=to_name,
            subject=subject,
            html=html,
            text=text,
            from_email=from_email,
            from_name=from_name,
            variables={"name": to_name, "company": company},
        )

    @classmethod
    def send_password_reset(
        cls,
        to_email: str,
        to_name: str,
        reset_url: str,
        company_name: str = "",
        from_email: str = "",
        from_name: str = "",
    ) -> tuple[bool, dict]:
        """Send a password reset email with a one-time link."""
        company = company_name or os.getenv("CLEANING_COMPANY_NAME", "Shield Cleaning")
        subject = f"Reset your {company} password"
        html = f"""\
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;border:1px solid #e5e7eb;border-radius:12px;">
  <p style="color:#0B1536;font-size:16px;">Hi {to_name or 'there'},</p>
  <p style="color:#4b5563;font-size:15px;line-height:1.6;">
    We received a request to reset your <strong>{company}</strong> account password.
  </p>
  <div style="margin:28px 0;">
    <a href="{reset_url}"
       style="display:inline-block;padding:12px 26px;background:#1E78FF;
              color:#ffffff;border-radius:8px;text-decoration:none;
              font-weight:700;font-size:15px;">
      Reset my password
    </a>
  </div>
  <p style="color:#6b7280;font-size:13px;line-height:1.5;">
    This link expires in <strong>24 hours</strong>. If you did not request a password reset,
    your password will remain unchanged.
  </p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
  <p style="color:#9ca3af;font-size:12px;">The {company} team</p>
</div>"""
        text = (
            f"Hi {to_name or 'there'},\n\n"
            f"Reset your {company} password by visiting:\n{reset_url}\n\n"
            "This link expires in 24 hours.\n\n"
            f"— The {company} team"
        )
        return cls.send(
            to_email=to_email,
            to_name=to_name,
            subject=subject,
            html=html,
            text=text,
            from_email=from_email,
            from_name=from_name,
            variables={"name": to_name, "company": company, "reset_url": reset_url},
        )

    @classmethod
    def send_booking_confirmation(
        cls,
        to_email: str,
        to_name: str,
        booking_reference: str,
        booking_date: str,
        time_slot_name: str,
        pricing_label: str,
        amount_total: float,
        frequency: str,
        address_line_1: str = "",
        city: str = "",
        company_name: str = "",
        from_email: str = "",
        from_name: str = "",
    ) -> tuple[bool, dict]:
        """Send a booking confirmation email to the customer."""
        company = company_name or os.getenv("CLEANING_COMPANY_NAME", "Shield Cleaning")
        frontend_url = os.getenv("CLEANING_FRONTEND_URL", "http://localhost:3000")

        freq_labels = {
            "one_time": "One-time",
            "weekly": "Weekly",
            "fortnightly": "Fortnightly",
            "monthly": "Monthly",
        }
        freq_label = freq_labels.get(frequency, frequency.replace("_", " ").title())

        address_parts = [p for p in [address_line_1, city] if p]
        address_str = ", ".join(address_parts) if address_parts else "—"

        subject = f"Booking confirmed – {booking_reference} | {company}"
        html = f"""\
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;border:1px solid #e5e7eb;border-radius:12px;">
  <h2 style="color:#0B1536;margin-bottom:8px;">Your booking is confirmed! 🧹</h2>
  <p style="color:#4b5563;font-size:15px;line-height:1.6;">
    Hi {to_name or 'there'}, thank you for booking with <strong>{company}</strong>.
  </p>

  <table style="width:100%;border-collapse:collapse;margin:24px 0;font-size:14px;">
    <tr style="background:#f9fafb;">
      <td style="padding:10px 14px;color:#6b7280;width:38%;">Reference</td>
      <td style="padding:10px 14px;font-weight:700;color:#0B1536;">{booking_reference}</td>
    </tr>
    <tr>
      <td style="padding:10px 14px;color:#6b7280;">Date</td>
      <td style="padding:10px 14px;color:#0B1536;">{booking_date}</td>
    </tr>
    <tr style="background:#f9fafb;">
      <td style="padding:10px 14px;color:#6b7280;">Time Slot</td>
      <td style="padding:10px 14px;color:#0B1536;">{time_slot_name}</td>
    </tr>
    <tr>
      <td style="padding:10px 14px;color:#6b7280;">Service</td>
      <td style="padding:10px 14px;color:#0B1536;">{pricing_label}</td>
    </tr>
    <tr style="background:#f9fafb;">
      <td style="padding:10px 14px;color:#6b7280;">Frequency</td>
      <td style="padding:10px 14px;color:#0B1536;">{freq_label}</td>
    </tr>
    <tr>
      <td style="padding:10px 14px;color:#6b7280;">Address</td>
      <td style="padding:10px 14px;color:#0B1536;">{address_str}</td>
    </tr>
    <tr style="background:#eff6ff;">
      <td style="padding:12px 14px;font-weight:600;color:#1e40af;">Total Amount</td>
      <td style="padding:12px 14px;font-size:16px;font-weight:700;color:#1E78FF;">${amount_total:.2f}</td>
    </tr>
  </table>

  <p style="color:#6b7280;font-size:13px;line-height:1.5;">
    Need to make changes or reschedule? Contact our support team or check your booking status online.
  </p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
  <p style="color:#9ca3af;font-size:12px;">The {company} team &nbsp;·&nbsp; {frontend_url}</p>
</div>"""
        text = (
            f"Your booking is confirmed!\n\n"
            f"Reference: {booking_reference}\n"
            f"Date: {booking_date}\n"
            f"Time: {time_slot_name}\n"
            f"Service: {pricing_label}\n"
            f"Frequency: {freq_label}\n"
            f"Address: {address_str}\n"
            f"Total: ${amount_total:.2f}\n\n"
            f"— The {company} team"
        )
        return cls.send(
            to_email=to_email,
            to_name=to_name,
            subject=subject,
            html=html,
            text=text,
            from_email=from_email,
            from_name=from_name,
            variables={
                "name": to_name,
                "reference": booking_reference,
                "date": booking_date,
                "total": f"${amount_total:.2f}",
            },
        )

    # ── Analytics & Logs ───────────────────────────────────────────────────────

    @classmethod
    def get_stats(cls) -> tuple[bool, dict]:
        """Fetch aggregate delivery statistics (GET /v1/emails/stats)."""
        return cls._request("/v1/emails/stats", method="GET")

    @classmethod
    def get_logs(cls) -> tuple[bool, dict]:
        """Fetch email delivery logs (GET /v1/emails/logs)."""
        return cls._request("/v1/emails/logs", method="GET")

    @classmethod
    def get_message(cls, message_id: str) -> tuple[bool, dict]:
        """Retrieve delivery detail for a single message (GET /v1/messages/{messageId})."""
        return cls._request(f"/v1/messages/{urllib.parse.quote(message_id)}", method="GET")

    # ── Audiences & Contacts ───────────────────────────────────────────────────

    @classmethod
    def list_audiences(cls) -> tuple[bool, dict]:
        """Fetch all marketing audiences (GET /v1/marketing/lists)."""
        return cls._request("/v1/marketing/lists", method="GET")

    @classmethod
    def create_audience_and_contacts(
        cls,
        name: str,
        contacts: list[dict] | None = None,
        description: str = "",
        company_name: str = "",
        company_address: str = "",
        require_double_opt_in: bool = False,
    ) -> tuple[bool, dict]:
        """
        Create audience + import contacts atomically (POST /v1/marketing/lists).
        Idempotent: if the audience exists, it reuses it without 409 error.
        """
        payload: dict = {
            "name": name,
            "require_double_opt_in": require_double_opt_in,
        }
        if description:
            payload["description"] = description
        if company_name:
            payload["company_name"] = company_name
        if company_address:
            payload["company_address"] = company_address
        if contacts:
            payload["contacts"] = contacts

        return cls._request("/v1/marketing/lists", method="POST", payload=payload)

    @classmethod
    def upsert_contact(
        cls,
        email: str,
        first_name: str = "",
        last_name: str = "",
        phone: str = "",
        tags: list[str] | None = None,
        custom_fields: dict | None = None,
    ) -> tuple[bool, dict]:
        """Idempotent single contact upsert (POST /v1/marketing/contacts)."""
        payload: dict = {"email": email}
        if first_name:
            payload["first_name"] = first_name
        if last_name:
            payload["last_name"] = last_name
        if phone:
            payload["phone"] = phone
        if tags:
            payload["tags"] = tags
        if custom_fields:
            payload["custom_fields"] = custom_fields

        return cls._request("/v1/marketing/contacts", method="POST", payload=payload)
