# -*- coding: utf-8 -*-


def migrate(cr, version):
    """Reset noupdate flag on security group records so they can be updated from XML."""
    cr.execute("""
        UPDATE ir_model_data
        SET noupdate = false
        WHERE module = 'cleaning_booking'
          AND name IN ('group_cleaning_user', 'group_cleaning_manager')
    """)
