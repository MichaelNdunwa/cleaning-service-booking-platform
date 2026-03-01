# -*- coding: utf-8 -*-


def migrate(cr, version):
    """Assign admin users to the Cleaning Manager group so the menu is visible.
    In Odoo 19, res.groups no longer has a 'users' field — the relationship
    is via res_groups_users_rel, so we insert directly.
    """
    # Get the cleaning manager group id
    cr.execute("""
        SELECT res_id FROM ir_model_data
        WHERE module = 'cleaning_booking' AND name = 'group_cleaning_manager'
    """)
    row = cr.fetchone()
    if not row:
        return
    group_id = row[0]

    # Get admin user ids
    cr.execute("""
        SELECT res_id FROM ir_model_data
        WHERE module = 'base' AND name IN ('user_root', 'user_admin')
    """)
    user_ids = [r[0] for r in cr.fetchall()]

    for uid in user_ids:
        cr.execute("""
            INSERT INTO res_groups_users_rel (gid, uid)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING
        """, (group_id, uid))
