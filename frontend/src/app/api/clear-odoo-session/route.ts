import { NextResponse } from "next/server";

/**
 * GET /api/clear-odoo-session
 *
 * Clears the Odoo session cookie from the browser.
 * Called before starting Google OAuth so that a broken session cookie
 * (uid set but no session_token) doesn't cause Odoo to return 403.
 *
 * Using a server-side route works even for HttpOnly cookies because the
 * browser always honours Set-Cookie response headers regardless of the
 * HttpOnly flag — unlike document.cookie which can't touch HttpOnly cookies.
 */
export async function GET() {
    const response = NextResponse.json({ cleared: true });

    // Expire the Odoo session cookie immediately
    response.cookies.set("session_id", "", {
        maxAge: 0,
        path: "/",
        httpOnly: true,
        sameSite: "lax",
    });

    return response;
}
