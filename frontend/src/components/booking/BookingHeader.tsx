"use client";

import Link from "next/link";
import { BookingState } from "@/app/booking/page";
import { TOTAL_STEPS } from "@/lib/constants";
import type { CatalogResponse } from "@/lib/types";

interface BookingHeaderProps {
    step: number;
    data: BookingState;
    catalog?: CatalogResponse | null;
}

export default function BookingHeader({ step, data, catalog }: BookingHeaderProps) {
    const progressWidth = `${(step / TOTAL_STEPS) * 100}%`;

    return (
        <header className="fixed top-0 left-0 right-0 h-[88px] bg-white shadow-sm z-50 flex">
            {/* Close Button */}
            <Link
                href="/"
                className="w-[88px] h-full flex items-center justify-center border-r border-neutral-100 hover:bg-neutral-50 transition-colors shrink-0"
            >
                <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </Link>

            {/* Info Sections */}
            <div className="flex-1 flex items-center relative">
                <div className="flex-1 grid grid-cols-4 h-full">
                    {/* Bedrooms & Bathrooms */}
                    <div className="flex items-center justify-center gap-8 border-r border-neutral-100 px-4">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zM3 10h18" />
                            </svg>
                            <div>
                                <div className="text-[15px] font-bold text-[#0B1536] leading-tight flex items-baseline gap-1">
                                    {data.bedrooms === "0" || data.bedrooms === 0 ? "Studio" : data.bedrooms}
                                </div>
                                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Bedrooms</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M5 14h14a2 2 0 012 2v2H3v-2a2 2 0 012-2zM7 10V6a2 2 0 012-2h6a2 2 0 012 2v4" />
                            </svg>
                            <div>
                                <div className="text-[15px] font-bold text-[#0B1536] leading-tight flex items-baseline gap-1">
                                    {data.bathrooms}
                                </div>
                                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Bathrooms</div>
                            </div>
                        </div>
                    </div>

                    {/* Clean Type */}
                    <div className="flex items-center justify-center gap-3 border-r border-neutral-100 px-4">
                        <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <div>
                            <div className="text-[15px] font-bold text-[#0B1536] leading-tight">
                                {data.cleanType
                                    ? catalog?.levels.find((l) => (l.code || l.name) === data.cleanType)?.name || data.cleanType
                                    : "Select"}
                            </div>
                            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Clean Type</div>
                        </div>
                    </div>

                    {/* Schedule Date */}
                    <div className="flex items-center justify-center gap-3 border-r border-neutral-100 px-4">
                        <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                            <div className="text-[15px] font-bold text-[#0B1536] leading-tight whitespace-nowrap">
                                {data.date ? new Date(data.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : "Select"}
                            </div>
                            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Schedule Date</div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-center justify-center gap-3 px-4">
                        <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="overflow-hidden">
                            <div className="text-[15px] font-bold text-[#0B1536] leading-tight truncate">
                                {data.address || "Select"}
                            </div>
                            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Address</div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 h-[3px] bg-neutral-100 w-full">
                    <div
                        className="h-full bg-[#1E78FF] transition-all duration-300 ease-in-out"
                        style={{ width: progressWidth }}
                    />
                </div>
            </div>

            {/* Subtotal */}
            <div className="w-[180px] bg-[#2A303C] flex items-center justify-center shrink-0">
                <div className="text-center text-white">
                    <div className="text-3xl font-bold leading-none mb-1 flex items-start justify-center">
                        <span className="text-base font-medium mt-0.5 opacity-80 mr-0.5">$</span>
                        {data.subTotal.toFixed(0)}
                    </div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-[#9CA3AF]">
                        Sub Total
                    </div>
                </div>
            </div>
        </header>
    );
}
