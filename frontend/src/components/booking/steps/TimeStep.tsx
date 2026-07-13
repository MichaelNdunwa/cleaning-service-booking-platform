"use client";

import { useState, useEffect } from "react";
import { BookingState } from "@/app/booking/page";
import Button from "@/components/ui/Button";
import { getAvailability } from "@/lib/api";
import type { TimeSlot } from "@/lib/types";

interface Props {
    data: BookingState;
    updateData: (updates: Partial<BookingState>) => void;
    onNext: () => void;
}

function formatHour(hour: number): string {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    const period = h >= 12 ? "pm" : "am";
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const displayM = m > 0 ? `:${m.toString().padStart(2, "0")}` : ":00";
    return `${displayH}${displayM}${period}`;
}

export default function TimeStep({ data, updateData, onNext }: Props) {
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!data.date) return;
        setLoading(true);
        getAvailability(data.date)
            .then((res) => {
                setSlots(res.slots);
                const stillAvailable = res.slots.find(
                    (s) => s.id === data.timeSlotId && s.available > 0
                );
                if (!stillAvailable) {
                    updateData({ time: "", timeSlotId: null });
                }
            })
            .catch(() => {
                setSlots([]);
            })
            .finally(() => setLoading(false));
    }, [data.date]);

    const handleSelectSlot = (slot: TimeSlot) => {
        const label = `${formatHour(slot.start_hour)} - ${formatHour(slot.end_hour)}`;
        updateData({ time: label, timeSlotId: slot.id });
    };

    const selectedDateDisplay = data.date
        ? new Date(data.date + "T12:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
          })
        : "";

    return (
        <div className="w-full max-w-2xl flex flex-col items-start md:items-center animate-fade-in relative overflow-hidden">
            <h2 className="text-[28px] md:text-3xl font-bold text-[#0B1536] mb-2 leading-tight">Book Timing</h2>
            <p className="text-[#9CA3AF] text-[15px] mb-8 md:mb-12">Save even more by booking off-peak dates and times.</p>

            {data.date && (
                <p className="text-sm font-semibold text-[#0B1536] mb-6">{selectedDateDisplay}</p>
            )}

            {/* Time Slots */}
            <div className="w-full flex flex-col gap-3 px-1">
                {loading && (
                    <div className="text-center text-neutral-400 py-8 text-sm font-medium">
                        Loading available times...
                    </div>
                )}

                {!loading && slots.length === 0 && data.date && (
                    <div className="text-center text-neutral-400 py-8 text-sm font-medium">
                        No time slots available for this date. Please select another date.
                    </div>
                )}

                {!loading &&
                    slots.map((slot) => {
                        const isSelected = data.timeSlotId === slot.id;
                        const isUnavailable = slot.available <= 0;
                        const timeLabel = `${formatHour(slot.start_hour)} - ${formatHour(slot.end_hour)}`;
                        return (
                            <button
                                key={slot.id}
                                onClick={() => !isUnavailable && handleSelectSlot(slot)}
                                disabled={isUnavailable}
                                className={`
                                    w-full min-h-[64px] rounded-lg flex items-center justify-between px-6 transition-all duration-200
                                    ${isSelected
                                        ? "border-2 border-[#1E78FF] shadow-[0_4px_14px_rgba(30,120,255,0.15)] bg-white"
                                        : isUnavailable
                                            ? "border border-neutral-100 bg-neutral-50 text-neutral-300 cursor-not-allowed"
                                            : "border border-neutral-200 bg-white hover:border-neutral-300"
                                    }
                                `}
                            >
                                <div className="flex flex-col items-start w-full">
                                    <div className="w-full flex items-center justify-between">
                                        <span
                                            className={`text-[15px] font-bold ${
                                                isSelected
                                                    ? "text-[#1E78FF]"
                                                    : isUnavailable
                                                        ? "text-neutral-300"
                                                        : "text-[#0B1536]"
                                            }`}
                                        >
                                            {slot.name}
                                        </span>
                                        <span
                                            className={`text-[13px] font-medium ${
                                                isUnavailable ? "text-neutral-300" : "text-neutral-400"
                                            }`}
                                        >
                                            {timeLabel}
                                        </span>
                                    </div>
                                    {!isUnavailable && (
                                        <span className="text-[12px] text-neutral-400 font-medium w-full text-left mt-0.5">
                                            {slot.available} spot{slot.available !== 1 ? "s" : ""} left
                                        </span>
                                    )}
                                    {isUnavailable && (
                                        <span className="text-[12px] text-neutral-300 font-medium w-full text-left mt-0.5">
                                            Fully booked
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
            </div>

            <div className="w-full flex justify-center hidden md:flex mt-8">
                <Button
                    onClick={onNext}
                    disabled={!data.timeSlotId}
                    className="w-[180px] h-[48px] text-[15px]"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
