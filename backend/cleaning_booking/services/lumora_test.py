#!/usr/bin/env python3
"""
Lumora Comprehensive Integration & Testing Suite
=================================================
Tests all Lumora features described in the testing checklist:
1. Auth & API Key validation
2. Email stats & delivery logs
3. Domain hard-gating rules (expect 403 on unverified domain)
4. Transactional email sending (welcome, password reset, booking confirmation)
5. Marketing audiences & contacts (create list + contact upsert + batch import)

Usage:
    python3 backend/cleaning_booking/services/lumora_test.py [recipient_email] [from_email]

Example:
    python3 backend/cleaning_booking/services/lumora_test.py customer@example.com
"""

import json
import os
import sys

# Add parent directory to path so LumoraMailService can be imported standalone
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from services.lumora import LumoraMailService

RECIPIENT = sys.argv[1] if len(sys.argv) > 1 else "test_customer@example.com"
FROM_EMAIL = sys.argv[2] if len(sys.argv) > 2 else os.getenv("LUMORA_FROM_EMAIL", "")
if FROM_EMAIL:
    os.environ["LUMORA_FROM_EMAIL"] = FROM_EMAIL

api_key, base_url, default_from, default_name = LumoraMailService._get_config()

print("\n" + "=" * 70)
print("🚀 Lumora Integration & Testing Suite")
print("=" * 70)
print(f"Base URL:      {base_url}")
print(f"API Key:       {api_key[:8]}...{api_key[-6:]} (Length: {len(api_key)})")
print(f"From Email:    {FROM_EMAIL or default_from or '(not configured)'}")
print(f"Test Target:   {RECIPIENT}")
print("=" * 70 + "\n")

results = []

def record(test_name: str, passed: bool, details: str):
    icon = "✅ PASS" if passed else "❌ FAIL"
    results.append((test_name, passed, details))
    print(f"[{icon}] {test_name}\n   └─ {details}\n")

# ── Test 1: API Key & Stats ────────────────────────────────────────────────────
print("--- [1] Checking API Key & Delivery Stats ---")
ok, data = LumoraMailService.get_stats()
if ok and "stats" in data:
    record("API Key Authentication & /v1/emails/stats", True, f"Stats retrieved: {json.dumps(data)}")
else:
    record("API Key Authentication & /v1/emails/stats", False, f"Response: {data}")

# ── Test 2: Delivery Logs ──────────────────────────────────────────────────────
print("--- [2] Checking Delivery Logs ---")
ok, data = LumoraMailService.get_logs()
if ok and "logs" in data:
    record("Email Logs API (/v1/emails/logs)", True, f"Log count: {len(data['logs'])}")
else:
    record("Email Logs API (/v1/emails/logs)", False, f"Response: {data}")

# ── Test 3: Domain Verification Hard-Gating ────────────────────────────────────
print("--- [3] Testing Domain Hard-Gating Rule ---")
# Sending from an unverified random domain MUST return 403 sender_domain_not_verified
unverified_domain = "unverified-shieldcleaning-test.com"
ok, data = LumoraMailService.send(
    to_email=RECIPIENT,
    subject="Domain verification check",
    html="<p>Test</p>",
    from_email=f"noreply@{unverified_domain}",
    from_name="Shield Cleaning",
)
if not ok and data.get("error") == "sender_domain_not_verified":
    record(
        "Hard-Gated Domain Verification (403 sender_domain_not_verified)",
        True,
        f"Correctly rejected unverified sender with: {data.get('message')}",
    )
elif not ok and data.get("status") == 403:
    record(
        "Hard-Gated Domain Verification (403)",
        True,
        f"Correctly returned HTTP 403: {data}",
    )
else:
    record(
        "Hard-Gated Domain Verification",
        False,
        f"Expected 403 sender_domain_not_verified, got: ok={ok}, response={data}",
    )

# ── Test 4: Marketing Audiences (List Audiences) ───────────────────────────────
print("--- [4] Checking Marketing Audiences ---")
ok, data = LumoraMailService.list_audiences()
if ok and "data" in data:
    record("List Audiences API (/v1/marketing/lists)", True, f"Audiences found: {len(data['data'])}")
else:
    record("List Audiences API (/v1/marketing/lists)", False, f"Response: {data}")

# ── Test 5: Atomic Audience Creation + Contact Import ─────────────────────────
print("--- [5] Testing Atomic Audience Creation & Contact Import ---")
test_list_name = "Shield Cleaning Customers"
ok, data = LumoraMailService.create_audience_and_contacts(
    name=test_list_name,
    description="Customers who registered on Shield Cleaning platform",
    company_name="Shield Cleaning Co",
    company_address="London, UK",
    contacts=[
        {
            "email": RECIPIENT,
            "first_name": "Test",
            "last_name": "Customer",
            "tags": ["app-user", "booking-funnel"],
        }
    ],
)
if ok:
    list_created = data.get("list_created", False)
    imported_count = data.get("imported_count", 0)
    record(
        "Atomic Audience Creation & Contact Import (POST /v1/marketing/lists)",
        True,
        f"list_created={list_created}, imported_count={imported_count}, payload={data}",
    )
else:
    record("Atomic Audience Creation & Contact Import", False, f"Response: {data}")

# ── Test 6: Single Contact Upsert ──────────────────────────────────────────────
print("--- [6] Testing Contact Upsert ---")
ok, data = LumoraMailService.upsert_contact(
    email=RECIPIENT,
    first_name="Jane",
    last_name="Doe",
    phone="+1234567890",
    tags=["vip", "weekly-service"],
    custom_fields={"preferred_frequency": "weekly", "bedrooms": 2},
)
if ok:
    record("Idempotent Contact Upsert (POST /v1/marketing/contacts)", True, f"Contact updated: {data}")
else:
    record("Idempotent Contact Upsert (POST /v1/marketing/contacts)", False, f"Response: {data}")

# ── Test 7: Transactional Email Sends (With Verified Domain if set) ────────────
effective_from = FROM_EMAIL or default_from
print("--- [7] Testing Transactional Email Sends ---")
if effective_from:
    print(f"Testing live send using configured sender: {effective_from}")

    # 7a: Welcome
    ok, data = LumoraMailService.send_welcome(
        to_email=RECIPIENT,
        to_name="Jane Doe",
        from_email=effective_from,
    )
    record("Send Welcome Email", ok, f"Response: {data}")

    # 7b: Password Reset
    ok, data = LumoraMailService.send_password_reset(
        to_email=RECIPIENT,
        to_name="Jane Doe",
        reset_url="http://localhost:3000/reset-password?token=LUMORA_TEST_TOKEN",
        from_email=effective_from,
    )
    record("Send Password Reset Email", ok, f"Response: {data}")

    # 7c: Booking Confirmation
    ok, data = LumoraMailService.send_booking_confirmation(
        to_email=RECIPIENT,
        to_name="Jane Doe",
        booking_reference="CLN-99999",
        booking_date="2026-11-15",
        time_slot_name="Afternoon (1pm – 5pm)",
        pricing_label="3 Bedrooms",
        amount_total=199.00,
        frequency="weekly",
        address_line_1="10 Downing St",
        city="London",
        from_email=effective_from,
    )
    record("Send Booking Confirmation Email", ok, f"Response: {data}")
else:
    print("ℹ️  LUMORA_FROM_EMAIL is not configured yet with a verified sending domain.")
    print("   Once you verify a domain in Lumora (or set default_from_email in app), set:")
    print("   export LUMORA_FROM_EMAIL=\"hello@yourdomain.com\"\n")

# ── Summary ────────────────────────────────────────────────────────────────────
print("=" * 70)
print("📊 TEST SUMMARY")
print("=" * 70)
passed_count = sum(1 for _, p, _ in results if p)
total_count = len(results)
for name, p, _ in results:
    status_str = "PASS" if p else "FAIL"
    print(f" - [{status_str}] {name}")
print(f"\nResult: {passed_count}/{total_count} checks passed.")
print("=" * 70 + "\n")
