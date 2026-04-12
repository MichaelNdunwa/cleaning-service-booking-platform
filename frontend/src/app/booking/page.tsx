"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [data, setData] = useState<BookingState>(initialState);

    const updateData = (updates: Partial<BookingState>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    const nextStep = () => setStep((s) => Math.min(s + 1, 5));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

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
                {step === 1 && <RequirementsStep data={data} updateData={updateData} onNext={nextStep} />}
                {step === 2 && <DateStep data={data} updateData={updateData} onNext={nextStep} />}
                {step === 3 && <TimeStep data={data} updateData={updateData} onNext={nextStep} />}
                {step === 4 && <DetailsStep data={data} updateData={updateData} onNext={nextStep} />}
                {step === 5 && <PaymentStep data={data} updateData={updateData} onNext={() => router.push('/login')} />}
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
                    onClick={step === 5 ? () => router.push('/login') : nextStep}
                    className="w-[60%] bg-[#1E78FF] text-white text-[15px] font-bold flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                    {step === 5 ? 'Place order' : 'Next'}
                </button>
            </div>
        </div>
    );
}
