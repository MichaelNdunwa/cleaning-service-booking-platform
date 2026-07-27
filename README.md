# 🧹 Cleaning Service Booking Platform (Odoo 19 Community)

## 📌 Overview

This project is a **Cleaning Service Booking Platform** built on **Odoo 19 Community Edition**.
It provides a seamless experience for customers to book residential, office, or commercial cleaning services, and gives the business owner/admin a powerful back-office to manage bookings, payments, scheduling, and cleaner payroll.

The **customer-facing frontend UI** is based on the **Clean – Booking UI Template** from Figma:
👉 [View UI Design on Figma](https://www.figma.com/design/MHRHML5z9I2I4BIXtwYKyv/Clean---Booking-UI-Template--Community-?node-id=83-2&p=f&t=Lx1TrC3f4W4DHcj1-0)

---

## ✨ Key Features

### 🌐 Customer Website

* Modern booking flow (based on Figma template)
* Step-by-step booking funnel:

  1. Customize service requirements (size, rooms, add-ons)
  2. Select date
  3. Select time slot
  4. Choose frequency + enter address and notes
  5. Payment and booking confirmation
* Customer Portal: view, reschedule, or cancel bookings; download receipts

### 🛠 Admin Back-Office

* Manage all bookings (Kanban pipeline: Draft → Confirmed → Scheduled → In Progress → Done → Cancelled)
* View and manage payment transactions
* Schedule cleaners (via Planning app)
* Dashboards with weekly/monthly performance graphs
* Best customers and company insights
* Service mix and add-on popularity

### 💵 Payroll-Lite System

* Track **cleaner compensation** (employees & contractors)
* Support for:

  * Monthly / weekly salaries (employees)
  * Per-job / per-hour payments (contractors)
* Payout batch processing with evidence (linked bookings & shifts)
* Journal entries for employees, vendor bills for contractors
* Export CSV for bank uploads
* Reports: labour cost, margins, employee vs contractor split

---

## 📂 Modules

* `cleaning_booking` → Booking funnel, models, website integration
* `cleaning_ops` → Admin dashboards, reporting, transactions
* `cleaning_payroll` → Payroll-lite system for employees & contractors

---

## 🗂 Development Plan

The full sprint plan with detailed tasks and timelines is documented in:
📄 [DEVELOPMENT\_PLAN.md](./DEVELOPMENT_PLAN.md)

**Sprint Highlights:**

1. **Foundations** → Setup Odoo + booking models
2. **Booking Funnel** → Implement frontend booking flow
3. **Admin Back-Office** → Bookings management, dashboards
4. **Payroll-Lite** → Cleaner payout system
5. **Portal** → Customer self-service pages
6. **Reports & Analytics** → Performance and margin insights
7. **Polish & QA** → Styling, error states, notifications

---

## ⚙️ Tech Stack

* **Framework:** Odoo 19 Community Edition
* **Frontend UI:** [Clean – Booking UI Template (Figma)](https://www.figma.com/design/MHRHML5z9I2I4BIXtwYKyv/Clean---Booking-UI-Template--Community-?node-id=83-2&p=f&t=Lx1TrC3f4W4DHcj1-0)
* **Backend:** Python (Odoo ORM), PostgreSQL
* **Payments:** Odoo `payment` module (Stripe/Paystack/Flutterwave, etc.)
* **Scheduling:** Odoo Planning / Project
* **Reporting:** Odoo Pivot & Graph views, SQL reporting models

---

## 🚀 Setup (Developer)

1. Clone this repo
2. Install Odoo 19 Community + dependencies
3. Add this repo’s modules path to `odoo.conf`
4. Start Odoo with a clean database
5. Install modules in sequence:

   * `cleaning_booking`
   * `cleaning_ops`
   * `cleaning_payroll`

## 🚢 Deployment

Phase 2 deployment notes for the Next.js frontend, Odoo backend, and Google OAuth production settings are in:
📄 [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📊 Roadmap

* [ ] MVP Booking funnel
* [ ] Admin dashboards & reporting
* [ ] Payroll-Lite with payouts
* [ ] Customer portal self-service
* [ ] Advanced analytics (margins, heatmaps)
* [ ] Notifications (SMS/WhatsApp integration)

---

## 📜 License

This project is developed for internal use with Odoo Community Edition.
UI design references the free community Figma template:
👉 [Clean – Booking UI Template](https://www.figma.com/design/MHRHML5z9I2I4BIXtwYKyv/Clean---Booking-UI-Template--Community-?node-id=83-2&p=f&t=Lx1TrC3f4W4DHcj1-0)
