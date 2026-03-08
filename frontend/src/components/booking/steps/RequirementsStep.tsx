"use client";

import { BookingState } from "@/app/booking/page";
import Button from "@/components/ui/Button";

interface Props {
    data: BookingState;
    updateData: (updates: Partial<BookingState>) => void;
    onNext: () => void;
}

export default function RequirementsStep({ data, updateData, onNext }: Props) {
    const bedrooms = ["Studio", "1", "2", "3", "4", "5"];
    const bathrooms = ["1", "2", "3", "4", "5"];
    const cleanTypes = [
        { id: "Standard", label: "Standard", time: "2 hours" },
        { id: "Deep Clean", label: "Deep Clean", time: "2.5-3 hours" },
        { id: "Moving In/Out", label: "Moving In/Out", time: "4.5-5 hours" },
        { id: "Post Construction", label: "Post Construction", time: "4.5-5 hours" },
    ];

    const OptionButton = ({
        active,
        onClick,
        children,
        className = ""
    }: {
        active: boolean,
        onClick: () => void,
        children: React.ReactNode,
        className?: string
    }) => (
        <button
            type="button"
            onClick={onClick}
            className={`
                h-[46px] rounded-lg text-sm font-semibold transition-all duration-200 outline-none min-w-[64px] px-5
                ${active
                    ? "border-2 border-[#1E78FF] text-[#1E78FF] shadow-[0_4px_14px_rgba(30,120,255,0.15)]"
                    : "border border-neutral-200 text-[#0B1536] hover:border-neutral-300"
                }
                ${className}
            `}
        >
            {children}
        </button>
    );

    return (
        <div className="w-full max-w-3xl flex flex-col items-center animate-fade-in">
            <h2 className="text-3xl font-bold text-[#0B1536] mb-12">
                Customize Your Requirements
            </h2>

            {/* Bedrooms */}
            <div className="mb-10 flex flex-col items-center">
                <p className="text-[11px] font-extrabold text-neutral-300 uppercase tracking-widest mb-4">
                    Number of Bedrooms
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                    {bedrooms.map((bed) => (
                        <OptionButton
                            key={bed}
                            active={data.bedrooms.toString() === bed}
                            onClick={() => updateData({ bedrooms: bed })}
                            className={bed === "Studio" ? "min-w-[90px]" : ""}
                        >
                            {bed}
                        </OptionButton>
                    ))}
                </div>
            </div>

            {/* Bathrooms */}
            <div className="mb-14 flex flex-col items-center">
                <p className="text-[11px] font-extrabold text-neutral-300 uppercase tracking-widest mb-4">
                    Number of Bathrooms
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                    {bathrooms.map((bath) => (
                        <OptionButton
                            key={bath}
                            active={data.bathrooms.toString() === bath}
                            onClick={() => updateData({ bathrooms: bath })}
                        >
                            {bath}
                        </OptionButton>
                    ))}
                </div>
            </div>

            {/* Clean Type */}
            <div className="mb-16 flex flex-col items-center">
                <p className="text-[11px] font-extrabold text-neutral-300 uppercase tracking-widest mb-4">
                    Clean Type
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    {cleanTypes.map((type) => (
                        <div key={type.id} className="flex flex-col items-center gap-2">
                            <button
                                type="button"
                                onClick={() => updateData({ cleanType: type.id })}
                                className={`
                                    h-[52px] px-8 rounded-lg text-[15px] font-bold transition-all duration-200 outline-none
                                    ${data.cleanType === type.id
                                        ? "border-2 border-[#1E78FF] text-[#1E78FF] shadow-[0_4px_14px_rgba(30,120,255,0.15)]"
                                        : "border border-neutral-200 text-[#0B1536] hover:border-neutral-300"
                                    }
                                `}
                            >
                                {type.label}
                            </button>
                            <span className="text-[11px] font-bold text-neutral-400">{type.time}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Button onClick={onNext} className="w-[180px] h-[48px] text-[15px]">
                Next
            </Button>
        </div>
    );
}
