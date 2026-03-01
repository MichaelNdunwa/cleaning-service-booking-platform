"use client";

import { useState } from "react";
import AuthCard from "@/components/auth/AuthCard";
import PasswordInput from "@/components/auth/PasswordInput";
import Button from "@/components/ui/Button";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

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
            setSuccess(true);
        }, 1500);
    };

    if (success) {
        return (
            <AuthCard
                title="Password reset!"
                subtitle="Your password has been successfully changed."
            >
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
        <AuthCard
            title="Reset your password"
            subtitle="Enter a new password for your account."
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <PasswordInput
                    label="New Password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                />

                <PasswordInput
                    label="Confirm New Password"
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={errors.confirmPassword}
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
                            Resetting...
                        </span>
                    ) : (
                        "Reset Password"
                    )}
                </Button>
            </form>
        </AuthCard>
    );
}
