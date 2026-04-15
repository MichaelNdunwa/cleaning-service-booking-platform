"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import PasswordInput from "@/components/auth/PasswordInput";
import Button from "@/components/ui/Button";
import { resetPassword } from "@/lib/api";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // No token in the URL → show an error immediately
    if (!token) {
        return (
            <AuthCard>
                <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-[#0B1536] mb-3">Invalid reset link</h1>
                    <p className="text-sm text-neutral-500 mb-6 max-w-xs mx-auto">
                        This link is missing a reset token. Please request a new password reset.
                    </p>
                    <Button variant="primary" fullWidth href="/forgot-password">
                        Request new reset link
                    </Button>
                </div>
            </AuthCard>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        setGlobalError(null);

        if (!password) newErrors.password = "Password is required";
        else if (password.length < 8)
            newErrors.password = "Password must be at least 8 characters";

        if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
        else if (password !== confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            await resetPassword({ token, password });
            setSuccess(true);
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Password reset failed. Please try again.";
            setGlobalError(message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <AuthCard title="Password reset!">
                <div className="text-center py-6">
                    <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-sm text-neutral-600 mb-6">
                        Your password has been updated. You can now log in with your new password.
                    </p>
                    <Button variant="primary" fullWidth href="/login?reset=1">
                        Go to Login
                    </Button>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard>
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1536] text-center mb-3">
                    Reset your password
                </h1>

                {globalError && (
                    <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-center text-sm text-red-600 font-medium leading-relaxed">
                            {globalError}
                        </p>
                        {globalError.toLowerCase().includes("invalid") ||
                         globalError.toLowerCase().includes("expired") ? (
                            <div className="text-center mt-2">
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-semibold text-[#1E78FF] hover:text-[#165ECC] transition-colors"
                                >
                                    Request a new reset link →
                                </Link>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <PasswordInput
                    label="ENTER NEW PASSWORD"
                    placeholder="........"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    invalid={!!globalError || !!errors.password}
                />

                <PasswordInput
                    label="CONFIRM NEW PASSWORD"
                    placeholder="........"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={errors.confirmPassword}
                    invalid={!!globalError || !!errors.confirmPassword}
                />

                <Button type="submit" fullWidth disabled={loading}>
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Saving...
                        </span>
                    ) : (
                        "Save password & login"
                    )}
                </Button>
            </form>
        </AuthCard>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordContent />
        </Suspense>
    );
}
