"use client";

import { useState } from "react";
import AuthCard from "@/components/auth/AuthCard";
import PasswordInput from "@/components/auth/PasswordInput";
import Button from "@/components/ui/Button";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        setGlobalError(null);

        if (!password) newErrors.password = "Password is required";
        else if (password.length < 8)
            newErrors.password = "Password must be at least 8 characters";

        if (password !== confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        // TODO: Integrate with auth provider
        setTimeout(() => {
            setLoading(false);

            // Temporary mock to show the global error layout for a specific password
            if (password === "oldpassword") {
                setGlobalError("Your new password cannot be the same as your old password. Please create a new one.");
                return;
            }

            setSuccess(true);
        }, 1500);
    };

    if (success) {
        return (
            <AuthCard title="Password reset!">
                <div className="text-center py-6">
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
                        You can now log in with your new password.
                    </p>
                    <Button variant="primary" fullWidth href="/login">
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
                    <p className="text-center text-sm text-[#EF4444] font-medium leading-relaxed max-w-[320px] mx-auto mt-2">
                        {globalError}
                    </p>
                )}
            </div>

            {globalError && (
                <div className="w-full border-t border-neutral-100 mb-6"></div>
            )}

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
