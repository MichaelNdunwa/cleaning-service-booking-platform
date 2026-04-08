import "next-auth";
import "next-auth/jwt";

/**
 * Extend NextAuth's built-in Session and JWT types to include
 * the Odoo user ID we attach during the signIn callback.
 */
declare module "next-auth" {
    interface Session {
        user: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
            odooId: number | null;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        odooId?: number | null;
    }
}
