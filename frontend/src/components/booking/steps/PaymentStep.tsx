"use client";

import { BookingState } from "@/app/booking/page";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/ui/CTABanner";

interface Props {
    data: BookingState;
    updateData: (updates: Partial<BookingState>) => void;
    onNext: () => void;
}

export default function PaymentStep({ data, updateData, onNext }: Props) {
    const InputField = ({ label, placeholder, className = "col-span-1" }: { label: string, placeholder: string, className?: string }) => (
        <div className={`flex flex-col gap-2 ${className}`}>
            <label className="text-[10px] font-extrabold text-neutral-300 uppercase tracking-widest pl-1">{label}</label>
            <input
                type="text"
                placeholder={placeholder}
                className="h-[52px] w-full border border-neutral-200 rounded-lg px-4 text-[14px] text-[#0B1536] focus:border-[#1E78FF] focus:ring-1 focus:ring-[#1E78FF] outline-none placeholder:text-neutral-400 font-medium"
            />
        </div>
    );

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
                    <InputField label="FULL NAME" placeholder="Enter Full name" className="col-span-full md:col-span-1" />
                    <InputField label="EMAIL ADDRESS" placeholder="Enter a address" className="col-span-full md:col-span-1" />

                    <InputField label="PHONE NUMBER" placeholder="Enter a Phone number" className="col-span-full md:col-span-1" />
                    <div className="flex flex-col gap-2 col-span-full md:col-span-1">
                        <label className="text-[10px] font-extrabold text-neutral-300 uppercase tracking-widest pl-1">HOW DO WE CONTACT YOU</label>
                        <div className="flex gap-2">
                            {["Text", "Call", "Email"].map(pref => (
                                <button key={pref} type="button" className={`flex-1 h-[52px] rounded-lg border border-neutral-200 text-neutral-600 font-bold text-[14px] hover:border-neutral-300 transition-colors`}>
                                    {pref}
                                </button>
                            ))}
                        </div>
                    </div>

                    <InputField label="PASSWORD" placeholder="Enter a Password" className="col-span-full md:col-span-1" />
                    <InputField label="CONFIRM PASSWORD" placeholder="Enter a Password" className="col-span-full md:col-span-1" />
                </div>

                <div className="w-full flex justify-center hidden md:flex mt-8">
                    <Button onClick={onNext} className="w-[180px] h-[48px] text-[15px]">
                        Review Order
                    </Button>
                </div>

                {/* Mobile Extra Banner Insertion directly beneath form before sticky footer */}
                <div className="md:hidden w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] mt-12 bg-[#D1D5DB] pt-12 max-h-[250px] overflow-hidden">
                    {/* The CTABanner takes care of its own styling, but we wrap it to full bleed out of main container on mobile */}
                    <div className="transform scale-90 origin-top -mt-8">
                        <CTABanner />
                    </div>
                </div>
            </div>

            {/* Right Column: Billing Summary (Hidden exactly on mobile flow to match reference) */}
            <div className="w-full md:w-[480px] hidden md:flex flex-col bg-slate-50 rounded-2xl p-8 sticky top-32 border border-neutral-100 shadow-sm">
                <h2 className="text-3xl font-bold text-[#0B1536] mb-10">Billing</h2>

                <div className="w-full bg-[#FCFCFD] p-8 rounded-xl border border-neutral-100 shadow-sm">
                    {/* Top Row Grid */}
                    <div className="grid grid-cols-3 divide-x divide-neutral-200 text-center mb-6">
                        <div className="text-[14px] text-neutral-500 font-medium px-2">{data.bedrooms}</div>
                        <div className="text-[14px] text-neutral-500 font-medium px-2">{data.bathrooms} Bathrooms</div>
                        <div className="text-[14px] text-neutral-500 font-medium px-2">{data.cleanType}</div>
                    </div>

                    <div className="w-full border-t border-neutral-100 mb-6" />

                    {/* Meta Info */}
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex gap-3 text-[14px] font-bold">
                            <span className="text-[#0B1536]">{data.frequency}</span>
                            <span className="text-[#1E78FF] font-medium">Tuesday, July17, 2018 at 2.30pm</span>
                        </div>
                        <div className="text-[14px] font-bold text-[#0B1536]">
                            {data.address || "114 Broadway Newyork, NY 10005"}
                        </div>
                        {data.extras.length > 0 && (
                            <div className="text-[14px] font-bold text-[#0B1536]">
                                Add-on: {data.extras.join(", ")}
                            </div>
                        )}
                    </div>

                    {/* Promo */}
                    <div className="flex gap-3 mb-8">
                        <input type="text" placeholder="Discount" className="h-[46px] flex-1 border border-neutral-200 rounded-lg px-4 text-[14px] placeholder:text-neutral-400 focus:outline-none focus:border-[#1E78FF]" />
                        <Button className="h-[46px] w-[90px] text-[14px]">Apply</Button>
                    </div>

                    {/* Breakdown */}
                    <div className="flex flex-col gap-3 mb-6 border-b border-neutral-100 pb-6">
                        <div className="flex justify-between text-[14px] font-bold">
                            <div><span className="text-[#0B1536]">Appointment Value</span> <span className="text-[#1E78FF] text-[12px] font-medium ml-1 cursor-pointer">- Details</span></div>
                            <span className="text-[#0B1536]">$ 125.99</span>
                        </div>
                        <div className="flex justify-between text-[14px] font-bold">
                            <div><span className="text-[#0B1536]">Discounts</span> <span className="text-[#1E78FF] text-[12px] font-medium ml-1 cursor-pointer">- Details</span></div>
                            <span className="text-[#0B1536]">-$ 15.89</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mb-6">
                        <div className="flex justify-between text-[14px] font-medium text-neutral-400">
                            <span>Subtotal</span>
                            <span className="text-[#0B1536] font-bold">$ 110.01</span>
                        </div>
                        <div className="flex justify-between text-[14px] font-medium text-neutral-400">
                            <span>Tax</span>
                            <span className="text-[#0B1536] font-bold">+$ 5.20</span>
                        </div>
                    </div>

                    <div className="flex justify-between text-[16px] font-bold text-[#0B1536] mb-8">
                        <span>Total</span>
                        <span>${data.subTotal.toFixed(2)}</span>
                    </div>

                    <div className="w-full flex justify-center">
                        <Button onClick={onNext} className="w-[180px] h-[48px] text-[15px]">
                            Place order
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
