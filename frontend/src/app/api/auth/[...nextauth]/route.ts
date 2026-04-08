import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/*
 * NextAuth.js v5 (Auth.js) handler.
 *
 * Flow:
 *  1. User clicks "Continue with Google"
 *  2. NextAuth redirects to Google consent screen
 *  3. Google sends back an authorisation code to /api/auth/callback/google
 *  4. NextAuth exchanges the code for an ID token (server-side, never the browser)
 *  5. Our `signIn` callback calls the Odoo /api/v1/auth/oauth endpoint to
 *     find-or-create the portal user and establish an Odoo session
 *  6. NextAuth stores a JWT session cookie for the Next.js layer
 */

const ODOO_BASE_URL = process.env.ODOO_BASE_URL ?? "http://localhost:9090";

const handler = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    /*
     * Persist extra fields (odooUserId) in the JWT so we can use them
     * in useSession() without an extra round-trip.
     */
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    const res = await fetch(`${ODOO_BASE_URL}/api/v1/auth/oauth`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            provider: "google",
                            email: user.email,
                            name: user.name,
                            provider_uid: account.providerAccountId,
                        }),
                        credentials: "include",
                    });

                    if (!res.ok) {
                        console.error("[NextAuth] Odoo OAuth sync failed:", res.status);
                        // Still allow sign-in — Odoo sync failure should not block login
                    } else {
                        const data = await res.json();
                        // Attach Odoo user ID to the user object so jwt() can pick it up
                        (user as any).odooId = data?.user?.id ?? null;
                    }
                } catch (err) {
                    console.error("[NextAuth] Odoo OAuth sync error:", err);
                }
            }
            return true; // Allow sign-in regardless
        },

        async jwt({ token, user }) {
            // `user` is only present on the first sign-in
            if (user) {
                token.odooId = (user as any).odooId ?? null;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },

        async session({ session, token }) {
            session.user.odooId = (token.odooId as number | null) ?? null;
            return session;
        },
    },

    pages: {
        signIn: "/login",       // Redirect to our custom login page
        error: "/login",        // On OAuth error, go back to login with ?error=
    },

    session: {
        strategy: "jwt",
    },
});

export const { GET, POST } = handler.handlers;
