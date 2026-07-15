"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BookingHeader from "@/components/booking/BookingHeader";
import RequirementsStep from "@/components/booking/steps/RequirementsStep";
import DateStep from "@/components/booking/steps/DateStep";
import TimeStep from "@/components/booking/steps/TimeStep";
import DetailsStep from "@/components/booking/steps/DetailsStep";
import PaymentStep from "@/components/booking/steps/PaymentStep";
import { getServices, getAddons, createBooking, signup, login } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { ServiceType, Addon } from "@/lib/types";

export interface BookingState {
    bedrooms: string | number;
    bathrooms: string | number;
    cleanType: string;
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
    subTotal: number;
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    contactPreference: string;
}

const initialState: BookingState = {
    bedrooms: "",
    bathrooms: "",
    cleanType: "",
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
    subTotal: 0,
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    contactPreference: "Text",
};

function getServiceTypeByBedrooms(bedrooms: string | number, services: ServiceType[]): ServiceType | undefined {
    const codeMap: Record<string, string> = {
        "Studio": "studio",
        "1": "1bed",
        "2": "2bed",
        "3": "3bed",
        "4": "4bed",
        "5": "4bed",
    };
    const code = codeMap[String(bedrooms)];
    if (!code) return undefined;
    return services.find((s) => s.code === code);
}

export default function BookingPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [data, setData] = useState<BookingState>(initialState);
    const [services, setServices] = useState<ServiceType[]>([]);
    const [addons, setAddons] = useState<Addon[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        getServices()
            .then((res) => setServices(res.services))
            .catch(() => {});
        getAddons()
            .then((res) => setAddons(res.addons))
            .catch(() => {});
    }, []);

    const updateData = useCallback((updates: Partial<BookingState>) => {
        setData((prev) => ({ ...prev, ...updates }));
    }, []);

    const computeSubTotal = useCallback((): number => {
        const svc = getServiceTypeByBedrooms(data.bedrooms, services);
        const basePrice = svc?.base_price ?? 0;
        let addonTotal = 0;
        for (const idStr of data.extras) {
            const aid = parseInt(idStr, 10);
            const addon = addons.find((a) => a.id === aid);
            if (addon) addonTotal += addon.price;
        }
        return basePrice + addonTotal;
    }, [data.bedrooms, data.extras, services, addons]);

    useEffect(() => {
        const subTotal = computeSubTotal();
        setData((prev) => ({ ...prev, subTotal }));
    }, [computeSubTotal]);

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
            const svc = getServiceTypeByBedrooms(data.bedrooms, services);
            if (!svc) {
                throw new Error("Could not determine service type. Please check your selections.");
            }

            const frequencyMap: Record<string, string> = {
                "Onetime": "one_time",
                "Weekly": "weekly",
                "Every 2 weeks": "fortnightly",
                "Every 4 Weeks": "monthly",
            };
            const freq = frequencyMap[data.frequency] || "one_time";

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
                service_type_id: svc.id,
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
                <BookingHeader step={step} data={data} />
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
                {step === 1 && (
                    <RequirementsStep
                        data={data}
                        updateData={updateData}
                        onNext={nextStep}
                        services={services}
                        addons={addons}
                    />
                )}
                {step === 2 && <DateStep data={data} updateData={updateData} onNext={nextStep} />}
                {step === 3 && <TimeStep data={data} updateData={updateData} onNext={nextStep} />}
                {step === 4 && (
                    <DetailsStep
                        data={data}
                        updateData={updateData}
                        onNext={nextStep}
                        addons={addons}
                    />
                )}
                {step === 5 && (
                    <PaymentStep
                        data={data}
                        updateData={updateData}
                        onNext={handlePlaceOrder}
                        isSubmitting={isSubmitting}
                        submitError={submitError}
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
