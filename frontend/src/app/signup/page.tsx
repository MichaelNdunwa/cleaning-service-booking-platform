"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/auth/PasswordInput";
import GoogleButton from "@/components/auth/GoogleButton";
import AppleButton from "@/components/auth/AppleButton";
import Button from "@/components/ui/Button";
import { signup } from "@/lib/api";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
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
        <AuthCard title="Sign up">
            <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                        {errors.general}
                    </div>
                )}
                {/* Social Login */}
                <div className="space-y-3">
                    <GoogleButton />
                    <AppleButton />
                </div>

                <div className="relative my-6 border-t border-neutral-100"></div>

                <Input
                    label="NAME"
                    type="text"
                    placeholder="Reece Shearer"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    error={errors.fullName}
                />

                <Input
                    label="EMAIL"
                    type="email"
                    placeholder="reece08@gmail.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    error={errors.email}
                />

                <PasswordInput
                    label="ENTER NEW PASSWORD"
                    placeholder="........"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    error={errors.password}
                />

                {/* Terms Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                        type="checkbox"
                        checked={form.agreeTerms}
                        onChange={(e) => update("agreeTerms", e.target.checked)}
                        className="w-[18px] h-[18px] rounded-[4px] border-[#1E78FF] text-[#1E78FF] focus:ring-[#1E78FF]/30"
                    />
                    <span className="text-sm text-neutral-400 font-medium">
                        I agree to the{" "}
                        <Link
                            href="/terms"
                            className="text-[#1E78FF] hover:text-[#165ECC] font-bold"
                        >
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy"
                            className="text-[#1E78FF] hover:text-[#165ECC] font-bold"
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
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Creating account...
                        </span>
                    ) : (
                        "Continue"
                    )}
                </Button>

                <p className="text-center text-xs text-neutral-400 mt-4">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-bold text-[#1E78FF] hover:text-[#165ECC] transition-colors"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </AuthCard>
    );
}
