"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";

const OPTIONS = {
    bed: ["One", "Two", "Three", "Four", "Five+"],
    bath: ["1 Bathroom", "2 Bathrooms", "3 Bathrooms", "4+ Bathrooms"],
    standard: ["Standard", "Deep Clean", "Premium"],
};

export default function BookingBar() {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const [bed, setBed] = useState("Two");
    const [bath, setBath] = useState("");
    const [standard, setStandard] = useState("");

    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (barRef.current && !barRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const Dropdown = ({ id, value, placeholder, options, setter, isFirst }: any) => {
        const isOpen = openDropdown === id;

        return (
            <div
                className={clsx(
                    "flex-1 relative",
                    /* Render the standard right divider, UNLESS this dropdown or the one next to it is open */
                    !isOpen && id !== "standard" && "border-b sm:border-b-0 sm:border-r border-neutral-100"
                )}
            >
                <button
                    type="button"
                    onClick={() => setOpenDropdown(isOpen ? null : id)}
                    className={clsx(
                        "w-full px-5 py-[18px] text-[15px] outline-none flex items-center justify-between transition-all duration-200 z-10",
                        isOpen
                            ? "ring-2 ring-inset ring-brand-accent shadow-md rounded-[10px] relative z-20 bg-white"
                            : "text-neutral-600 bg-transparent hover:bg-neutral-50/50",
                        isFirst && !isOpen && "rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none",
                        value ? "font-medium text-neutral-900" : "text-neutral-400"
                    )}
                >
                    <span>{value || placeholder}</span>
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
                        {options.map((opt: string) => (
                            <button
                                key={opt}
                                onClick={() => {
                                    setter(opt);
                                    setOpenDropdown(null);
                                }}
                                className={clsx(
                                    "w-full text-left px-5 py-3 text-[15px] transition-colors duration-150",
                                    value === opt
                                        ? "bg-[#F4F8FF] text-brand-accent font-semibold"
                                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                                )}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto relative z-[100]" ref={barRef}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-neutral-100 relative z-[100]">

                <Dropdown id="bed" value={bed} placeholder="Select Bedrooms" options={OPTIONS.bed} setter={setBed} isFirst={true} />

                <Dropdown id="bath" value={bath} placeholder="Bathroom" options={OPTIONS.bath} setter={setBath} />

                <Dropdown id="standard" value={standard} placeholder="Standard" options={OPTIONS.standard} setter={setStandard} />

                <Link
                    href="/booking"
                    className="px-7 py-[18px] h-full bg-brand-accent text-white text-[15px] font-semibold whitespace-nowrap text-center hover:bg-brand-accent-hover transition-colors duration-200 rounded-b-xl sm:rounded-bl-none sm:rounded-r-xl relative z-10"
                >
                    Booking from $80
                </Link>
            </div>
        </div>
    );
}
