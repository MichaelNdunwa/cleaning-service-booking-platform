# Cleaning Service Booking Platform — Backend Restructure Plan

## Problem Summary

Two problems to solve in parallel:

1. **Hardcoded frontend data** — 6+ categories of options in the 5-step wizard and BookingBar that should be backend-configurable but are currently TypeScript constants
2. **Pricing Plan / Clean Level overlap** — the backend model design creates structural confusion in the admin that will only get worse

---

## Part A: The Pricing Plan / Clean Level Overlap

### What's wrong

In the Odoo admin today, a Cleaning Manager sees this under **Configuration**:

```
Pricing Plans          Clean Levels
─────────────          ────────────
Studio        $45      Deep Clean        $35
1 Bedroom     $65      Moving In/Out     $50
2 Bedrooms    $85      Post Construction $60
3 Bedrooms    $105
4+ Bedrooms   $130
Office        $120     ← doesn't fit the bedroom pattern
```

**Three specific problems:**

**Problem 1 — "Office" doesn't belong in Pricing Plans**  
"Office" is a `pricing_type = "flat"` record in `clean.pricing`. But it's not just a different price tier — it's a different *property/service type* (commercial vs. residential). It has no bedroom count, yet lives alongside bedroom-based plans. If you add "Retail" or "Industrial" later, they'd all pile into the same screen with no structural difference.

**Problem 2 — Both models have `name + code + base_price` — they look identical in the admin**  
An admin who hasn't read the code can't easily tell the difference between:  
- Pricing Plan "2 Bedrooms" ($85) → the property *size tier* → sets the base price  
- Clean Level "Deep Clean" ($35) → the clean *intensity/type* → adds a surcharge  

The field label "Base Price" appears on both. On `clean.level`, it's actually a *surcharge*, but the field is named the same.

**Problem 3 — The booking form shows both `pricing_id` and `clean_level_id` in the same "Service" group**  
In the booking form view, both appear together without explanation:
```
Service
  Pricing Plan: 2 Bedrooms
  Clean Level:  Deep Clean
  Bedrooms: 2
  Bathrooms: 1
```
An admin sees "Pricing Plan" and "Clean Level" next to each other and wonders why pricing appears in both.

---

### The fix

**Rename and clarify the two models' roles — no data is moved or deleted.**

#### Step A1 — Rename `clean.pricing` → "Property Size" in all UI labels

The model name `clean.pricing` stays (no DB change). What changes:
- `_description`: `"Cleaning Pricing Configuration"` → `"Property Size / Service Tier"`
- Admin list view title: `"Pricing Plans"` → `"Property Size Tiers"`
- Menu label: `"Pricing Plans"` → `"Property Size Tiers"`
- Booking form label: `pricing_id` string → `"Property / Size"`
- Form view help text clarified

#### Step A2 — Rename `clean.level` field label: "Base Price" → "Surcharge"

The field `base_price` on `clean.level` already has `string="Surcharge Price"` in the model — but the admin list view doesn't show this distinction clearly. Fix:
- Add `Surcharge` column header to the list view (already correct at model level, needs view fix)
- Change `"Standard"` (the new level with $0) to make it explicit: description = "No surcharge — standard residential clean"

#### Step A3 — Separate "Office" flat-rate into its own admin section

The `pricing_type = "flat"` records are structurally different from bedroom-based records. In the admin:
- Filter/group the Pricing Plans list by `pricing_type` so bedroom-based and flat-rate are visually separated
- Add a `pricing_type` filter to the search view
- Update the list view to group by `pricing_type` by default

> [!NOTE]
> We do **not** create a new model for flat-rate/commercial plans. The `clean.pricing` model with `pricing_type` is correct — we just need the admin view to make the distinction obvious. A full "Service Category" model is a future sprint item.

#### Step A4 — Fix the booking form "Service" group layout

Reorganise the booking form view `Service` group to be self-explanatory:
```
Property Details          Clean Type
  Property / Size: 2BR      Clean Level: Deep Clean (+$35)
  Bedrooms: 2               
  Bathrooms: 1              
  Frequency: Weekly
```

This separates the two clearly: left = what/where, right = how thoroughly.

---

## Part B: New Backend Models

### B1 — `clean.frequency`

Provides configurable display metadata for the four frequency options. The `code` field must match the `frequency` Selection values on `clean.booking`.

**Fields:**
| Field | Type | Example |
|---|---|---|
| `name` | Char | `"Every 2 Weeks"` |
| `code` | Char (unique) | `"fortnightly"` — must match booking selection |
| `description` | Text | `"Save 15% annually"` |
| `discount_pct` | Float | `15.0` |
| `sequence` | Integer | `3` |
| `active` | Boolean | `True` |

**Seed data:**
| name | code | discount_pct |
|---|---|---|
| One-time | `one_time` | 0.0 |
| Weekly | `weekly` | 20.0 |
| Every 2 Weeks | `fortnightly` | 15.0 |
| Every 4 Weeks | `monthly` | 10.0 |

---

### B2 — `clean.bathroom.option`

**Fields:**
| Field | Type | Example |
|---|---|---|
| `name` | Char | `"2 Bathrooms"` |
| `value` | Integer | `2` |
| `sequence` | Integer | `2` |
| `active` | Boolean | `True` |

**Seed data:** 1, 2, 3, 4, 5 (uniform across BookingBar and RequirementsStep)

---

### B3 — `clean.access.method`

Replaces the hardcoded `entryMethods` array in DetailsStep.

**Fields:**
| Field | Type | Example |
|---|---|---|
| `name` | Char | `"Someone is Home"` |
| `code` | Char | `"home"` |
| `sequence` | Integer | `1` |
| `active` | Boolean | `True` |

**Seed data:** Someone is Home (`home`), Doorman (`doorman`), Hidden Key (`hidden_key`), Other (`other`)

**`clean.booking` change:** Add `access_method_id = Many2one("clean.access.method")` alongside the existing `access_instructions` text field. Both are shown in the Address tab.

---

### B4 — `clean.contact.preference`

**Fields:**
| Field | Type | Example |
|---|---|---|
| `name` | Char | `"Text Message"` |
| `code` | Char | `"text"` |
| `sequence` | Integer | `1` |
| `active` | Boolean | `True` |

**Seed data:** Text Message (`text`), Phone Call (`call`), Email (`email`)

**`clean.booking` change:** Add `contact_preference_id = Many2one("clean.contact.preference")`.

---

### B5 — "Standard" becomes a real `clean.level` with a price

**Recommended price: $20.00**

Reasoning — the current surcharge ladder has a gap at the bottom:

| Level | Surcharge | Step |
|---|---|---|
| *(nothing)* | $0 | — |
| Deep Clean | $35 | +$35 jump |
| Moving In/Out | $50 | +$15 |
| Post Construction | $60 | +$10 |

Adding Standard at **$20** creates a well-spaced, logical progression:

| Level | Surcharge | Step |
|---|---|---|
| **Standard** | **$20** | — |
| Deep Clean | $35 | +$15 |
| Moving In/Out | $50 | +$15 |
| Post Construction | $60 | +$10 |

This makes every tier feel meaningfully different. Standard's $20 represents the basic labour overhead for any clean type — the bedroom base price then covers the property-size portion.

Seed record in `clean_levels.xml`:

```xml
<record id="level_standard" model="clean.level">
    <field name="name">Standard</field>
    <field name="code">standard</field>
    <field name="description">Regular residential clean — surfaces, floors, kitchen and bathrooms.</field>
    <field name="base_price">20.00</field>
    <field name="sequence">0</field>   <!-- appears first in the list -->
</record>
```

**Impact on pricing examples** (1 Bedroom):
| Selection | Old Total | New Total |
|---|---|---|
| 1BR + Standard | $65 | $85 |
| 1BR + Deep Clean | $100 | $100 |
| 1BR + Moving In/Out | $115 | $115 |

> [!IMPORTANT]
> Standard was previously $0 (hardcoded frontend concept). Adding it at $20 is a **price increase** for customers who would have booked a standard clean. Confirm this is intentional before executing.

**`_compute_amounts` — no structural change needed.** The method already handles `clean_level_id.base_price` correctly. Standard's $20 flows through automatically like any other level.

---

### B6 — Bathrooms get surcharge pricing (like bedrooms)

**Answer: Yes — bathrooms should have prices.**

Bathrooms are time-intensive to clean and are always priced in professional cleaning.

**Recommended surcharges** (1 bathroom is always included in the bedroom base price):

| Bathrooms | Surcharge | Reasoning |
|---|---|---|
| 1 | $0 | Included in the bedroom base price |
| 2 | $15 | One additional bathroom |
| 3 | $30 | Two additional bathrooms |
| 4 | $45 | Three additional bathrooms |
| 5 | $55 | Four bathrooms — slight discount at the high end |

This is $15/extra bathroom, with a small cap at 5+. Industry-standard for residential cleaning.

**Model change — add `surcharge` to `clean.bathroom.option`:**

```python
class CleanBathroomOption(models.Model):
    _name = "clean.bathroom.option"
    _description = "Bathroom Count Option"
    _order = "sequence"

    name     = fields.Char(string="Label", required=True)   # "2 Bathrooms"
    value    = fields.Integer(string="Count", required=True) # 2
    surcharge = fields.Float(string="Surcharge", digits=(10, 2), default=0.0)
    sequence = fields.Integer(default=10)
    active   = fields.Boolean(default=True)
```

**`clean.booking` change — keep `bathrooms` Integer field; look up surcharge dynamically:**

The `bathrooms` Integer field stays as-is (no migration of existing booking data needed). The compute method looks up the matching `clean.bathroom.option` record by `value` to fetch the surcharge:

```python
# Inside _compute_amounts:
bath_option = self.env["clean.bathroom.option"].search(
    [("value", "=", booking.bathrooms), ("active", "=", True)], limit=1
)
bath_surcharge = bath_option.surcharge if bath_option else 0.0
```

This means **no FK field change on `clean.booking`** — the integer `bathrooms` field remains the stored value, and the surcharge is resolved at compute time. Clean, migration-safe.

**New `bathroom_amount` computed stored field on `clean.booking`:**

```python
bathroom_amount = fields.Float(
    string="Bathroom Surcharge",
    digits=(10, 2),
    compute="_compute_amounts",
    store=True,
)
```

**Seed data in `bathroom_options.xml`:**
```xml
<!-- value 1 → $0, value 2 → $15, value 3 → $30, value 4 → $45, value 5 → $55 -->
```

---

### B7 — `clean.pricing` gets `display_name` computed field

```python
label = fields.Char(
    string="Display Label",
    compute="_compute_label",
    store=True,
)

@api.depends("name", "pricing_type", "bedrooms")
def _compute_label(self):
    for record in self:
        if record.pricing_type == "bedroom":
            if record.bedrooms == 0:
                record.label = "Studio"
            elif record.bedrooms == 1:
                record.label = "1 Bedroom"
            else:
                record.label = f"{record.bedrooms} Bedrooms"
        else:
            record.label = record.name
```

> [!NOTE]
> We use `label` not `display_name` to avoid conflicting with Odoo's built-in `AbstractModel.display_name` computed field. Exposed as `label` in the API response.

---

## Part C: Updated `_compute_amounts` — All Surcharges Combined

This is the **single most changed part of the backend**. It now accounts for:
1. Bedroom base price (unchanged)
2. Clean level surcharge (unchanged structure, but Standard is now $20)
3. Add-ons (unchanged)
4. **Bathroom surcharge (new)**
5. **Frequency discount applied to the full subtotal (new)**

### New fields to add on `clean.booking`:

```python
bathroom_amount = fields.Float(
    string="Bathroom Surcharge",
    digits=(10, 2),
    compute="_compute_amounts",
    store=True,
)
discount_amount = fields.Float(
    string="Frequency Discount",
    digits=(10, 2),
    compute="_compute_amounts",
    store=True,
)
```

### Updated `@api.depends` decorator:

```python
@api.depends(
    "pricing_id.base_price",
    "clean_level_id.base_price",
    "addon_ids.price",
    "bathrooms",
    "frequency",
)
```

### Full updated compute method:

```python
def _compute_amounts(self):
    FreqModel = self.env["clean.frequency"]
    BathModel = self.env["clean.bathroom.option"]

    for booking in self:
        # 1. Bedroom base price
        base = booking.pricing_id.base_price if booking.pricing_id else 0.0

        # 2. Clean level surcharge
        clean = booking.clean_level_id.base_price if booking.clean_level_id else 0.0

        # 3. Add-ons
        addons = sum(addon.price for addon in booking.addon_ids)

        # 4. Bathroom surcharge — look up by integer value
        bath_opt = BathModel.search(
            [("value", "=", booking.bathrooms), ("active", "=", True)], limit=1
        )
        bath = bath_opt.surcharge if bath_opt else 0.0

        subtotal = base + clean + addons + bath

        # 5. Frequency discount — applied to the full subtotal
        freq_rec = FreqModel.search(
            [("code", "=", booking.frequency), ("active", "=", True)], limit=1
        )
        discount_pct    = freq_rec.discount_pct if freq_rec else 0.0
        discount_amount = round(subtotal * (discount_pct / 100.0), 2)

        booking.base_amount     = base
        booking.extras_amount   = clean + addons + bath   # bath included in extras
        booking.bathroom_amount = bath
        booking.discount_amount = discount_amount
        booking.amount_total    = subtotal - discount_amount
```

### Updated Pricing Breakdown Example

**1 Bedroom, 2 Bathrooms, Deep Clean, Carpet Cleaning, Weekly:**
```
Base (1BR):           $65.00
Clean Level (Deep):   $35.00
Bathroom (2nd):       $15.00
Add-on (Carpet):      $40.00
              ─────────────
Subtotal:            $155.00
Frequency Discount:  -$31.00  (20% weekly discount)
              ─────────────
Total:               $124.00
```

**Booking form view update** — Payment group:
```
Payment
  Base Amount:          $65.00
  Extras Amount:        $90.00   (clean level + bath + addons)
  Frequency Discount:  -$31.00
  ──────────────────────────────
  Total:               $124.00
```

---

## Part D: New Unified Catalog Endpoint

### `GET /api/v1/catalog`

Returns everything the booking wizard needs in **one round-trip**:

```json
{
  "pricing": [
    { "id": 2, "name": "1 Bedroom", "label": "1 Bedroom", "code": "1bed",
      "pricing_type": "bedroom", "bedrooms": 1, "base_price": 65.00 }
  ],
  "levels": [
    { "id": 1, "name": "Standard",  "code": "standard",
      "description": "Regular residential clean.", "base_price": 20.00 },
    { "id": 2, "name": "Deep Clean", "code": "deep_clean",
      "description": "...", "base_price": 35.00 }
  ],
  "addons": [
    { "id": 1, "name": "Carpet Cleaning", "code": "carpet_clean",
      "description": "...", "price": 40.00, "duration_delta": 1.0 }
  ],
  "frequencies": [
    { "id": 1, "name": "One-time",      "code": "one_time",    "discount_pct": 0.0,  "description": "" },
    { "id": 2, "name": "Weekly",        "code": "weekly",      "discount_pct": 20.0, "description": "Save 20% annually" },
    { "id": 3, "name": "Every 2 Weeks", "code": "fortnightly", "discount_pct": 15.0, "description": "" },
    { "id": 4, "name": "Every 4 Weeks", "code": "monthly",     "discount_pct": 10.0, "description": "" }
  ],
  "bathroom_options": [
    { "value": 1, "name": "1 Bathroom",   "surcharge": 0.00 },
    { "value": 2, "name": "2 Bathrooms",  "surcharge": 15.00 },
    { "value": 3, "name": "3 Bathrooms",  "surcharge": 30.00 },
    { "value": 4, "name": "4 Bathrooms",  "surcharge": 45.00 },
    { "value": 5, "name": "5+ Bathrooms", "surcharge": 55.00 }
  ],
  "access_methods": [
    { "code": "home",       "name": "Someone is Home" },
    { "code": "doorman",    "name": "Doorman" },
    { "code": "hidden_key", "name": "Hidden Key" },
    { "code": "other",      "name": "Other" }
  ],
  "contact_preferences": [
    { "code": "text", "name": "Text Message" },
    { "code": "call", "name": "Phone Call" },
    { "code": "email","name": "Email" }
  ]
}
```

All existing individual endpoints (`/api/v1/pricing`, `/api/v1/levels`, etc.) are **kept unchanged** for backward compatibility.

### Updated `create_booking` API

Accept two new optional fields:
- `access_method_code` (string) → resolved to `access_method_id` FK
- `contact_preference_code` (string) → resolved to `contact_preference_id` FK

---

## Part E: Complete File Change List

### Backend — New Files

| File | Purpose |
|---|---|
| `models/frequency.py` | `clean.frequency` model |
| `models/bathroom_option.py` | `clean.bathroom.option` model (with `surcharge` field) |
| `models/access_method.py` | `clean.access.method` model |
| `models/contact_preference.py` | `clean.contact.preference` model |
| `data/frequencies.xml` | 4 frequency seed records |
| `data/bathroom_options.xml` | 5 bathroom option records (with surcharges $0/$15/$30/$45/$55) |
| `data/access_methods.xml` | 4 access method records |
| `data/contact_preferences.xml` | 3 contact preference records |
| `views/frequency_views.xml` | Admin list + form views |
| `views/bathroom_option_views.xml` | Admin list + form views |
| `views/access_method_views.xml` | Admin list + form views |
| `views/contact_preference_views.xml` | Admin list + form views |
| `migrations/19.0.1.4.0/pre-migrate.py` | Create new tables, add columns |

### Backend — Modified Files

| File | Changes |
|---|---|
| `models/__init__.py` | Import 4 new model files |
| `models/booking.py` | Add `access_method_id`, `contact_preference_id`, `bathroom_amount`, `discount_amount` fields; full `_compute_amounts` rewrite; update `@api.depends` to include `bathrooms` and `frequency` |
| `models/pricing.py` | Add `label` computed field; update `_description` |
| `models/clean_level.py` | Rename field string `"Surcharge Price"` → already correct; update `_description` |
| `controllers/__init__.py` | No change needed (main.py already imported) |
| `controllers/main.py` | Add `GET /api/v1/catalog` endpoint |
| `controllers/booking.py` | Accept `access_method_code`, `contact_preference_code`; resolve to FKs |
| `data/clean_levels.xml` | Add `level_standard` record |
| `security/ir.model.access.csv` | Add rules for 4 new models |
| `views/booking_views.xml` | Add `access_method_id`, `contact_preference_id`, `bathroom_amount`, `discount_amount`; restructure Service group layout |
| `views/pricing_views.xml` | Rename list view title; add groupby `pricing_type`; add `label` column |
| `views/clean_level_views.xml` | Clarify `Surcharge` column header; add description column |
| `views/menus.xml` | Add 4 new Configuration menu items; rename "Pricing Plans" → "Property Size Tiers" |
| `__manifest__.py` | Bump to `19.0.1.4.0`; register all new files |

### Frontend — Phase 2 (separate task, after backend is merged)

| File | Change |
|---|---|
| `lib/types.ts` | Add `Frequency`, `BathroomOption`, `AccessMethod`, `ContactPreference`, `CatalogResponse` types |
| `lib/api.ts` | Add `getCatalog()`; individual calls remain for backward compat |
| `lib/constants.ts` | Remove `FREQUENCIES`; keep `TOTAL_STEPS` |
| `app/booking/page.tsx` | Use `catalog` state; remove `frequencyMap`; update `computeSubTotal` to apply `discount_pct` |
| `components/BookingBar.tsx` | Remove `BATH_OPTIONS` hardcode; read from `catalog.bathroom_options` |
| `components/booking/steps/RequirementsStep.tsx` | Remove hardcoded bedroom/bathroom arrays; read from API |
| `components/booking/steps/DetailsStep.tsx` | Remove `FREQUENCIES` import and `entryMethods` array; read from `catalog` |
| `components/booking/steps/PaymentStep.tsx` | Remove hardcoded contact preferences; read from `catalog.contact_preferences` |

---

## Migration Script (19.0.1.4.0)

The `pre-migrate.py` creates all new tables and adds new columns to `clean_booking`. Everything is **idempotent** (`IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`):

```python
def migrate(cr, version):
    # New tables
    cr.execute("""
        CREATE TABLE IF NOT EXISTS clean_frequency (
            id SERIAL PRIMARY KEY, name VARCHAR, code VARCHAR UNIQUE,
            description TEXT, discount_pct DOUBLE PRECISION DEFAULT 0,
            sequence INTEGER DEFAULT 10, active BOOLEAN DEFAULT TRUE,
            create_uid INTEGER, create_date TIMESTAMP,
            write_uid INTEGER, write_date TIMESTAMP
        )
    """)
    cr.execute("""
        CREATE TABLE IF NOT EXISTS clean_bathroom_option (
            id SERIAL PRIMARY KEY, name VARCHAR, value INTEGER,
            sequence INTEGER DEFAULT 10, active BOOLEAN DEFAULT TRUE,
            create_uid INTEGER, create_date TIMESTAMP,
            write_uid INTEGER, write_date TIMESTAMP
        )
    """)
    cr.execute("""
        CREATE TABLE IF NOT EXISTS clean_access_method (
            id SERIAL PRIMARY KEY, name VARCHAR, code VARCHAR UNIQUE,
            sequence INTEGER DEFAULT 10, active BOOLEAN DEFAULT TRUE,
            create_uid INTEGER, create_date TIMESTAMP,
            write_uid INTEGER, write_date TIMESTAMP
        )
    """)
    cr.execute("""
        CREATE TABLE IF NOT EXISTS clean_contact_preference (
            id SERIAL PRIMARY KEY, name VARCHAR, code VARCHAR UNIQUE,
            sequence INTEGER DEFAULT 10, active BOOLEAN DEFAULT TRUE,
            create_uid INTEGER, create_date TIMESTAMP,
            write_uid INTEGER, write_date TIMESTAMP
        )
    """)

    # New columns on clean_booking
    cr.execute("ALTER TABLE clean_booking ADD COLUMN IF NOT EXISTS access_method_id INTEGER")
    cr.execute("ALTER TABLE clean_booking ADD COLUMN IF NOT EXISTS contact_preference_id INTEGER")
    cr.execute("ALTER TABLE clean_booking ADD COLUMN IF NOT EXISTS discount_amount DOUBLE PRECISION DEFAULT 0")

    # New column on clean_pricing
    cr.execute("ALTER TABLE clean_pricing ADD COLUMN IF NOT EXISTS label VARCHAR")

    # New columns on clean_booking for bathroom surcharge and discount
    cr.execute("ALTER TABLE clean_booking ADD COLUMN IF NOT EXISTS bathroom_amount DOUBLE PRECISION DEFAULT 0")
```

---

## What This Does NOT Change

- `clean.booking.frequency` Selection field — stays as the validated enum
- All existing API endpoints (`/api/v1/pricing`, `/api/v1/levels`, `/api/v1/addons`, `/api/v1/availability`)
- All existing booking data
- The `clean.pricing` and `clean.level` model names and table names
- The `bedrooms` Integer field on `clean.booking`
- The `access_instructions` Text field (kept alongside new `access_method_id`)
