"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BookingHeader from "@/components/booking/BookingHeader";
import RequirementsStep from "@/components/booking/steps/RequirementsStep";
import DateStep from "@/components/booking/steps/DateStep";
import TimeStep from "@/components/booking/steps/TimeStep";
import DetailsStep from "@/components/booking/steps/DetailsStep";
import PaymentStep from "@/components/booking/steps/PaymentStep";
import { getCatalog, createBooking, signup, login } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { CatalogResponse, PricingPlan } from "@/lib/types";

export interface BookingState {
    bedrooms: string | number;
    bathrooms: string | number;
    cleanType: string;
    cleanLevelId: number | null;
    pricingId: number | null;
    date: string;
    time: string;
    timeSlotId: number | null;
    address: string;
    aptNumber: string;
    entryMethod: string;
    extras: string[];
    hasPets: boolean;
    petDetails: string;
    notes: string;
    frequency: string;
    frequencyCode: string;
    subTotal: number;
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    contactPreference: string;
    contactPreferenceCode: string;
}

const initialState: BookingState = {
    bedrooms: "",
    bathrooms: "",
    cleanType: "",
    cleanLevelId: null,
    pricingId: null,
    date: "",
    time: "",
    timeSlotId: null,
    address: "",
    aptNumber: "",
    entryMethod: "",
    extras: [],
    hasPets: false,
    petDetails: "",
    notes: "",
    frequency: "",
    frequencyCode: "one_time",
    subTotal: 0,
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    contactPreference: "Text",
    contactPreferenceCode: "text",
};

function getPricingByBedrooms(bedrooms: string | number, pricing: PricingPlan[]): PricingPlan | undefined {
    const bedNum = String(bedrooms) === "Studio" ? 0 : parseInt(String(bedrooms), 10);
    if (isNaN(bedNum)) return undefined;
    return pricing.find((p) => p.pricing_type === "bedroom" && p.bedrooms === bedNum);
}

function BookingWizard() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [data, setData] = useState<BookingState>(() => ({
        ...initialState,
        bedrooms: searchParams.get("bedrooms") || "",
        bathrooms: searchParams.get("bathrooms") || "",
        cleanType: searchParams.get("cleanType") || "",
    }));
    const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        getCatalog()
            .then((res) => setCatalog(res))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!catalog || !data.cleanType || data.cleanLevelId) return;
        const matched = catalog.levels.find(
            (l) => (l.code || l.name) === data.cleanType
        );
        if (matched) {
            setData((prev) => ({ ...prev, cleanLevelId: matched.id }));
        }
    }, [catalog, data.cleanType, data.cleanLevelId]);

    const updateData = useCallback((updates: Partial<BookingState>) => {
        setData((prev) => ({ ...prev, ...updates }));
    }, []);

    const computeSubTotal = useCallback((): number => {
        if (!catalog) return 0;
        const plan = getPricingByBedrooms(data.bedrooms, catalog.pricing);
        const basePrice = plan?.base_price ?? 0;

        const cleanLevel = data.cleanLevelId
            ? catalog.levels.find((l) => l.id === data.cleanLevelId)
            : null;
        const cleanSurcharge = cleanLevel?.base_price ?? 0;

        let addonTotal = 0;
        for (const idStr of data.extras) {
            const aid = parseInt(idStr, 10);
            const addon = catalog.addons.find((a) => a.id === aid);
            if (addon) addonTotal += addon.price;
        }

        const bathOpt = catalog.bathroom_options.find((b) => b.value === parseInt(String(data.bathrooms), 10));
        const bathSurcharge = bathOpt?.surcharge ?? 0;

        const subtotal = basePrice + cleanSurcharge + addonTotal + bathSurcharge;

        const freqRec = catalog.frequencies.find((f) => f.code === data.frequencyCode);
        const discountPct = freqRec?.discount_pct ?? 0;
        const discount = Math.round(subtotal * (discountPct / 100) * 100) / 100;

        return subtotal - discount;
    }, [data.bedrooms, data.extras, data.cleanLevelId, data.bathrooms, data.frequencyCode, catalog]);

    useEffect(() => {
        if (!catalog) return;
        const subTotal = computeSubTotal();
        setData((prev) => {
            const plan = getPricingByBedrooms(prev.bedrooms, catalog.pricing);
            return { ...prev, subTotal, pricingId: plan?.id ?? null };
        });
    }, [computeSubTotal, catalog]);

    const nextStep = () => {
        setSubmitError(null);
        setStep((s) => Math.min(s + 1, 5));
    };
    const prevStep = () => {
        setSubmitError(null);
        setStep((s) => Math.max(s - 1, 1));
    };

    const handlePlaceOrder = async () => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            if (!catalog) {
                throw new Error("Catalog not loaded. Please refresh the page.");
            }

            const plan = getPricingByBedrooms(data.bedrooms, catalog.pricing);
            if (!plan) {
                throw new Error("Could not determine pricing. Please check your bedroom selection.");
            }

            const freq = data.frequencyCode || "one_time";

            const city = data.address.split(",").length > 1
                ? data.address.split(",").slice(-1)[0].trim()
                : "";
            const postcode = "";

            let addonIds: number[] = data.extras
                .map((s) => parseInt(s, 10))
                .filter((id) => !isNaN(id));

            addonIds = [...new Set(addonIds)];

            const fullName = data.fullName.trim();
            const email = data.email.trim().toLowerCase();
            const password = data.password;

            if (!fullName || !email) {
                throw new Error("Please fill in your name and email.");
            }

            if (!user) {
                if (!password) {
                    throw new Error("Please fill in your password.");
                }
                const signupRes = await signup({ name: fullName, email, password });
                if (!signupRes.success) {
                    throw new Error(signupRes.error || "Signup failed.");
                }
                await login({ email, password });
            }

            const bookingPayload = {
                customer: {
                    name: fullName,
                    email,
                    phone: data.phone || undefined,
                },
                pricing_id: plan.id,
                clean_level_id: data.cleanLevelId || undefined,
                booking_date: data.date,
                time_slot_id: data.timeSlotId!,
                frequency: freq as "one_time" | "weekly" | "fortnightly" | "monthly",
                addon_ids: addonIds.length > 0 ? addonIds : undefined,
                address_line_1: data.address,
                address_line_2: data.aptNumber || undefined,
                city,
                postcode,
                access_instructions: data.entryMethod || undefined,
                bedrooms: parseInt(String(data.bedrooms), 10) || 1,
                bathrooms: parseInt(String(data.bathrooms), 10) || 1,
                notes: [data.notes, data.hasPets ? `Pets: ${data.petDetails}` : ""]
                    .filter(Boolean)
                    .join("\n") || undefined,
            };

            const bookingRes = await createBooking(bookingPayload);
            const bookingId = bookingRes.booking.id;
            router.push(`/booking/confirmation?id=${bookingId}`);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
            setSubmitError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white pt-[88px] relative">
            <div className="hidden md:block">
                <BookingHeader step={step} data={data} catalog={catalog} />
            </div>

            {/* Mobile Header Override */}
            <header className="md:hidden fixed top-0 w-full h-16 bg-white z-50 flex items-center justify-between px-6 border-b border-neutral-100 shadow-sm">
                <div className="flex-1 flex justify-start">
                    {step > 1 && (
                        <button onClick={prevStep} className="text-neutral-500 p-2 -ml-2 flex items-center gap-1 hover:text-[#0B1536]">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-sm font-semibold">Back</span>
                        </button>
                    )}
                </div>
                <Link href="/" className="text-neutral-400 hover:text-neutral-600 p-2 -mr-2 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </Link>
            </header>

            {/* Side Navigation Buttons */}
            {step > 1 && (
                <button
                    onClick={prevStep}
                    className="fixed left-6 top-[calc(50%+44px)] -translate-y-1/2 w-12 h-12 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-neutral-400 hover:text-[#1E78FF] hover:border-[#1E78FF] shadow-sm hover:shadow-md transition-all z-40 hidden md:flex"
                >
                    <svg className="w-5 h-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {step < 5 && (
                <button
                    onClick={nextStep}
                    className="fixed right-6 top-[calc(50%+44px)] -translate-y-1/2 w-12 h-12 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-neutral-400 hover:text-[#1E78FF] hover:border-[#1E78FF] shadow-sm hover:shadow-md transition-all z-40 hidden md:flex"
                >
                    <svg className="w-5 h-5 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            <main className="flex-1 w-full mx-auto px-6 py-6 md:py-16 mt-16 md:mt-0 flex flex-col items-center pb-[120px] md:pb-32">
                {step === 1 && catalog && (
                    <RequirementsStep
                        data={data}
                        updateData={updateData}
                        onNext={nextStep}
                        catalog={catalog}
                    />
                )}
                {step === 2 && <DateStep data={data} updateData={updateData} onNext={nextStep} />}
                {step === 3 && <TimeStep data={data} updateData={updateData} onNext={nextStep} />}
                {step === 4 && catalog && (
                    <DetailsStep
                        data={data}
                        updateData={updateData}
                        onNext={nextStep}
                        catalog={catalog}
                    />
                )}
                {step === 5 && (
                    <PaymentStep
                        data={data}
                        updateData={updateData}
                        onNext={handlePlaceOrder}
                        isSubmitting={isSubmitting}
                        submitError={submitError}
                        catalog={catalog}
                    />
                )}
            </main>

            {/* Mobile Sticky Footer */}
            <div className="md:hidden fixed bottom-0 left-0 w-full h-[88px] flex z-50">
                <div className="w-[40%] bg-[#2A303C] flex flex-col items-center justify-center p-4">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                        SUB TOTAL
                    </span>
                    <div className="text-white text-2xl font-bold flex items-start leading-none">
                        <span className="text-sm font-bold mt-0.5 mr-0.5">$</span>
                        {data.subTotal.toFixed(0)}
                    </div>
                </div>
                <button
                    onClick={step === 5 ? handlePlaceOrder : nextStep}
                    disabled={isSubmitting}
                    className="w-[60%] bg-[#1E78FF] text-white text-[15px] font-bold flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? "Processing..." : step === 5 ? "Place order" : "Next"}
                </button>
            </div>
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense>
            <BookingWizard />
        </Suspense>
    );
}
