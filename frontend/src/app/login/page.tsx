"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/auth/PasswordInput";
import GoogleButton from "@/components/auth/GoogleButton";
import AppleButton from "@/components/auth/AppleButton";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

function LoginPageContent() {
    const searchParams = useSearchParams();
    const justRegistered = searchParams.get("registered") === "1";
    const justReset = searchParams.get("reset") === "1";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>(
        {}
    );
    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: typeof errors = {};

        if (!email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email))
            newErrors.email = "Please enter a valid email";

        if (!password) newErrors.password = "Password is required";
        else if (password.length < 8)
            newErrors.password = "Password must be at least 8 characters";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        try {
            await login({ email, password });
            // The AuthContext automatically router.push('/') on success
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Login failed. Please try again.";
            setErrors({ general: message });
        }
    };

    return (
        <AuthCard title="Login">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Social Login */}
                <div className="space-y-3">
                    <GoogleButton />
                    <AppleButton />
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-200" />
                    </div>
                </div>

                {justRegistered && (
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
                        Account created successfully! Please log in below.
                    </div>
                )}
                {justReset && (
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
                        Password updated! You can now log in with your new password.
                    </div>
                )}
                {errors.general && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                        {errors.general}
                    </div>
                )}
                <Input
                    label="EMAIL"
                    type="email"
                    placeholder="reece08@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                />

                <PasswordInput
                    label="PASSWORD"
                    placeholder="........"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                />

                <Button type="submit" fullWidth disabled={isLoading}>
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Continuing...
                        </span>
                    ) : (
                        "Continue"
                    )}
                </Button>

                <div className="flex flex-col items-center gap-2 mt-6 pt-2">
                    <p className="text-sm text-neutral-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-semibold text-[#1E78FF] hover:text-[#165ECC] transition-colors">
                            Sign up
                        </Link>
                    </p>
                    <Link href="/forgot-password" className="text-sm font-semibold text-[#1E78FF] hover:text-[#165ECC] transition-colors">
                        Forgot password
                    </Link>
                </div>
            </form>
        </AuthCard>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginPageContent />
        </Suspense>
    );
}
