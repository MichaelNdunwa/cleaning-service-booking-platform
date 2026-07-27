"use client";

import { BookingState } from "@/app/booking/page";
import Button from "@/components/ui/Button";
import type { CatalogResponse } from "@/lib/types";

interface Props {
    data: BookingState;
    updateData: (updates: Partial<BookingState>) => void;
    onNext: () => void;
    catalog: CatalogResponse;
}

export default function RequirementsStep({ data, updateData, onNext, catalog }: Props) {
    const bedroomOptions = catalog.pricing
        .filter((p) => p.pricing_type === "bedroom" && p.bedrooms !== null)
        .sort((a, b) => (a.bedrooms ?? 0) - (b.bedrooms ?? 0))
        .map((p) => ({
            id: p.id,
            label: String(p.bedrooms),
            value: String(p.bedrooms),
        }));

    const bathroomOptions = catalog.bathroom_options
        .sort((a, b) => a.value - b.value)
        .map((b) => ({
            label: String(b.value),
            value: String(b.value),
        }));

    const cleanTypes = catalog.levels
        .sort((a, b) => a.base_price - b.base_price)
        .map((l) => ({
            id: l.code || l.name,
            label: l.name,
            time: l.base_price <= 20 ? "2 hours" : l.base_price <= 40 ? "2.5-3 hours" : "4.5-5 hours",
        }));

    const handleCleanType = (typeId: string) => {
        const matchedLevel = catalog.levels.find((l) => (l.code || l.name) === typeId);
        updateData({
            cleanType: typeId,
            cleanLevelId: matchedLevel?.id ?? null,
        });
    };

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
        <div className="w-full max-w-3xl flex flex-col items-start md:items-center animate-fade-in">
            <h2 className="text-[28px] md:text-3xl font-bold text-[#0B1536] mb-8 md:mb-12 leading-tight">
                Customize Your Requirements
            </h2>

            {/* Bedrooms */}
            <div className="mb-8 md:mb-10 flex flex-col items-start md:items-center w-full">
                <p className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">
                    NUMBER OF BEDROOMS
                </p>
                <div className="flex flex-wrap justify-start md:justify-center gap-3 w-full">
                    {bedroomOptions.map((opt) => (
                        <OptionButton
                            key={opt.id ?? opt.value}
                            active={data.bedrooms.toString() === opt.value}
                            onClick={() => updateData({ bedrooms: opt.value })}
                            className="min-w-[64px]"
                        >
                            {opt.label}
                        </OptionButton>
                    ))}
                </div>
            </div>

            {/* Bathrooms */}
            <div className="mb-10 md:mb-14 flex flex-col items-start md:items-center w-full">
                <p className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">
                    NUMBER OF BATHROOMS
                </p>
                <div className="flex flex-wrap justify-start md:justify-center gap-3 w-full">
                    {bathroomOptions.map((opt) => (
                        <OptionButton
                            key={opt.value}
                            active={data.bathrooms.toString() === opt.value}
                            onClick={() => updateData({ bathrooms: opt.value })}
                            className="min-w-[64px]"
                        >
                            {opt.label}
                        </OptionButton>
                    ))}
                </div>
            </div>

            {/* Clean Type */}
            <div className="mb-12 md:mb-16 flex flex-col items-start md:items-center w-full">
                <p className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">
                    CLEAN TYPE
                </p>
                <div className="flex flex-wrap justify-start md:justify-center gap-4 w-full">
                    {cleanTypes.map((type) => (
                        <div key={type.id} className="flex flex-col items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleCleanType(type.id)}
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

            <div className="w-full flex justify-center hidden md:flex mt-4">
                <Button onClick={onNext} className="w-[180px] h-[48px] text-[15px]">
                    Next
                </Button>
            </div>
        </div>
    );
}
