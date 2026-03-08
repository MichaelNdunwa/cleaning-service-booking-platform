"use client";

import { BookingState } from "@/app/booking/page";
import Button from "@/components/ui/Button";

interface Props {
    data: BookingState;
    updateData: (updates: Partial<BookingState>) => void;
    onNext: () => void;
}

export default function DateStep({ data, updateData, onNext }: Props) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // Mock 31 days mapping to the grid
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    // Convert current selected date to a day number for UI picking (naively based on mock date)
    const selectedDay = data.date ? parseInt(data.date.split("-")[2], 10) : 17;

    const handleSelectDay = (day: number) => {
        // Just mocking the month of April based on the image design
        updateData({ date: `2018-04-${day.toString().padStart(2, '0')}` });
    };

    return (
        <div className="w-full max-w-4xl flex flex-col items-center animate-fade-in">
            <h2 className="text-3xl font-bold text-[#0B1536] mb-2">Book Date</h2>
            <p className="text-[#9CA3AF] text-[15px] mb-12">Book a specific date you need your space sparkled</p>

            {/* Month Nav */}
            <div className="flex items-center justify-between w-full max-w-xl mb-10">
                <button className="text-neutral-300 hover:text-neutral-500 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <div className="flex items-center gap-16 text-xl">
                    <span className="text-neutral-400 font-medium">March</span>
                    <span className="text-[#0B1536] font-bold">April</span>
                    <span className="text-neutral-400 font-medium">May</span>
                </div>
                <button className="text-neutral-300 hover:text-neutral-500 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="w-full max-w-3xl mb-16">
                <div className="grid grid-cols-7 mb-4">
                    {daysOfWeek.map(day => (
                        <div key={day} className="text-center text-[10px] font-extrabold text-neutral-300 uppercase tracking-widest pb-3">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-3">
                    {days.map(day => {
                        const isSelected = day === selectedDay;
                        const isPast = day < 13; // random past dates

                        return (
                            <button
                                key={day}
                                onClick={() => handleSelectDay(day)}
                                className={`
                                    h-[60px] rounded-lg flex items-center justify-center text-[15px] transition-all
                                    ${isSelected
                                        ? "border-2 border-[#1E78FF] text-[#1E78FF] shadow-[0_4px_14px_rgba(30,120,255,0.15)] font-bold"
                                        : "border border-neutral-200 bg-white hover:border-neutral-300 font-medium"
                                    }
                                    ${isPast && !isSelected ? "text-neutral-300 pointer-events-none" : !isSelected ? "text-[#0B1536]" : ""}
                                `}
                            >
                                {day}
                            </button>
                        )
                    })}
                </div>
            </div>

            <Button onClick={onNext} className="w-[180px] h-[48px] text-[15px]">
                Next
            </Button>
        </div>
    );
}
