# -*- coding: utf-8 -*-
{
    "name": "Cleaning Service Booking",
    "version": "19.0.1.1.0",
    "category": "Services",
    "summary": "Cleaning service booking system with REST API for frontend integration",
    "description": """
        Cleaning Service Booking Platform
        ==================================
        - Customer booking management
        - Service types and add-ons
        - Time slot availability
        - REST API for Next.js frontend
        - Kanban workflow (Draft → Confirmed → Scheduled → In Progress → Done → Cancelled)
    """,
    "author": "Shield Cleaning Co",
    "website": "https://shieldcleaning.co",
    "license": "LGPL-3",
    "depends": [
        "base",
        "mail",
        "contacts",
        "web",
    ],
    "data": [
        # Security
        "security/cleaning_security.xml",
        "security/ir.model.access.csv",
        # Data
        "data/service_types.xml",
        "data/addons.xml",
        "data/time_slots.xml",
        # Views
        "views/booking_views.xml",
        "views/addon_views.xml",
        "views/service_type_views.xml",
        "views/time_slot_views.xml",
        "views/menus.xml",
        # Custom login
        "views/login_templates.xml",
    ],
    "assets": {
        "web.assets_frontend": [
            "cleaning_booking/static/src/scss/login.scss",
        ],
    },
    "installable": True,
    "application": True,
    "auto_install": False,
    "post_init_hook": "_assign_admin_to_cleaning_groups",
}
