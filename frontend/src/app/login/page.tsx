"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/auth/PasswordInput";
import GoogleButton from "@/components/auth/GoogleButton";
import Button from "@/components/ui/Button";
import { login } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const justRegistered = searchParams.get("registered") === "1";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>(
        {}
    );
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: typeof errors = {};

        if (!email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email))
            newErrors.email = "Please enter a valid email";

        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6)
            newErrors.password = "Password must be at least 6 characters";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            await login({ email, password });
            router.push("/");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Login failed. Please try again.";
            setErrors({ general: message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard title="Log in" subtitle="Welcome back! Enter your details below.">
            <form onSubmit={handleSubmit} className="space-y-4">
                {justRegistered && (
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
                        Account created successfully! Please log in below.
                    </div>
                )}
                {errors.general && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                        {errors.general}
                    </div>
                )}
                <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    icon={
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            />
                        </svg>
                    }
                />

                <PasswordInput
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                />

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-neutral-300 text-brand-accent focus:ring-brand-accent/30"
                        />
                        <span className="text-sm text-neutral-600">Remember me</span>
                    </label>
                    <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-brand-accent hover:text-brand-accent-hover transition-colors"
                    >
                        Forgot password?
                    </Link>
                </div>

                <Button type="submit" fullWidth disabled={loading}>
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg
                                className="w-4 h-4 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                            Logging in...
                        </span>
                    ) : (
                        "Log in"
                    )}
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-3 text-neutral-400">
                            Or continue with
                        </span>
                    </div>
                </div>

                <GoogleButton />

                <p className="text-center text-sm text-neutral-500 mt-6">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="font-semibold text-brand-accent hover:text-brand-accent-hover transition-colors"
                    >
                        Sign up
                    </Link>
                </p>
            </form>
        </AuthCard>
    );
}
