"use client";

import { BookingState } from "@/app/booking/page";
import Button from "@/components/ui/Button";

interface Props {
    data: BookingState;
    updateData: (updates: Partial<BookingState>) => void;
    onNext: () => void;
}

export default function DateStep({ data, updateData, onNext }: Props) {
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="w-full max-w-4xl flex flex-col items-start md:items-center animate-fade-in relative">
            <h2 className="text-[28px] md:text-3xl font-bold text-[#0B1536] mb-2 leading-tight">Book Date</h2>
            <p className="text-[#9CA3AF] text-[15px] mb-8 md:mb-12">Book a specific date you need your space sparkled</p>

            {/* Date Picker */}
            <div className="w-full max-w-md mb-8 md:mb-16">
                <label className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4 block">
                    SELECT DATE
                </label>
                <input
                    type="date"
                    value={data.date}
                    min={today}
                    onChange={(e) => {
                        updateData({ date: e.target.value, time: "", timeSlotId: null });
                    }}
                    className="h-[52px] w-full border border-neutral-200 rounded-lg px-4 text-[15px] text-[#0B1536] focus:border-[#1E78FF] focus:ring-1 focus:ring-[#1E78FF] outline-none bg-white"
                />
            </div>

            <div className="w-full flex justify-center hidden md:flex mt-4">
                <Button
                    onClick={onNext}
                    disabled={!data.date}
                    className="w-[180px] h-[48px] text-[15px]"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
