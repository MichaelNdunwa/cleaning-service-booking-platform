"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/auth/PasswordInput";
import GoogleButton from "@/components/auth/GoogleButton";
import Button from "@/components/ui/Button";
import { signup } from "@/lib/api";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const update = (field: string, value: string | boolean) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!form.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email))
            newErrors.email = "Please enter a valid email";
        if (!form.password) newErrors.password = "Password is required";
        else if (form.password.length < 8)
            newErrors.password = "Password must be at least 8 characters";
        if (form.password !== form.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";
        if (!form.agreeTerms)
            newErrors.agreeTerms = "You must agree to the terms";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            await signup({
                name: form.fullName,
                email: form.email,
                password: form.password,
            });
            router.push("/login?registered=1");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Signup failed. Please try again.";
            setErrors({ general: message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard
            title="Sign up"
            subtitle="Create your account to start booking."
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                        {errors.general}
                    </div>
                )}
                <Input
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    error={errors.fullName}
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    }
                />

                <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
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
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    error={errors.password}
                />

                <PasswordInput
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    error={errors.confirmPassword}
                />

                {/* Terms Checkbox */}
                <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={form.agreeTerms}
                        onChange={(e) => update("agreeTerms", e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-neutral-300 text-brand-accent focus:ring-brand-accent/30"
                    />
                    <span className="text-sm text-neutral-600 leading-snug">
                        I agree to the{" "}
                        <Link
                            href="/terms"
                            className="text-brand-accent hover:underline font-medium"
                        >
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy"
                            className="text-brand-accent hover:underline font-medium"
                        >
                            Privacy Policy
                        </Link>
                    </span>
                </label>
                {errors.agreeTerms && (
                    <p className="text-xs text-red-500 -mt-2">{errors.agreeTerms}</p>
                )}

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
                            Creating account...
                        </span>
                    ) : (
                        "Create Account"
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
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-brand-accent hover:text-brand-accent-hover transition-colors"
                    >
                        Log in
                    </Link>
                </p>
            </form>
        </AuthCard>
    );
}
