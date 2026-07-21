def migrate(cr, version):
    """Migrate from clean.service.type to clean.pricing + clean.level.

    Fully idempotent — safe to re-run even if old table is already dropped.
    """
    # ── Check if old table exists ──
    cr.execute("""
        SELECT EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_name = 'clean_service_type'
        )
    """)
    old_table_exists = cr.fetchone()[0]

    # ── Step 1: Create clean_pricing table ──
    cr.execute("""
        CREATE TABLE IF NOT EXISTS clean_pricing (
            id SERIAL PRIMARY KEY,
            name VARCHAR,
            code VARCHAR,
            pricing_type VARCHAR DEFAULT 'bedroom',
            bedrooms INTEGER DEFAULT 0,
            base_price DOUBLE PRECISION DEFAULT 0,
            sequence INTEGER DEFAULT 10,
            active BOOLEAN DEFAULT TRUE,
            create_uid INTEGER REFERENCES res_users(id),
            create_date TIMESTAMP,
            write_uid INTEGER REFERENCES res_users(id),
            write_date TIMESTAMP
        )
    """)
    cr.execute("CREATE UNIQUE INDEX IF NOT EXISTS clean_pricing_code_unique ON clean_pricing(code)")

    # ── Step 2: Create clean_level table ──
    cr.execute("""
        CREATE TABLE IF NOT EXISTS clean_level (
            id SERIAL PRIMARY KEY,
            name VARCHAR,
            code VARCHAR,
            description TEXT,
            base_price DOUBLE PRECISION DEFAULT 0,
            sequence INTEGER DEFAULT 10,
            active BOOLEAN DEFAULT TRUE,
            create_uid INTEGER REFERENCES res_users(id),
            create_date TIMESTAMP,
            write_uid INTEGER REFERENCES res_users(id),
            write_date TIMESTAMP
        )
    """)
    cr.execute("CREATE UNIQUE INDEX IF NOT EXISTS clean_level_code_unique ON clean_level(code)")

    # ── Step 3: Migrate data from old table (only if it exists) ──
    if old_table_exists:
        cr.execute("DELETE FROM clean_pricing")
        cr.execute("""
            INSERT INTO clean_pricing (name, code, pricing_type, bedrooms, base_price, sequence, active, create_date, write_date)
            SELECT
                name,
                code,
                CASE WHEN category = 'specialty' THEN 'flat' ELSE 'bedroom' END,
                COALESCE(bedrooms, 0),
                base_price,
                sequence,
                active,
                create_date,
                write_date
            FROM clean_service_type
            WHERE category IN ('property', 'specialty')
        """)

        cr.execute("DELETE FROM clean_level")
        cr.execute("""
            INSERT INTO clean_level (name, code, description, base_price, sequence, active, create_date, write_date)
            SELECT name, code, description, base_price, sequence, active, create_date, write_date
            FROM clean_service_type
            WHERE category = 'clean_level'
        """)

        # ── Clean up old ir_model_data entries ──
        cr.execute("DELETE FROM ir_model_data WHERE model = 'clean.service.type'")

    # ── Step 4: Register records in ir_model_data (idempotent) ──
    cr.execute("DELETE FROM ir_model_data WHERE module = 'cleaning_booking' AND model IN ('clean.pricing', 'clean.level')")
    cr.execute("""
        INSERT INTO ir_model_data (module, model, name, res_id, noupdate)
        SELECT 'cleaning_booking', 'clean.pricing', 'pricing_' || code, id, TRUE
        FROM clean_pricing
    """)
    cr.execute("""
        INSERT INTO ir_model_data (module, model, name, res_id, noupdate)
        SELECT 'cleaning_booking', 'clean.level', 'level_' || code, id, TRUE
        FROM clean_level
    """)

    # ── Step 5: Add new columns to clean_booking ──
    cr.execute("ALTER TABLE clean_booking ADD COLUMN IF NOT EXISTS pricing_id INTEGER")
    cr.execute("ALTER TABLE clean_booking ADD COLUMN IF NOT EXISTS clean_level_id INTEGER")

    # ── Step 6: Map old FK references (only if old table exists and bookings have old columns) ──
    if old_table_exists:
        cr.execute("""
            SELECT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name = 'clean_booking' AND column_name = 'service_type_id'
            )
        """)
        old_fk_exists = cr.fetchone()[0]
        if old_fk_exists:
            cr.execute("""
                UPDATE clean_booking b
                SET pricing_id = cp.id
                FROM clean_pricing cp, clean_service_type cst
                WHERE cp.code = cst.code AND cst.id = b.service_type_id
            """)
            cr.execute("""
                UPDATE clean_booking b
                SET clean_level_id = cl.id
                FROM clean_level cl, clean_service_type cst
                WHERE cl.code = cst.code AND cst.id = b.clean_type_id
            """)

    # ── Step 7: Add foreign keys (if not already present) ──
    cr.execute("""
        DO $$ BEGIN
            ALTER TABLE clean_booking ADD CONSTRAINT clean_booking_pricing_fk
                FOREIGN KEY (pricing_id) REFERENCES clean_pricing(id);
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$
    """)
    cr.execute("""
        DO $$ BEGIN
            ALTER TABLE clean_booking ADD CONSTRAINT clean_booking_clean_level_fk
                FOREIGN KEY (clean_level_id) REFERENCES clean_level(id);
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$
    """)

    # ── Step 8: Drop old columns and old table ──
    cr.execute("ALTER TABLE clean_booking DROP COLUMN IF EXISTS service_type_id")
    cr.execute("ALTER TABLE clean_booking DROP COLUMN IF EXISTS clean_type_id")
    if old_table_exists:
        cr.execute("DROP TABLE IF EXISTS clean_service_type CASCADE")
