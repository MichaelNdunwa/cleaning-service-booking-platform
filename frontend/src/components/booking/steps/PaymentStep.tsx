"use client";

import { useState, useEffect } from "react";
import { BookingState } from "@/app/booking/page";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/ui/CTABanner";
import { useAuth } from "@/context/AuthContext";
import type { CatalogResponse } from "@/lib/types";

interface Props {
    data: BookingState;
    updateData: (updates: Partial<BookingState>) => void;
    onNext: () => void;
    isSubmitting?: boolean;
    submitError?: string | null;
    catalog: CatalogResponse | null;
}

export default function PaymentStep({ data, updateData, onNext, isSubmitting, submitError, catalog }: Props) {
    const { user } = useAuth();
    const isLoggedIn = !!user;
    const [errors, setErrors] = useState<Record<string, string>>({});

    const contactPreferences = catalog?.contact_preferences ?? [];

    useEffect(() => {
        if (user) {
            updateData({ fullName: user.name, email: user.email });
        }
    }, [user, updateData]);

    const validate = (): boolean => {
        const errs: Record<string, string> = {};
        if (!data.fullName.trim()) errs.fullName = "Full name is required";
        if (!data.email.trim()) errs.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(data.email)) errs.email = "Invalid email address";
        if (!data.phone.trim()) errs.phone = "Phone number is required";
        if (!isLoggedIn) {
            if (!data.password) errs.password = "Password is required";
            else if (data.password.length < 8) errs.password = "Password must be at least 8 characters";
            if (data.password !== data.confirmPassword) errs.confirmPassword = "Passwords do not match";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        onNext();
    };

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16 items-start animate-fade-in relative -mt-6 md:-mt-0">
            {/* Left Column: Form */}
            <div className="flex-1 w-full mx-auto max-w-2xl px-2 md:px-0">
                <h2 className="text-[28px] md:text-3xl font-bold text-[#0B1536] mb-2 leading-tight">Payment Details</h2>
                <p className="text-[#9CA3AF] text-[15px] mb-8 md:mb-12">Add in your payment details through our secure gateway</p>

                {/* Credit Card */}
                <div className="w-full mb-8">
                    <p className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">CREDIT CARD</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                        <input
                            type="text"
                            placeholder="Card number"
                            className="col-span-2 h-[52px] w-full border border-neutral-200 rounded-lg px-4 text-[14px] text-[#0B1536] focus:border-[#1E78FF] focus:ring-1 focus:ring-[#1E78FF] outline-none placeholder:text-neutral-400 font-medium"
                        />
                        <input
                            type="text"
                            placeholder="mm/yyyy"
                            className="h-[52px] w-full border border-neutral-200 rounded-lg px-4 text-[14px] text-[#0B1536] focus:border-[#1E78FF] focus:ring-1 focus:ring-[#1E78FF] outline-none placeholder:text-neutral-400 font-medium"
                        />
                        <input
                            type="text"
                            placeholder="123"
                            className="h-[52px] w-full border border-neutral-200 rounded-lg px-4 text-[14px] text-[#0B1536] focus:border-[#1E78FF] focus:ring-1 focus:ring-[#1E78FF] outline-none placeholder:text-neutral-400 font-medium"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 max-w-[500px]">
                    {/* Full Name */}
                    <div className="flex flex-col gap-2 col-span-full md:col-span-1">
                        <label className="text-[10px] font-extrabold text-neutral-300 uppercase tracking-widest pl-1">FULL NAME</label>
                        <input
                            type="text"
                            placeholder="Enter Full name"
                            value={data.fullName}
                            onChange={(e) => updateData({ fullName: e.target.value })}
                            readOnly={isLoggedIn}
                            className={`h-[52px] w-full border border-neutral-200 rounded-lg px-4 text-[14px] text-[#0B1536] focus:border-[#1E78FF] focus:ring-1 focus:ring-[#1E78FF] outline-none placeholder:text-neutral-400 font-medium ${isLoggedIn ? "bg-neutral-50 cursor-not-allowed" : ""}`}
                        />
                        {errors.fullName && <span className="text-red-500 text-xs pl-1">{errors.fullName}</span>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2 col-span-full md:col-span-1">
                        <label className="text-[10px] font-extrabold text-neutral-300 uppercase tracking-widest pl-1">EMAIL ADDRESS</label>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={data.email}
                            onChange={(e) => updateData({ email: e.target.value })}
                            readOnly={isLoggedIn}
                            className={`h-[52px] w-full border border-neutral-200 rounded-lg px-4 text-[14px] text-[#0B1536] focus:border-[#1E78FF] focus:ring-1 focus:ring-[#1E78FF] outline-none placeholder:text-neutral-400 font-medium ${isLoggedIn ? "bg-neutral-50 cursor-not-allowed" : ""}`}
                        />
                        {errors.email && <span className="text-red-500 text-xs pl-1">{errors.email}</span>}
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-2 col-span-full md:col-span-1">
                        <label className="text-[10px] font-extrabold text-neutral-300 uppercase tracking-widest pl-1">PHONE NUMBER</label>
                        <input
                            type="tel"
                            placeholder="Enter a Phone number"
                            value={data.phone}
                            onChange={(e) => updateData({ phone: e.target.value })}
                            className="h-[52px] w-full border border-neutral-200 rounded-lg px-4 text-[14px] text-[#0B1536] focus:border-[#1E78FF] focus:ring-1 focus:ring-[#1E78FF] outline-none placeholder:text-neutral-400 font-medium"
                        />
                        {errors.phone && <span className="text-red-500 text-xs pl-1">{errors.phone}</span>}
                    </div>

                    {/* Contact Preference */}
                    <div className="flex flex-col gap-2 col-span-full md:col-span-1">
                        <label className="text-[10px] font-extrabold text-neutral-300 uppercase tracking-widest pl-1">HOW DO WE CONTACT YOU</label>
                        <div className="flex gap-2">
                            {contactPreferences.map((pref) => (
                                <button
                                    key={pref.code}
                                    type="button"
                                    onClick={() => updateData({ contactPreference: pref.name, contactPreferenceCode: pref.code })}
                                    className={`flex-1 h-[52px] rounded-lg border text-[14px] font-bold transition-colors ${
                                        data.contactPreferenceCode === pref.code
                                            ? "border-[#1E78FF] text-[#1E78FF] bg-blue-50"
                                            : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                                    }`}
                                >
                                    {pref.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Password */}
                    {!isLoggedIn && (
                        <>
                            <div className="flex flex-col gap-2 col-span-full md:col-span-1">
                                <label className="text-[10px] font-extrabold text-neutral-300 uppercase tracking-widest pl-1">PASSWORD</label>
                                <input
                                    type="password"
                                    placeholder="Enter a Password"
                                    value={data.password}
                                    onChange={(e) => updateData({ password: e.target.value })}
                                    className="h-[52px] w-full border border-neutral-200 rounded-lg px-4 text-[14px] text-[#0B1536] focus:border-[#1E78FF] focus:ring-1 focus:ring-[#1E78FF] outline-none placeholder:text-neutral-400 font-medium"
                                />
                                {errors.password && <span className="text-red-500 text-xs pl-1">{errors.password}</span>}
                            </div>

                            {/* Confirm Password */}
                            <div className="flex flex-col gap-2 col-span-full md:col-span-1">
                                <label className="text-[10px] font-extrabold text-neutral-300 uppercase tracking-widest pl-1">CONFIRM PASSWORD</label>
                                <input
                                    type="password"
                                    placeholder="Enter a Password"
                                    value={data.confirmPassword}
                                    onChange={(e) => updateData({ confirmPassword: e.target.value })}
                                    className="h-[52px] w-full border border-neutral-200 rounded-lg px-4 text-[14px] text-[#0B1536] focus:border-[#1E78FF] focus:ring-1 focus:ring-[#1E78FF] outline-none placeholder:text-neutral-400 font-medium"
                                />
                                {errors.confirmPassword && <span className="text-red-500 text-xs pl-1">{errors.confirmPassword}</span>}
                            </div>
                        </>
                    )}
                </div>

                {/* Submit Error */}
                {submitError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                        {submitError}
                    </div>
                )}

                <div className="w-full flex justify-center hidden md:flex mt-8">
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="w-[180px] h-[48px] text-[15px]">
                        {isSubmitting ? "Processing..." : "Place order"}
                    </Button>
                </div>

                {/* Mobile Extra Banner */}
                <div className="md:hidden w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] mt-12 bg-[#D1D5DB] pt-12 max-h-[250px] overflow-hidden">
                    <div className="transform scale-90 origin-top -mt-8">
                        <CTABanner />
                    </div>
                </div>
            </div>

            {/* Right Column: Billing Summary (Desktop only) */}
            <div className="w-full md:w-[480px] hidden md:flex flex-col bg-slate-50 rounded-2xl p-8 sticky top-32 border border-neutral-100 shadow-sm">
                <h2 className="text-3xl font-bold text-[#0B1536] mb-10">Billing</h2>

                <div className="w-full bg-[#FCFCFD] p-8 rounded-xl border border-neutral-100 shadow-sm">
                    {/* Top Row Grid */}
                    <div className="grid grid-cols-3 divide-x divide-neutral-200 text-center mb-6">
                        <div className="text-[14px] text-neutral-500 font-medium px-2">{data.bedrooms || "---"}</div>
                        <div className="text-[14px] text-neutral-500 font-medium px-2">{data.bathrooms || "---"} Bathrooms</div>
                        <div className="text-[14px] text-neutral-500 font-medium px-2">{data.cleanType || "---"}</div>
                    </div>

                    <div className="w-full border-t border-neutral-100 mb-6" />

                    {/* Meta Info */}
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex gap-3 text-[14px] font-bold">
                            <span className="text-[#0B1536]">{data.frequency || "---"}</span>
                            {data.date && (
                                <span className="text-[#1E78FF] font-medium">
                                    {new Date(data.date + "T12:00:00").toLocaleDateString("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                    {data.time ? ` at ${data.time}` : ""}
                                </span>
                            )}
                        </div>
                        <div className="text-[14px] font-bold text-[#0B1536]">
                            {data.address || "---"}
                        </div>
                        {data.extras.length > 0 && (
                            <div className="text-[14px] font-bold text-[#0B1536]">
                                Add-on: {data.extras.length} selected
                            </div>
                        )}
                    </div>

                    {/* Breakdown */}
                    <div className="flex flex-col gap-3 mb-6 border-b border-neutral-100 pb-6">
                        <div className="flex justify-between text-[14px] font-bold">
                            <span className="text-[#0B1536]">Total</span>
                            <span className="text-[#0B1536]">${data.subTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mb-6">
                        <div className="flex justify-between text-[16px] font-bold text-[#0B1536]">
                            <span>Subtotal</span>
                            <span>${data.subTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="w-full flex justify-center">
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-[180px] h-[48px] text-[15px]">
                            {isSubmitting ? "Processing..." : "Place order"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
