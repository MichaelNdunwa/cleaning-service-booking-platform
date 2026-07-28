# -*- coding: utf-8 -*-
{
    "name": "Cleaning Service Booking",
    "version": "19.0.1.5.0",
    "category": "Services",
    "summary": "Cleaning service booking system with REST API for frontend integration",
    "description": """
        Cleaning Service Booking Platform
        ==================================
        - Customer booking management
        - Pricing plans and clean levels
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
        "data/pricing.xml",
        "data/clean_levels.xml",
        "data/addons.xml",
        "data/time_slots.xml",
        "data/frequencies.xml",
        "data/bedroom_options.xml",
        "data/bathroom_options.xml",
        "data/access_methods.xml",
        "data/contact_preferences.xml",
        "data/cron_data.xml",
        # Views
        "views/booking_views.xml",
        "views/pricing_views.xml",
        "views/clean_level_views.xml",
        "views/addon_views.xml",
        "views/time_slot_views.xml",
        "views/frequency_views.xml",
        "views/bedroom_option_views.xml",
        "views/bathroom_option_views.xml",
        "views/access_method_views.xml",
        "views/contact_preference_views.xml",
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
