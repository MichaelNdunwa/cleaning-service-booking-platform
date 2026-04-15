"use client";

import { useState } from "react";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { forgotPassword } from "@/lib/api";

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

        try {
            await forgotPassword({ email });
            // Always show success regardless of whether the email exists
            // (anti-enumeration — the backend does the same)
            setSubmitted(true);
        } catch {
            // Even on a network error we show the success screen to avoid
            // leaking info, but for genuine connectivity issues we surface
            // a soft message that doesn't expose server details.
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <AuthCard>
                <div className="text-center pb-6 pt-2">
                    {/* Blue Checkmark Icon */}
                    <div className="w-12 h-12 rounded-full bg-[#1E78FF] flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1536] mb-3">
                        Reset link sent
                    </h1>
                    <p className="text-sm text-neutral-400 font-medium mb-8 max-w-[280px] mx-auto leading-relaxed">
                        If <strong className="text-neutral-600">{email}</strong> is registered, you&apos;ll receive a reset link shortly.
                    </p>

                    <Button variant="primary" fullWidth href="mailto:">
                        Open email app
                    </Button>

                    <div className="w-full border-t border-neutral-100 my-8" />

                    <p className="text-xs text-neutral-400 leading-relaxed max-w-[280px] mx-auto">
                        Can&apos;t find the email? Check your spam folder. The link expires after 24 hours.
                    </p>

                    <Link
                        href="/forgot-password"
                        className="block mt-4 text-xs font-semibold text-[#1E78FF] hover:text-[#165ECC] transition-colors"
                    >
                        Try a different email
                    </Link>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard>
            <div className="mb-6">
                <Link href="/login" className="inline-flex flex-row items-center text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors mb-6">
                    <span className="mr-1.5 font-sans leading-none pb-0.5">←</span> Back
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1536] text-center mb-3">
                    Forgot password?
                </h1>
                <p className="text-center text-sm text-neutral-500 font-medium leading-relaxed max-w-[280px] mx-auto">
                    Enter the email you use for the account and we&apos;ll send you a reset link
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="ENTER YOUR EMAIL"
                    type="email"
                    placeholder="reece08@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={error}
                />

                <Button type="submit" fullWidth disabled={loading}>
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending...
                        </span>
                    ) : (
                        "Email me my reset link"
                    )}
                </Button>

                <p className="text-center text-xs text-neutral-400 mt-6 leading-relaxed max-w-[260px] mx-auto">
                    If you don&apos;t see the email, please check your spam folder
                </p>
            </form>
        </AuthCard>
    );
}
