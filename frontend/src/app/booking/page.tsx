"use client";

import { useState } from "react";
import BookingHeader from "@/components/booking/BookingHeader";
import RequirementsStep from "@/components/booking/steps/RequirementsStep";
import DateStep from "@/components/booking/steps/DateStep";
import TimeStep from "@/components/booking/steps/TimeStep";
import DetailsStep from "@/components/booking/steps/DetailsStep";
import PaymentStep from "@/components/booking/steps/PaymentStep";

export interface BookingState {
    bedrooms: string | number;
    bathrooms: string | number;
    cleanType: string;
    date: string;
    time: string;
    address: string;
    aptNumber: string;
    entryMethod: string;
    extras: string[];
    hasPets: boolean;
    petDetails: string;
    notes: string;
    frequency: string;
    subTotal: number;
}

const initialState: BookingState = {
    bedrooms: "",
    bathrooms: "",
    cleanType: "",
    date: "",
    time: "",
    address: "",
    aptNumber: "",
    entryMethod: "",
    extras: [],
    hasPets: false,
    petDetails: "",
    notes: "",
    frequency: "",
    subTotal: 0,
};

export default function BookingPage() {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<BookingState>(initialState);

    const updateData = (updates: Partial<BookingState>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    const nextStep = () => setStep((s) => Math.min(s + 1, 5));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    return (
        <div className="flex flex-col min-h-screen bg-white pt-[88px] relative">
            <BookingHeader step={step} data={data} />

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

            <main className="flex-1 w-full mx-auto px-6 py-16 flex flex-col items-center pb-32">
                {step === 1 && <RequirementsStep data={data} updateData={updateData} onNext={nextStep} />}
                {step === 2 && <DateStep data={data} updateData={updateData} onNext={nextStep} />}
                {step === 3 && <TimeStep data={data} updateData={updateData} onNext={nextStep} />}
                {step === 4 && <DetailsStep data={data} updateData={updateData} onNext={nextStep} />}
                {step === 5 && <PaymentStep data={data} updateData={updateData} onNext={() => alert('Order Placed!')} />}
            </main>
        </div>
    );
}
