def migrate(cr, version):
    """Rename addons_amount → extras_amount column on clean_booking."""
    cr.execute(
        "SELECT column_name FROM information_schema.columns "
        "WHERE table_name = 'clean_booking' AND column_name = 'addons_amount'"
    )
    if cr.fetchone():
        cr.execute("ALTER TABLE clean_booking RENAME COLUMN addons_amount TO extras_amount")
