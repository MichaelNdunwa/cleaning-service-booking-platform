# Lumora QA Test Execution Log

> **Product Under Test:** Lumora — Developer-First Transactional Email Platform ([uselumora.io](https://uselumora.io))  
> **Subscription Tier:** Premium ($35/mo)  
> **QA Testbed Application:** Shield Cleaning Platform (Next.js 15 + Odoo 19 CE)  
> **Sender Domain:** `mail.tidyslot.xyz` (SPF + DKIM + DMARC active)  
> **Last Updated:** 2026-11-08  

---

## 1. Test Environment & Configuration

| Parameter | Value |
| :--- | :--- |
| **API Base URL** | `https://uselumora.io` |
| **Verified Sending Identity** | `Shield Cleaning <hello@mail.tidyslot.xyz>` |
| **Active Target Inboxes** | `ndunwa240@gmail.com` |
| **Domain DNS Host** | Cloudflare (`tidyslot.xyz` / `mail.tidyslot.xyz`) |
| **Backend Integration Layer** | `LumoraMailService` (`backend/cleaning_booking/services/lumora.py`) |
| **Frontend Production URL** | `https://tidyslot.xyz` |

---

## 2. Test Execution Ledger

| Test ID | Category | Feature / Flow | Status | Timestamp | Verdict |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **SEC-01** | Security | Unverified Domain Hard-Gating | `COMPLETED` | 2026-11-07 10:15 | **PASS** |
| **SEC-02** | Security | Missing Sender Validation | `COMPLETED` | 2026-11-07 10:20 | **PASS** |
| **SEC-03** | Security | SPF/DKIM Verified Sender Dispatch | `COMPLETED` | 2026-11-07 11:02 | **PASS** |
| **SEC-04** | Security | API Key Revocation Enforcement | `COMPLETED` | 2026-11-07 18:55 | **PASS** |
| **APP-01** | App Flow | Email Registration + Welcome Email | `COMPLETED` | 2026-11-07 18:50 | **PASS** |
| **APP-02** | App Flow | Google OAuth Signup + Welcome Email | `COMPLETED` | 2026-11-08 12:53 | **PASS** |
| **CRM-01** | CRM / Audience | Marketing List Creation via REST API | `COMPLETED` | 2026-11-07 10:45 | **PASS** |
| **CRM-02** | CRM / Audience | Contact Upsert on User Registration | `COMPLETED` | 2026-11-08 12:53 | **PASS** |
| **SYS-01** | System / Audit | Latest Login (`login_date`) Timestamp | `COMPLETED` | 2026-11-08 11:31 | **PASS** |
| **APP-03** | App Flow | Password Reset Token Email Delivery | `COMPLETED` | 2026-11-08 15:51 | **PASS** |
| **APP-04** | App Flow | Booking Confirmation Transactional Email | `COMPLETED` | 2026-11-08 15:51 | **PASS** |
| **CRM-03** | CRM / Audience | Booking Metadata Custom Fields Sync | `COMPLETED` | 2026-11-08 15:51 | **PASS** |
| **VAR-01** | Templating | Shared Template Variables Rendering | `PENDING` | — | Scheduled |
| **VAR-02** | Templating | Recipient-Specific Variable Overrides | `PENDING` | — | Scheduled |
| **OBS-01** | Observability | Message Delivery Lifecycle Tracking | `PENDING` | — | Scheduled |
| **ERR-01** | Resilience | Malformed Payload & Error Boundaries | `PENDING` | — | Scheduled |

---

## 3. Detailed Test Records & Evidence

### Test Record: SEC-01 — Unverified Domain Hard-Gating
* **Objective:** Ensure Lumora rejects attempts to send emails from unauthorized or unverified domains (preventing sender spoofing).
* **Request:**
  ```http
  POST /v1/email/send
  Content-Type: application/json
  x-api-key: [REDACTED]

  {
    "from": { "email": "test@unverified-domain.com", "name": "Spoof Test" },
    "to": ["ndunwa240@gmail.com"],
    "subject": "Spoof test",
    "text": "Testing unverified domain"
  }
  ```
* **Response Received:**
  ```json
  HTTP/1.1 403 Forbidden
  {
    "error": "sender_domain_not_verified",
    "message": "Sender domain is not verified or does not belong to this tenant"
  }
  ```
* **Observation / Verdict:** **PASS.** Lumora strictly enforces tenant domain ownership and halts unverified dispatch before entering outbound queues.

---

### Test Record: SEC-04 — Leaked / Revoked API Key Invalidation
* **Objective:** Verify that revoked or compromised API keys are instantly invalidated across all endpoints.
* **Request:**
  ```http
  GET /v1/emails/stats
  x-api-key: esk_8c0e055cc7fa2221c94ac054ac4698fa42c28e07970d19fc378d64fe7b041023
  ```
* **Response Received:**
  ```json
  HTTP/1.1 401 Unauthorized
  {
    "error": "invalid_api_key"
  }
  ```
* **Observation / Verdict:** **PASS.** Leaked secret detected by GitGuardian was instantly rejected by Lumora, confirming zero-tolerance credential invalidation.

---

### Test Record: APP-02 — Google OAuth Signup & Welcome Email
* **Objective:** Full end-to-end user registration with Google OAuth, Odoo backend account creation, and Lumora welcome email dispatch.
* **Request:**
  ```http
  POST /api/v1/auth/oauth
  Content-Type: application/json

  {
    "email": "qa_test_user_01@tidyslot.xyz",
    "name": "QA Test User",
    "provider": "google",
    "provider_id": "google_qa_01"
  }
  ```
* **Response Received:**
  ```json
  HTTP/1.1 200 OK
  {
    "success": true,
    "user": {
      "id": 31,
      "name": "QA Test User",
      "email": "qa_test_user_01@tidyslot.xyz"
    }
  }
  ```
* **Lumora Action:**
  * Dispatched welcome email using verified sender `hello@mail.tidyslot.xyz`.
  * Triggered `POST /v1/marketing/contacts` with tags `["portal-user", "oauth-google"]`.
* **Observation / Verdict:** **PASS.** User created in Odoo `res.users`, session established, and email triggered cleanly.

---

### Test Record: SYS-01 — User Latest Login Timestamp Audit
* **Objective:** Verify that standard logins and OAuth logins invoke `_update_last_login()` to update `res.users.login_date`.
* **Verification:**
  ```python
  user.with_user(user).sudo()._update_last_login()
  ```
* **Database State:** `res.users.log` entry created, `login_date` reflected accurately in Odoo backend.
* **Observation / Verdict:** **PASS.**

---

### Test Record: APP-03 — Password Reset Token Delivery
* **Objective:** Verify that requesting a password reset generates a cryptographically secure token, constructs the live production reset link, and dispatches a transactional email via Lumora.
* **Request:**
  ```http
  POST /api/v1/auth/forgot-password
  Content-Type: application/json

  {
    "email": "ndunwa240@gmail.com"
  }
  ```
* **Response Received:**
  ```json
  HTTP/1.1 200 OK
  {
    "success": true,
    "message": "If that email is registered, a reset link has been sent."
  }
  ```
* **Lumora Action:**
  * Message ID: `4b0e2fd2-770d-460d-a23e-190769fa1198`
  * Sender: `Shield Cleaning <hello@mail.tidyslot.xyz>`
  * Template: Password Reset with CTA `Reset your password` linking to `https://tidyslot.xyz/reset-password?token=...`.
* **Observation / Verdict:** **PASS.** Transactional password reset email dispatched and delivered to `ndunwa240@gmail.com`.

---

### Test Record: APP-04 — Booking Confirmation Transactional Email
* **Objective:** Test end-to-end checkout / booking creation in Shield Cleaning and trigger a comprehensive multi-variable HTML receipt through Lumora.
* **Request:**
  ```http
  POST /api/v1/booking
  Content-Type: application/json

  {
    "pricing_id": 2,
    "clean_level_id": 1,
    "booking_date": "2026-11-20",
    "time_slot_id": 2,
    "frequency": "weekly",
    "customer": {
      "name": "Michael Ndunwa",
      "email": "ndunwa240@gmail.com",
      "phone": "+447123456789"
    },
    "address_line_1": "10 Downing Street",
    "city": "London",
    "postcode": "SW1A 2AA"
  }
  ```
* **Response Received:**
  ```json
  HTTP/1.1 201 Created
  {
    "booking": {
      "id": 3,
      "reference": "CLN-00003",
      "state": "draft",
      "amount_total": 68.0
    }
  }
  ```
* **Lumora Action:**
  * Message ID: `25f5ca97-259b-44f5-a60e-30c705384d34`
  * Subject: `Booking confirmed – CLN-00003 | Shield Cleaning`
  * Body: Rendered full order details: Date (`2026-11-20`), Time Slot (`Morning (9:00 – 12:00)`), Service (`1 Bedroom`), Total (`$68.00`), Address (`10 Downing Street, London`).
* **Observation / Verdict:** **PASS.** Order created in Odoo and confirmation receipt dispatched via Lumora.

---

### Test Record: CRM-03 — Booking Metadata Custom Fields Sync
* **Objective:** Verify that placing a booking synchronizes customer phone, frequency tags, and order metadata into the Lumora Audience CRM.
* **Lumora API Request:**
  ```http
  POST /v1/marketing/contacts
  Content-Type: application/json
  x-api-key: [REDACTED]

  {
    "email": "ndunwa240@gmail.com",
    "first_name": "Michael",
    "last_name": "Ndunwa",
    "phone": "+447123456789",
    "tags": ["customer", "freq-weekly"],
    "custom_fields": {
      "latest_booking_ref": "CLN-00003",
      "latest_booking_date": "2026-11-20",
      "frequency": "weekly"
    }
  }
  ```
* **Observation / Verdict:** **PASS.** Contact record updated in Lumora CRM with custom attributes for marketing segmentation.

---

## 4. Defect & Bug Reports (QA Findings)

### Defect ID: BUG-LUM-01
* **Severity:** **HIGH**
* **Component:** MTA Queue Worker / Credit Reservation Hook (`delivery-logs-2026-11-08.csv`)
* **Title:** Missing `reservationId` or `reservationKey` in Queue Worker causes false `failed` status and retry storms
* **Steps to Reproduce:**
  1. Call `POST /v1/email/send` via REST API using valid API key and verified domain.
  2. Ingest API returns `HTTP 200 OK` (`status: queued`, `queueId: 9ae31c64-...`, `messageId: 25f5ca97-...`).
  3. Export delivery logs from the Lumora Dashboard (`delivery-logs-2026-11-08.csv`).
* **Observed Behavior:**
  * Attempt 1 throws: `Error: reservationId or reservationKey is required`.
  * Background queue worker retries the job 4 times until `max_attempts_exceeded` is reached.
  * Final status displayed in dashboard logs is `failed`.
  * **Critical Paradox:** The email *was actually delivered* to the recipient inbox (`ndunwa240@gmail.com`).
* **Root Cause Analysis:**
  * Lumora implements a billing credit reservation mechanism (*"Email credits are reserved before queued sends start and settled as each delivery succeeds or permanently fails"*).
  * Outbound queue worker expects a `reservationId` or `reservationKey` attached to the job metadata.
  * When `POST /v1/email/send` does not populate this reservation token or when the post-send settlement hook encounters a missing key, the queue worker logs an error and initiates retry attempts, causing false-negative logs and potential duplicate deliveries.
* **Recommended Fix for Lumora Engineering:**
  * Ensure the API ingest pipeline auto-generates or passes a default transactional `reservationKey` before handing the job to the queue worker.
  * Decouple SMTP transmission status from billing credit settlement so that an email with a successful SMTP 250 response is never marked `failed` due to a post-send accounting error.

---

## 5. Upcoming Test Suite: Phase 2 (Active)

1. **VAR-01 (Shared Template Variables):** Test variable substitution across Subject, HTML, and Text bodies.
2. **VAR-02 (Recipient Overrides):** Test `perRecipientVariables` batch dispatch.
3. **OBS-01 (Observability):** Test `GET /v1/messages/{messageId}` and delivery webhook listeners.

