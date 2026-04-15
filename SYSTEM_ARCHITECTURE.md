# System Architecture

## Recommended Shape

This project should follow a **modular monolith** architecture:

- **Next.js** is the public customer experience layer.
- **Odoo** is the business system of record and internal operations platform.
- **PostgreSQL** remains the primary database through Odoo.
- Keep **one backend platform** for business logic instead of introducing microservices too early.

That gives you:

- a fast SEO-friendly public website
- a strong internal ERP/operations system
- one source of truth for bookings, workers, payroll, billing, and reporting
- lower complexity than splitting everything into separate services

## What Exists Today

After reviewing the current codebase, the live implementation is smaller than the roadmap:

- The backend currently ships only one Odoo addon: `backend/cleaning_booking/`
- The addon currently handles:
  - bookings
  - service types
  - add-ons
  - time slots
  - a custom REST API for the frontend
- The frontend currently has:
  - marketing pages
  - signup/login
  - Google OAuth through NextAuth
  - a multi-step booking UI

Important current-state observations:

- The frontend already has an API client in `frontend/src/lib/api.ts`, but the booking funnel is still mostly mock UI state and hard-coded values.
- The Odoo addon mixes multiple concerns in one module:
  - business models
  - admin views
  - seed data
  - external API controller
- Worker availability, assignments, payroll, analytics, profile management, blogs, and feedback are not implemented yet as real backend domains.

## Core Architecture Principles

### 1. Odoo owns business truth

Anything that affects operations, money, staffing, or reporting should live in Odoo:

- bookings
- customers
- workers
- schedules
- assignments
- compensation rules
- payouts
- payment status
- feedback tied to completed jobs
- operational dashboards

### 2. Next.js owns customer experience

Next.js should own:

- landing pages
- booking UX
- customer account pages
- blog/content pages
- SEO pages
- lightweight orchestration for public traffic

### 3. Separate by domain, not by screen

Do not design the backend around “admin pages” or “worker pages.”
Design it around business domains:

- booking
- workforce
- dispatch
- payroll
- billing
- analytics

### 4. Avoid duplicated business logic

Pricing, slot capacity, status transitions, payout rules, and assignment rules should not be reimplemented in both Next.js and Odoo.

The frontend should render and guide.
Odoo should decide and persist.

### 5. Keep public traffic away from raw Odoo as much as possible

The current rewrite-based approach works for early development, but the long-term architecture should move toward:

- browser -> Next.js
- Next.js server routes/actions -> Odoo API

This reduces CORS/session coupling and keeps the public surface more controlled.

## Recommended Target Architecture

### Layer 1: Customer Experience Layer

**Technology:** Next.js

Responsibilities:

- marketing website
- booking funnel
- customer authentication session
- profile pages
- booking history
- reschedule/cancel requests
- blog and SEO content
- feedback submission UI

Recommended feature structure:

- `src/app/(marketing)`
- `src/app/(auth)`
- `src/app/(customer)`
- `src/app/api/`
- `src/features/booking`
- `src/features/auth`
- `src/features/customer`
- `src/features/blog`
- `src/lib/odoo`
- `src/lib/validators`

### Layer 2: Integration / BFF Layer

**Technology:** Next.js server routes or server actions

Responsibilities:

- authenticate public requests
- validate payloads
- normalize frontend contracts
- call Odoo server-to-server
- hide Odoo internals from the browser
- apply rate limiting, logging, and request tracing

This layer is especially important for:

- booking creation
- customer profile reads/writes
- my bookings
- reschedule/cancel flows
- feedback submission

### Layer 3: Business Core

**Technology:** Odoo

Responsibilities:

- core data model
- state transitions
- assignment workflows
- payroll computation
- accounting integration
- reporting
- permissions
- audit trail

## Recommended Odoo Module Split

The current `cleaning_booking` addon should become the start of a larger modular backend.

### 1. `cleaning_core`

Shared foundation module.

Should contain:

- shared security groups
- shared constants and mixins
- shared geographic/zone data
- service areas
- reusable sequence helpers
- base settings

### 2. `cleaning_booking`

Customer order intake domain.

Should contain:

- booking model
- service catalog
- add-ons
- pricing rules
- booking state machine
- customer property/job details
- booking change rules
- customer feedback linked to completed bookings

### 3. `cleaning_dispatch`

Operational scheduling and assignment domain.

Should contain:

- job assignment
- worker allocation
- route/date planning
- slot capacity logic
- unassigned jobs queue
- reschedule workflow
- no-show / failed-job handling

### 4. `cleaning_workforce`

Worker master data and execution domain.

Should contain:

- worker profile
- employee vs contractor classification
- skills/certifications
- availability
- working hours
- service zones
- worker documents
- job acceptance/completion records

### 5. `cleaning_billing`

Revenue-side financial domain.

Should contain:

- payment transactions
- invoices/receipts
- refunds
- discount codes
- subscription/recurring billing rules
- accounting hooks

### 6. `cleaning_payroll`

Cleaner compensation domain.

Should contain:

- compensation profiles
- pay rules
- per-job / hourly / monthly logic
- payout batches
- payout lines
- contractor vendor bills
- employee journal entries
- export for bank transfer

### 7. `cleaning_analytics`

Reporting and KPI domain.

Should contain:

- reporting models / SQL views
- revenue dashboards
- labour cost dashboards
- booking funnel metrics
- margin analysis
- customer retention metrics
- worker utilization metrics

### 8. `cleaning_api`

Public/customer API layer.

Should contain:

- versioned external API endpoints
- API schemas/serializers
- auth/ownership checks
- request throttling hooks
- customer/mobile-facing controllers only

This keeps external contracts separate from internal operational logic.

## Recommended Frontend Domain Split

### 1. Marketing and Content

Keep this in Next.js.

Includes:

- home
- about
- solutions
- blog
- SEO pages

For blog/content, prefer:

- MDX if content volume is low
- a headless CMS if non-technical editors need control

Do not store blog architecture inside the same Odoo domain as operations unless the company explicitly wants Odoo editors managing content.

### 2. Customer Account Area

Keep UI in Next.js, but source data from Odoo.

Includes:

- profile
- addresses
- saved preferences
- bookings list
- booking detail
- cancel/reschedule request
- receipts
- feedback

### 3. Booking Funnel

This should become a real feature module with:

- catalog fetch
- pricing preview
- slot availability fetch
- draft booking state
- payment initiation
- confirmation

The current UI should evolve from hard-coded demo state into a typed flow backed by Odoo.

## Data Ownership

Recommended source of truth per domain:

- **Customer identity:** Next.js session + mapped Odoo portal user/partner
- **Customer business profile:** Odoo
- **Booking record:** Odoo
- **Service catalog:** Odoo
- **Worker profile:** Odoo
- **Availability:** Odoo
- **Assignments:** Odoo
- **Payments and payout records:** Odoo
- **Blog content:** Next.js CMS/MDX
- **Frontend session state and presentation state:** Next.js

## Recommended Auth Model

Use two different access patterns:

### Public customers

- Login via Next.js
- Maintain a clean customer session in Next.js
- Map customer identity to Odoo `res.users` / `res.partner`
- All customer data requests should go through Next.js server routes before reaching Odoo

### Managers, admins, workers

- Login directly to Odoo backend
- Use Odoo groups and record rules for permissions
- Do not route internal operational work through Next.js

This keeps the public app and internal ERP concerns separate.

## Main Business Workflows

### Customer booking flow

1. Customer browses service catalog in Next.js
2. Next.js requests catalog and availability from Odoo
3. Customer submits booking request
4. Odoo validates slot, pricing, and customer data
5. Odoo creates booking
6. Billing/payment status is attached
7. Confirmation is returned to Next.js

### Operations dispatch flow

1. New confirmed bookings enter dispatch queue
2. Manager or auto-assignment engine assigns workers
3. Worker availability and zone fit are checked
4. Booking moves to scheduled
5. Worker marks progress/completion
6. Exceptions are tracked for rework, cancellation, or no-show

### Payroll flow

1. Completed jobs and approved shifts become payroll inputs
2. Compensation rules compute worker pay
3. Payout batch groups payable items
4. Employee payouts create accounting entries
5. Contractor payouts create vendor bills
6. Analytics module tracks labour cost and margin

## Security Requirements

This project will need stronger security boundaries than it has now.

Recommended rules:

- customer endpoints must verify ownership of the booking
- public endpoints should never expose arbitrary booking data by ID alone
- worker data should be isolated from customer data
- payroll data must be visible only to payroll/admin roles
- add proper Odoo record rules, not only access CSV permissions
- keep public API controllers separate from internal admin actions
- log status changes, payout approvals, and sensitive actions

## Reporting Architecture

Start with Odoo-native reporting:

- list views
- pivot views
- graph views
- SQL reporting models

Later, if the business grows, add a reporting replica or BI layer for:

- executive dashboards
- cohort/retention analysis
- profitability by region/service/customer segment

But for now, Odoo reporting is enough.

## Deployment Architecture

Recommended deployment shape:

- `www.company.com` -> Next.js frontend
- `ops.company.com` -> Odoo backend for company staff
- PostgreSQL private to Odoo
- object storage for documents/images if needed
- email/SMS/WhatsApp providers connected from backend workflows
- payment gateway connected through Odoo billing flows

Best practice:

- keep Odoo non-public to anonymous users where possible
- expose only the controlled API surface needed by Next.js
- put monitoring/logging around both apps

## Suggested Build Order

### Phase 1: Stabilize the current foundation

- make booking flow real instead of mock
- move frontend booking reads/writes onto live Odoo data
- secure public booking endpoints
- add customer portal pages

### Phase 2: Split backend domains cleanly

- extract `cleaning_api`
- introduce `cleaning_dispatch`
- introduce `cleaning_workforce`
- keep `cleaning_booking` focused on order intake

### Phase 3: Add financial and workforce operations

- `cleaning_billing`
- `cleaning_payroll`
- worker availability and assignment flows

### Phase 4: Add analytics and content maturity

- `cleaning_analytics`
- blog CMS/MDX strategy
- KPI dashboards
- customer feedback and retention metrics

## Short Version

The best architecture for this project is:

- **Next.js for customer-facing experience**
- **Odoo as the operational and financial source of truth**
- **modular Odoo backend split by business domain**
- **Next.js server layer in front of Odoo for public/customer requests**
- **no microservices yet**

If you follow that shape, the system will stay simple enough to build now, but structured enough to support bookings, worker availability, assignment, payroll, reporting, and customer self-service as the business grows.
