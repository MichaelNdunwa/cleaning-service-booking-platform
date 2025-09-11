## 🚀 Project: Cleaning Service Booking Platform (Odoo 18 Community)

### 📌 Overview

A **cleaning service booking system** with:

* A **public website** (booking funnel based on [Figma designs](https://www.figma.com/design/vNytbVuUyQCyTz4us06CcI/Clean---Booking-UI-Template--Community-?node-id=73-9&p=f&t=iFf82jBktw7IdVWE-0)).
* A **back-office admin side** (bookings, transactions, performance, payroll).
* **Cleaner payroll management** (employees + contractors).
* **Customer portal** (view/reschedule bookings, download receipts).

This plan defines sprints, timelines, and weekly checklists.

---

## 🗂 Sprint Breakdown

### **Sprint 1: Foundations (1.5 weeks)**

**Goal:** Set up project baseline (Odoo modules, repo, basic website, booking models).

**Deliverables:**

* ✅ Odoo 18 CE installed with required base modules:

  * `website`, `website_form`, `sale`, `payment`, `project`, `planning`, `hr`, `mail`
* ✅ Git repo with module scaffolds:

  * `cleaning_booking` (booking funnel + models)
  * `cleaning_ops` (admin dashboards & reporting)
  * `cleaning_payroll` (Payroll-Lite system)
* ✅ Create Booking model (`clean.booking`) with key fields:

  * Customer, service type, size, rooms, add-ons, frequency, date, slot, notes, total amount.
* ✅ Create Add-ons model (`clean.addon`) + pricing rules model.
* ✅ Minimal menus for Cleaning → Bookings & Add-ons.
* ✅ CI/CD setup: pre-commit hooks, test DB, Docker/WLS scripts.

**Estimated duration:** 1.5 weeks

**Weekly Checklist:**

* Week 1:

  * [x] Install & configure Odoo 18 CE
  * [ ] Initialize Git repo & module scaffolds
  * [ ] Define Booking + Add-on models
  * [ ] Create first XML menus, actions, and security groups
* Half Week:

  * [ ] Test booking creation manually in backend
  * [ ] Commit repo baseline

---

### **Sprint 2: Booking Funnel (2 weeks)**

**Goal:** Implement Figma booking steps as website funnel.

**Deliverables:**

* ✅ Step 1: Customize requirements (service type, size, add-ons, receipt preview).
* ✅ Step 2: Date picker (basic, disable past dates).
* ✅ Step 3: Time slots (AM/PM/hours).
* ✅ Step 4: Frequency + address + access notes.
* ✅ Step 5: Payment integration (Stripe/Paystack/Flutterwave test keys).
* ✅ Booking confirmation page + email template.
* ✅ Store draft booking in session until payment confirmed.

**Estimated duration:** 2 weeks

**Weekly Checklist:**

* Week 1:

  * [ ] Step 1 form (QWeb + JS for live price updates).
  * [ ] Step 2/3 (Date & time inputs).
  * [ ] Link booking draft to session user.
* Week 2:

  * [ ] Step 4 (Frequency, address form).
  * [ ] Step 5 (Payment form integration).
  * [ ] Confirmation + thank-you page.
  * [ ] Email confirmation template.

---

### **Sprint 3: Admin Back-Office (2 weeks)**

**Goal:** Give Admin full control over bookings, schedule, and payments.

**Deliverables:**

* ✅ Booking Kanban view (states: Draft → Confirmed → Scheduled → In progress → Done → Cancelled).
* ✅ Booking form with smart buttons:

  * Sales Order, Payment Transaction, Customer record.
* ✅ Schedule view (Planning or Project Gantt).
* ✅ Transaction view (filter by acquirer, status).
* ✅ Reports:

  * Weekly bookings trend (graph).
  * Monthly revenue trend.
  * Service type mix.
  * Top customers.

**Estimated duration:** 2 weeks

**Weekly Checklist:**

* Week 1:

  * [ ] Create Booking Kanban view with stages.
  * [ ] Transaction view (linked to payment.transaction).
  * [ ] Schedule integration (Planning → bookings).
* Week 2:

  * [ ] Reporting SQL view (`clean.booking.report`).
  * [ ] Weekly graph + monthly graph.
  * [ ] Top customer pivot.
  * [ ] Menu Dashboard linking all reports.

---

### **Sprint 4: Payroll-Lite MVP (2 weeks)**

**Goal:** Implement payroll system for cleaners (employees & contractors).

**Deliverables:**

* ✅ Compensation Profile model:

  * Employee vs Contractor
  * Rates: monthly/weekly/hourly/per-job
  * Overtime & weekend rules
* ✅ Payout Batch model:

  * Draft → Reviewed → Posted → Paid
* ✅ Payout Line model:

  * Hours worked (from Planning)
  * Jobs completed (from Bookings)
  * Computed net pay
* ✅ Evidence tab: linked bookings & shifts.
* ✅ Journal Entries for Employees.
* ✅ Vendor Bills for Contractors.
* ✅ Export CSV for bank upload.

**Estimated duration:** 2 weeks

**Weekly Checklist:**

* Week 1:

  * [ ] Compensation Profile model & UI.
  * [ ] Batch creation wizard.
  * [ ] Compute hours/visits into lines.
  * [ ] Evidence tab linking bookings/shifts.
* Week 2:

  * [ ] Net pay calculation engine.
  * [ ] Journal Entries + Vendor Bills.
  * [ ] Batch state machine.
  * [ ] Export CSV action.

---

### **Sprint 5: Portal & Customer Self-Service (1.5 weeks)**

**Goal:** Let customers log in and manage bookings.

**Deliverables:**

* ✅ Portal “My Bookings” page (list + detail).
* ✅ Actions: Reschedule (request), Cancel (rules).
* ✅ Download receipts (PDF).
* ✅ Profile page (stored cards, address book).
* ✅ Feedback form after job.

**Estimated duration:** 1.5 weeks

**Weekly Checklist:**

* Week 1:

  * [ ] Portal My Bookings list & detail.
  * [ ] Reschedule/Cancel buttons (workflow).
  * [ ] PDF receipt template.
* Half Week:

  * [ ] Profile & stored cards.
  * [ ] Feedback form.

---

### **Sprint 6: Reports & Analytics (1.5 weeks)**

**Goal:** Insights for Admin (performance, payroll cost, margins).

**Deliverables:**

* ✅ Labour cost report (payout lines sum).
* ✅ Revenue vs Labour margin chart.
* ✅ Service add-ons popularity chart.
* ✅ Zone heatmap of bookings.
* ✅ Employee vs Contractor cost split.
* ✅ Export reports to Excel/CSV.

**Estimated duration:** 1.5 weeks

**Weekly Checklist:**

* Week 1:

  * [ ] Labour cost pivot/graph.
  * [ ] Revenue vs Labour margin.
  * [ ] Add-ons popularity.
* Half Week:

  * [ ] Zone heatmap.
  * [ ] Employee vs Contractor split.
  * [ ] Export buttons.

---

### **Sprint 7: Polish & QA (1 week)**

**Goal:** Final refinements and deployment prep.

**Deliverables:**

* ✅ Styling (match Figma).
* ✅ Error states (login, forms, payments).
* ✅ Email templates polished.
* ✅ Notifications (reminders, SLA alerts).
* ✅ Final security review (record rules, groups).
* ✅ Deployment guide (install steps, config).

**Estimated duration:** 1 week

**Weekly Checklist:**

* Week 1:

  * [ ] Frontend styling pass.
  * [ ] Error handling (login/payment).
  * [ ] Notifications setup.
  * [ ] Final security review.
  * [ ] Deployment guide.

---

## 📊 Estimated Timeline (9 weeks total)

* Sprint 1: 1.5 weeks
* Sprint 2: 2 weeks
* Sprint 3: 2 weeks
* Sprint 4: 2 weeks
* Sprint 5: 1.5 weeks
* Sprint 6: 1.5 weeks
* Sprint 7: 1 week
  ➡️ **Total: \~11.5 weeks**, but with overlap/parallel testing we target **9 weeks net**.

---

## ✅ Weekly Focus Summary

* **Weeks 1–2:** Setup + Booking funnel MVP
* **Weeks 3–4:** Admin back-office + reporting
* **Weeks 5–6:** Payroll-Lite MVP
* **Weeks 7:** Portal (customer self-service)
* **Weeks 8:** Analytics (performance & margins)
* **Week 9:** Polish, QA, Deployment

---



# 🗓 Week 1 – Foundations

**Goal:**
Set up the Odoo 18 Community environment, initialize the repo, scaffold custom modules, and create the **Booking** + **Add-on** models with menus and security.

**Estimated Duration:** 1 week

---

## ✅ Deliverables

* Odoo 18 CE installed locally (Debian/WSL).
* Git repository initialized with three module scaffolds:

  * `cleaning_booking`
  * `cleaning_ops`
  * `cleaning_payroll`
* Basic `clean.booking` model with key fields.
* Basic `clean.addon` model with relation to bookings.
* Admin menu items: **Cleaning → Bookings, Add-ons**.
* Security groups: Cleaning User, Cleaning Manager.
* CI/CD basics: pre-commit config + Docker/venv setup.

---

## 📋 Weekly Checklist

### **Day 1–2: Environment Setup**

* [x] Install **Odoo 18 CE** from source in Debian/WSL.
* [x] Install PostgreSQL (with role `odoo_dev`).
* [x] Configure `odoo.conf` (custom addons path).
* [x] Create a new DB (`cleaning_dev_db`).
* [x] Verify Odoo runs on `http://localhost:8069`.

**Test:** Login with admin → confirm Apps menu visible.

---

### **Day 3: Git + Repo Structure**

* [x] Create Git repo `cleaning-service-booking-platform`.
* [x] Add `.gitignore` (exclude logs, pyc, **pycache**).
* [x] Add `README.md` (already drafted ✅).
* [x] Add `DEVELOPMENT_PLAN.md`.
* [x] Create `/custom_addons/cleaning-service-booking-platform/` folder with subfolders for 3 modules:

  * `cleaning_booking`
  * `cleaning_ops`
  * `cleaning_payroll`

**Test:** Push to remote → repo builds on another machine.

---

### **Day 4–5: Module Scaffolding**

* [x] Scaffold each module (`__manifest__.py`, `__init__.py`, `models/`, `views/`, `security/`).
* [x] In `cleaning_booking`:

  * Define model `clean.booking`:

    * Fields: `name`, `customer_id`, `service_type`, `size`, `bedrooms`, `bathrooms`, `date`, `slot`, `amount_total`, `state` (Draft/Confirmed/etc.).
  * Define model `clean.addon`:

    * Fields: `name`, `code`, `price`, `duration_delta`.
  * Add M2M field `addons` on booking.
* [ ] Create menus: **Cleaning → Bookings, Add-ons**.
* [ ] Add security groups:

  * **Cleaning User**: read/write bookings.
  * **Cleaning Manager**: full control.

**Test:**

* Install `cleaning_booking` in Odoo.
* Create a test booking and attach add-ons.
* Confirm menu + access rights.

---

### **Day 6: Testing & CI/CD Basics**

* [ ] Add **pre-commit hooks**:

  * `black` (Python formatter)
  * `flake8` (lint)
  * `xml-lint` (optional for view files)
* [ ] Add **Dockerfile / docker-compose.yml** (Odoo + Postgres).
* [ ] Run containerized Odoo to ensure portability.
* [ ] Document setup steps in README.md (`🚀 Setup` section).

**Test:** Fresh clone → `docker-compose up` → system runs with modules installed.

---

### **Day 7: Wrap-Up**

* [ ] Verify all models + menus work.
* [ ] Verify Git push includes Week 1 progress.
* [ ] Update DEVELOPMENT\_PLAN.md with **Week 1 completed tasks**.
* [ ] Prepare for **Week 2 (Booking Funnel UI)**.

---

## 🎯 Success Criteria

* Can **log in as Admin**, install `cleaning_booking`, and create bookings/add-ons in backend.
* Git repo is clean and builds on any dev machine.
* All tasks documented in DEVELOPMENT\_PLAN.md.

---




