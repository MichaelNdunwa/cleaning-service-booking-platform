# -*- coding: utf-8 -*-


def migrate(cr, version):
    """Create new tables and add columns for v19.0.1.4.0.

    All statements are idempotent — safe to re-run.
    """

    # ── New tables ──

    cr.execute("""
        CREATE TABLE IF NOT EXISTS clean_frequency (
            id SERIAL PRIMARY KEY,
            name VARCHAR,
            code VARCHAR UNIQUE,
            description TEXT,
            discount_pct DOUBLE PRECISION DEFAULT 0,
            sequence INTEGER DEFAULT 10,
            active BOOLEAN DEFAULT TRUE,
            create_uid INTEGER REFERENCES res_users(id),
            create_date TIMESTAMP,
            write_uid INTEGER REFERENCES res_users(id),
            write_date TIMESTAMP
        )
    """)

    cr.execute("""
        CREATE TABLE IF NOT EXISTS clean_bathroom_option (
            id SERIAL PRIMARY KEY,
            name VARCHAR,
            value INTEGER,
            surcharge DOUBLE PRECISION DEFAULT 0,
            sequence INTEGER DEFAULT 10,
            active BOOLEAN DEFAULT TRUE,
            create_uid INTEGER REFERENCES res_users(id),
            create_date TIMESTAMP,
            write_uid INTEGER REFERENCES res_users(id),
            write_date TIMESTAMP
        )
    """)

    cr.execute("""
        CREATE TABLE IF NOT EXISTS clean_access_method (
            id SERIAL PRIMARY KEY,
            name VARCHAR,
            code VARCHAR UNIQUE,
            sequence INTEGER DEFAULT 10,
            active BOOLEAN DEFAULT TRUE,
            create_uid INTEGER REFERENCES res_users(id),
            create_date TIMESTAMP,
            write_uid INTEGER REFERENCES res_users(id),
            write_date TIMESTAMP
        )
    """)

    cr.execute("""
        CREATE TABLE IF NOT EXISTS clean_contact_preference (
            id SERIAL PRIMARY KEY,
            name VARCHAR,
            code VARCHAR UNIQUE,
            sequence INTEGER DEFAULT 10,
            active BOOLEAN DEFAULT TRUE,
            create_uid INTEGER REFERENCES res_users(id),
            create_date TIMESTAMP,
            write_uid INTEGER REFERENCES res_users(id),
            write_date TIMESTAMP
        )
    """)

    # ── New columns on clean_booking ──

    cr.execute("ALTER TABLE clean_booking ADD COLUMN IF NOT EXISTS access_method_id INTEGER")
    cr.execute(
        "ALTER TABLE clean_booking ADD CONSTRAINT clean_booking_access_method_fk "
        "FOREIGN KEY (access_method_id) REFERENCES clean_access_method(id) "
        "ON DELETE SET NULL"
    ) if not _constraint_exists(cr, "clean_booking_access_method_fk") else None

    cr.execute("ALTER TABLE clean_booking ADD COLUMN IF NOT EXISTS contact_preference_id INTEGER")
    cr.execute(
        "ALTER TABLE clean_booking ADD CONSTRAINT clean_booking_contact_preference_fk "
        "FOREIGN KEY (contact_preference_id) REFERENCES clean_contact_preference(id) "
        "ON DELETE SET NULL"
    ) if not _constraint_exists(cr, "clean_booking_contact_preference_fk") else None

    cr.execute("ALTER TABLE clean_booking ADD COLUMN IF NOT EXISTS bathroom_amount DOUBLE PRECISION DEFAULT 0")
    cr.execute("ALTER TABLE clean_booking ADD COLUMN IF NOT EXISTS discount_amount DOUBLE PRECISION DEFAULT 0")

    # ── New column on clean_pricing ──

    cr.execute("ALTER TABLE clean_pricing ADD COLUMN IF NOT EXISTS label VARCHAR")


def _constraint_exists(cr, constraint_name):
    cr.execute(
        "SELECT 1 FROM pg_constraint WHERE conname = %s", (constraint_name,)
    )
    return cr.fetchone() is not None
