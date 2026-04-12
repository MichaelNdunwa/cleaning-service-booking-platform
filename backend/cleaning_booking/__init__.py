# -*- coding: utf-8 -*-
from . import models
from . import controllers


def _assign_admin_to_cleaning_groups(env):
    """Post-init hook: ensure admin users are members of the Cleaning Manager group."""
    manager_group = env.ref('cleaning_booking.group_cleaning_manager', raise_if_not_found=False)
    if manager_group:
        admin_user = env.ref('base.user_admin', raise_if_not_found=False)
        root_user = env.ref('base.user_root', raise_if_not_found=False)
        for user in (admin_user, root_user):
            if user and manager_group not in user.group_ids:
                user.sudo().write({'group_ids': [(4, manager_group.id)]})
