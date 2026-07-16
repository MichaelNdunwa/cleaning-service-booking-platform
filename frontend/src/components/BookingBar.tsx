"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";
import { getServices } from "@/lib/api";
import type { ServiceType } from "@/lib/types";

type Option = { label: string; value: string };

const BATH_OPTIONS: Option[] = [
    { label: "1 Bathroom", value: "1" },
    { label: "2 Bathrooms", value: "2" },
    { label: "3 Bathrooms", value: "3" },
    { label: "4+ Bathrooms", value: "4" },
];

export default function BookingBar({ className }: { className?: string }) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [services, setServices] = useState<ServiceType[]>([]);

    const [bed, setBed] = useState("");
    const [bath, setBath] = useState("");
    const [standard, setStandard] = useState("");

    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getServices()
            .then((res) => setServices(res.services))
            .catch(() => {});
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (barRef.current && !barRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const bedOptions: Option[] = services
        .filter((s) => s.category === "property" && s.bedrooms !== null)
        .sort((a, b) => (a.bedrooms ?? 0) - (b.bedrooms ?? 0))
        .map((s) => ({
            label: s.bedrooms === 0 ? "Studio" : `${s.bedrooms}+ Bedroom${(s.bedrooms ?? 0) > 1 ? "s" : ""}`,
            value: String(s.bedrooms),
        }));

    const cleanOptions: Option[] = [
        { label: "Standard", value: "Standard" },
        ...services
            .filter((s) => s.category === "clean_level")
            .sort((a, b) => a.base_price - b.base_price)
            .map((s) => ({ label: s.name, value: s.name })),
    ];

    const minPrice = services
        .filter((s) => s.category === "property")
        .reduce((min, s) => Math.min(min, s.base_price), Infinity);

    const Dropdown = ({ id, value, placeholder, options, setter, isFirst }: {
        id: string;
        value: string;
        placeholder: string;
        options: Option[];
        setter: (val: string) => void;
        isFirst?: boolean;
    }) => {
        const isOpen = openDropdown === id;
        const selected = options.find((o) => o.value === value);

        return (
            <div
                className={clsx(
                    "flex-1 relative",
                    !isOpen && id !== "standard" && "border-b sm:border-b-0 sm:border-r border-neutral-100"
                )}
            >
                <button
                    type="button"
                    onClick={() => setOpenDropdown(isOpen ? null : id)}
                    className={clsx(
                        "w-full px-5 md:px-2 lg:px-5 py-[18px] text-[15px] outline-none flex items-center justify-between transition-all duration-200 z-10",
                        isOpen
                            ? "ring-2 ring-inset ring-brand-accent shadow-md rounded-[10px] relative z-20 bg-white"
                            : "text-neutral-600 bg-transparent hover:bg-neutral-50/50",
                        isFirst && !isOpen && "rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none",
                        value ? "font-medium text-neutral-900" : "text-neutral-400"
                    )}
                >
                    <span className="whitespace-nowrap">{selected?.label || placeholder}</span>
                    <svg
                        className={clsx("w-[18px] h-[18px] transition-transform duration-200 text-neutral-400", isOpen && "rotate-180")}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] bg-white rounded-[12px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-neutral-100 py-2 z-50 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    setter(opt.value);
                                    setOpenDropdown(null);
                                }}
                                className={clsx(
                                    "w-full text-left px-5 py-3 text-[15px] transition-colors duration-150",
                                    value === opt.value
                                        ? "bg-[#F4F8FF] text-brand-accent font-semibold"
                                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const buildBookingUrl = () => {
        const params = new URLSearchParams();
        if (bed) params.set("bedrooms", bed);
        if (bath) params.set("bathrooms", bath);
        if (standard) params.set("cleanType", standard);
        const qs = params.toString();
        return `/booking${qs ? `?${qs}` : ""}`;
    };

    const priceText = minPrice < Infinity ? `Booking from $${minPrice}` : "Book Now";

    return (
        <div className={`max-w-4xl mx-auto relative z-[100] ${className || ""}`} ref={barRef}>
            {/* Desktop & Tablet View */}
            <div className="hidden md:flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-neutral-100 relative z-[100]">

                <Dropdown id="bed" value={bed} placeholder="Select Bedrooms" options={bedOptions} setter={setBed} isFirst={true} />

                <Dropdown id="bath" value={bath} placeholder="Select Bathrooms" options={BATH_OPTIONS} setter={setBath} />

                <Dropdown id="standard" value={standard} placeholder="Select Service Type" options={cleanOptions} setter={setStandard} />

                <Link
                    href={buildBookingUrl()}
                    className="px-7 md:px-4 lg:px-7 py-[18px] h-full flex justify-center items-center bg-[#1E78FF] text-white text-[15px] font-semibold whitespace-nowrap hover:bg-blue-600 transition-colors duration-200 rounded-r-xl relative z-10"
                >
                    {priceText}
                </Link>
            </div>

            {/* Mobile View */}
            <div className="md:hidden w-full flex justify-center mt-2">
                <Link
                    href={buildBookingUrl()}
                    className="flex justify-center items-center w-full py-[20px] bg-[#1E78FF] text-white text-[18px] font-bold rounded-[10px] hover:bg-blue-600 transition-colors shadow-md"
                >
                    {priceText}
                </Link>
            </div>
        </div>
    );
}
