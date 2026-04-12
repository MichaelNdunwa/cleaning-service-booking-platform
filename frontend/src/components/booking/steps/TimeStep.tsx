"use client";

import { BookingState } from "@/app/booking/page";
import Button from "@/components/ui/Button";

interface Props {
    data: BookingState;
    updateData: (updates: Partial<BookingState>) => void;
    onNext: () => void;
}

export default function TimeStep({ data, updateData, onNext }: Props) {
    const dates = [22, 23, 24, 25, 26, 27, 28];
    const timeSlots = [
        { id: "flexible", label: "Flexible", subtitle: "Cleaner will arrive between 9am-4pm", discount: "Save $8.10 off" },
        { id: "08:00am", label: "08:00am" },
        { id: "08:30am", label: "08:30am" },
        { id: "09:00am", label: "09:00am" },
        { id: "09:30am", label: "09:30am" },
        { id: "10:00am", label: "10:00am" },
    ];

    const handleSelectTime = (time: string) => {
        updateData({ time });
    };

    return (
        <div className="w-full max-w-2xl flex flex-col items-start md:items-center animate-fade-in relative overflow-hidden">
            <h2 className="text-[28px] md:text-3xl font-bold text-[#0B1536] mb-2 leading-tight">Book Timing</h2>
            <p className="text-[#9CA3AF] text-[15px] mb-8 md:mb-12">Save even more by booking off-peak dates and times.</p>

            {/* Horizontal Date Ribbon */}
            <div className="flex items-center justify-between w-full mb-8 md:mb-10">
                <button className="hidden md:block text-neutral-400 hover:text-[#0B1536]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <div className="flex gap-3 overflow-x-auto pb-4 -mb-4 scrollbar-hide px-1 w-full md:w-auto md:justify-center">
                    {dates.map((d) => (
                        <div
                            key={d}
                            className={`
                                shrink-0 w-[84px] h-[46px] rounded-lg flex items-center justify-center font-bold text-sm cursor-pointer
                                transition-all duration-200
                                ${d === 24
                                    ? "border-2 border-[#1E78FF] text-[#1E78FF] shadow-[0_4px_14px_rgba(30,120,255,0.15)]"
                                    : "border border-neutral-200 text-[#0B1536] hover:border-neutral-300"
                                }
                            `}
                        >
                            {d}
                        </div>
                    ))}
                </div>
                <button className="hidden md:block text-neutral-400 hover:text-[#0B1536]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>

            {/* Time Slots Vertical */}
            <div className="w-full flex flex-col gap-3 px-1">
                {timeSlots.map((slot) => {
                    const isSelected = data.time === slot.id;
                    return (
                        <button
                            key={slot.id}
                            onClick={() => handleSelectTime(slot.id)}
                            className={`
                                w-full min-h-[64px] rounded-lg flex items-center justify-between px-6 transition-all duration-200
                                ${isSelected
                                    ? "border-2 border-[#1E78FF] shadow-[0_4px_14px_rgba(30,120,255,0.15)] bg-white"
                                    : "border border-neutral-200 bg-white hover:border-neutral-300"
                                }
                            `}
                        >
                            <div className="flex flex-col items-start w-full">
                                <div className="w-full flex items-center justify-center relative relative">
                                    <span className={`text-[15px] font-bold ${isSelected ? "text-[#1E78FF]" : "text-[#0B1536]"}`}>
                                        {slot.label}
                                    </span>
                                    {slot.discount && (
                                        <span className="absolute right-0 text-[11px] font-bold text-[#1E78FF]">
                                            {slot.discount}
                                        </span>
                                    )}
                                </div>
                                {slot.subtitle && (
                                    <span className="text-[12px] text-[#1E78FF] font-medium w-full text-left mt-0.5">
                                        {slot.subtitle}
                                    </span>
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>

        </div>
    );
}
