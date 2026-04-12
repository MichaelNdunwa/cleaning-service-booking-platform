"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";
import { login, signup, logout, getMe, oauthLogin } from "@/lib/api";
import { LoginPayload, SignupPayload } from "@/lib/types";

// User entity format based on what the Odoo /me endpoint returns
export interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials: LoginPayload) => Promise<void>;
    signup: (payload: SignupPayload) => Promise<void>;
    logout: () => Promise<void>;
    loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { data: session, status } = useSession();

    // Prevent the Odoo OAuth sync from running more than once per session
    const odooSyncedRef = useRef(false);

    // Main auth effect — runs when the NextAuth session status resolves
    useEffect(() => {
        // Wait for NextAuth to finish loading before we do anything
        if (status === "loading") return;

        const checkAuth = async () => {
            setIsLoading(true);
            try {
                // PATH 1 — Google OAuth user
                // The NextAuth server callback already syncs the Google user to
                // Odoo. Reuse that result when available so one Google login
                // creates one Odoo login log entry.
                if (status === "authenticated" && session?.user?.email) {
                    if (session.user.odooId) {
                        odooSyncedRef.current = true;
                        setUser({
                            id: session.user.odooId,
                            name: session.user.name ?? "",
                            email: session.user.email,
                        });
                        return;
                    }

                    // Fallback: if the server-side sync did not attach an Odoo
                    // user id, try once from the browser.
                    if (!odooSyncedRef.current) {
                        odooSyncedRef.current = true;
                        const oauthRes = await oauthLogin({
                            provider: "google",
                            email: session.user.email,
                            name: session.user.name ?? "",
                            provider_uid: session.user.email,
                        });
                        setUser(oauthRes?.user ? (oauthRes.user as User) : null);
                    }
                    return;
                }

                // PATH 2 — Email/password user
                // No NextAuth session → restore state from the Odoo session cookie.
                if (status === "unauthenticated") {
                    try {
                        const res = await getMe();
                        setUser(res?.user ? (res.user as User) : null);
                    } catch {
                        setUser(null); // 401 = no active Odoo session
                    }
                }
            } catch (err) {
                console.error("[AuthContext] checkAuth error:", err);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [status, session]); // Re-runs when NextAuth resolves after Google redirect

    const handleLogin = async (credentials: LoginPayload) => {
        setIsLoading(true);
        try {
            const res = await login(credentials);
            if (res?.user) {
                setUser(res.user as User);
                router.push("/");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (payload: SignupPayload) => {
        setIsLoading(true);
        try {
            await signup(payload);
            router.push("/login?registered=1");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logout();                                    // Clear Odoo session cookie
            await nextAuthSignOut({ redirect: false });        // Clear NextAuth JWT cookie
            setUser(null);
            odooSyncedRef.current = false;                     // Allow re-sync on next Google login
            router.push("/");
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Initiates Google OAuth via NextAuth.
     * 1. Clears any stale/broken Odoo session cookie first (prevents 403 on callback).
     * 2. NextAuth handles the full redirect → Google consent → callback flow.
     * 3. On success, the user lands on "/" and the useEffect above syncs Odoo state.
     */
    const handleLoginWithGoogle = async () => {
        // Clear any broken Odoo session cookie before redirecting to Google.
        // A session with uid but no session_token causes Odoo to return 403.
        // The server-side route can clear even HttpOnly cookies.
        await fetch("/api/clear-odoo-session").catch(() => {});
        await nextAuthSignIn("google", { callbackUrl: "/" });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login: handleLogin,
                signup: handleSignup,
                logout: handleLogout,
                loginWithGoogle: handleLoginWithGoogle,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
