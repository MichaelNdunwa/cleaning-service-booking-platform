"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, signup, logout, getMe } from "@/lib/api";
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Check auth status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await getMe();
                if (res?.user) {
                    setUser(res.user as User);
                }
            } catch (err) {
                // Not authenticated or API down, silently fail and clear state
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogin = async (credentials: LoginPayload) => {
        setIsLoading(true);
        try {
            const res = await login(credentials);
            if (res?.user) {
                setUser(res.user as User);
                router.push('/');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (payload: SignupPayload) => {
        setIsLoading(true);
        try {
            // Wait for successful account creation
            await signup(payload);
            // Push them back to login page with a success message flag
            router.push('/login?registered=1');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logout();
            setUser(null);
            router.push('/');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login: handleLogin,
                signup: handleSignup,
                logout: handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook helper
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
