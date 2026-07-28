# -*- coding: utf-8 -*-


def migrate(cr, version):
    """Create clean_bedroom_option table for v19.0.1.5.0.

    Idempotent — safe to re-run.
    """

    cr.execute("""
        CREATE TABLE IF NOT EXISTS clean_bedroom_option (
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
