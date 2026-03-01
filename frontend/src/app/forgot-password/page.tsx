"use client";

import { useState } from "react";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setError("Email is required");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email");
            return;
        }

        setError("");
        setLoading(true);

        // TODO: Integrate with auth provider
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    if (submitted) {
        return (
            <AuthCard
                title="Reset link sent"
                subtitle="Check your email for a password reset link."
            >
                <div className="text-center py-6">
                    {/* Success Icon */}
                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-8 h-8 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <p className="text-sm text-neutral-600 mb-6">
                        We&apos;ve sent a password reset link to{" "}
                        <span className="font-semibold text-brand-primary">{email}</span>.
                        Please check your inbox and spam folder.
                    </p>
                    <Button variant="primary" fullWidth href="/login">
                        Back to Login
                    </Button>
                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setEmail("");
                        }}
                        className="mt-4 text-sm text-brand-accent hover:text-brand-accent-hover font-medium transition-colors"
                    >
                        Didn&apos;t receive it? Try again
                    </button>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard
            title="Forgot password?"
            subtitle="Enter your email and we'll send you a reset link."
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={error}
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
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    }
                />

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
                            Sending...
                        </span>
                    ) : (
                        "Send Reset Link"
                    )}
                </Button>

                <p className="text-center text-sm text-neutral-500 mt-4">
                    <Link
                        href="/login"
                        className="font-semibold text-brand-accent hover:text-brand-accent-hover transition-colors"
                    >
                        ← Back to Login
                    </Link>
                </p>
            </form>
        </AuthCard>
    );
}
