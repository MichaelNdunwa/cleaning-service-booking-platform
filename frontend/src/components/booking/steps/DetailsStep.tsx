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

export default function DetailsStep({ data, updateData, onNext, catalog }: Props) {
    const frequencies = catalog.frequencies;
    const addons = catalog.addons;
    const accessMethods = catalog.access_methods;

    const toggleAddon = (addonId: number) => {
        const idStr = String(addonId);
        const newExtras = data.extras.includes(idStr)
            ? data.extras.filter((e) => e !== idStr)
            : [...data.extras, idStr];
        updateData({ extras: newExtras });
    };

    const formatDiscount = (pct: number): string | null => {
        if (pct <= 0) return null;
        return `${pct}% OFF`;
    };

    return (
        <div className="w-full max-w-2xl flex flex-col items-start md:items-center animate-fade-in relative">
            <h2 className="text-[28px] md:text-3xl font-bold text-[#0B1536] mb-2 leading-tight">Select Frequency</h2>
            <p className="text-[#9CA3AF] text-[15px] mb-8 md:mb-12">Book ForShield&apos;s recurring plan and save 20% annually.</p>

            {/* Frequency Options */}
            <div className="w-full mb-12 md:mb-16">
                <p className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">
                    RECURRING
                </p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                    {frequencies.slice(0, 2).map((freq) => (
                        <div key={freq.code} className="flex flex-col items-center gap-1.5 focus-within:z-10 relative">
                            <button
                                type="button"
                                onClick={() => updateData({ frequency: freq.name, frequencyCode: freq.code })}
                                className={`
                                    h-[46px] rounded-lg text-[15px] font-bold transition-all duration-200 min-w-[130px] px-4 flex items-center justify-center
                                    ${data.frequencyCode === freq.code
                                        ? "border-2 border-[#1E78FF] text-[#1E78FF] shadow-[0_4px_14px_rgba(30,120,255,0.15)] bg-white"
                                        : "border border-neutral-200 text-[#0B1536] hover:border-neutral-300 bg-white"
                                    }
                                `}
                            >
                                {freq.name}
                            </button>
                            {formatDiscount(freq.discount_pct) && (
                                <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">{formatDiscount(freq.discount_pct)}</span>
                            )}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {frequencies.slice(2).map((freq) => (
                        <div key={freq.code} className="flex flex-col items-center gap-1.5 focus-within:z-10 relative">
                            <button
                                type="button"
                                onClick={() => updateData({ frequency: freq.name, frequencyCode: freq.code })}
                                className={`
                                    h-[46px] rounded-lg text-[15px] font-bold transition-all duration-200 min-w-[130px] px-4 flex items-center justify-center
                                    ${data.frequencyCode === freq.code
                                        ? "border-2 border-[#1E78FF] text-[#1E78FF] shadow-[0_4px_14px_rgba(30,120,255,0.15)] bg-white"
                                        : "border border-neutral-200 text-[#0B1536] hover:border-neutral-300 bg-white"
                                    }
                                `}
                            >
                                {freq.name}
                            </button>
                            {formatDiscount(freq.discount_pct) && (
                                <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">{formatDiscount(freq.discount_pct)}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Address & Details Section */}
            <div className="w-full border-t border-neutral-100 pt-10 md:pt-16">
                <h2 className="text-[28px] md:text-3xl font-bold text-[#0B1536] mb-2 leading-tight">Add Your Address &amp; Details</h2>
                <p className="text-[#9CA3AF] text-[15px] mb-8 md:mb-12">Be specific of any additional details we might need from you</p>

                {/* Address & Apt */}
                <div className="flex flex-col md:flex-row gap-6 mb-8 md:mb-10">
                    <div className="flex-1 flex flex-col items-start w-full">
                        <p className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">
                            ADDRESS
                        </p>
                        <input
                            placeholder="Enter a Location"
                            value={data.address}
                            onChange={(e) => updateData({ address: e.target.value })}
                            className="h-[52px] w-full border border-neutral-200 rounded-lg px-4 text-[15px] text-[#0B1536] focus:border-[#1E78FF] focus:ring-1 focus:ring-[#1E78FF] outline-none placeholder:text-neutral-400 bg-white"
                        />
                    </div>
                    <div className="w-full md:w-48 flex flex-col items-start">
                        <p className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">
                            APT. NUMBER
                        </p>
                        <input
                            placeholder=""
                            value={data.aptNumber}
                            onChange={(e) => updateData({ aptNumber: e.target.value })}
                            className="h-[52px] w-full border border-neutral-200 rounded-lg px-4 text-[15px] text-[#0B1536] focus:border-[#1E78FF] focus:ring-1 focus:ring-[#1E78FF] outline-none placeholder:text-neutral-400 bg-white"
                        />
                    </div>
                </div>

                {/* Entry Method */}
                <div className="mb-10 md:mb-14 flex flex-col items-start w-full">
                    <p className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">
                        HOW DO WE GET IN?
                    </p>
                    <div className="flex flex-wrap md:flex-nowrap gap-3 w-full justify-between">
                        {accessMethods.map((method) => (
                            <button
                                key={method.code}
                                type="button"
                                onClick={() => updateData({ entryMethod: method.name })}
                                className={`
                                flex-1 h-[46px] rounded-lg text-[15px] font-bold transition-all duration-200 min-w-[120px] whitespace-nowrap px-2
                                ${data.entryMethod === method.name
                                        ? "border-2 border-[#1E78FF] text-[#1E78FF] shadow-[0_4px_14px_rgba(30,120,255,0.15)] bg-white"
                                        : "border border-neutral-200 text-neutral-600 hover:border-neutral-300 bg-white"
                                    }
                            `}
                            >
                                {method.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Add-ons from API */}
                {addons.length > 0 && (
                    <div className="mb-10 md:mb-14 flex flex-col items-start w-full">
                        <p className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">
                            ADD ONS?
                        </p>
                        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 md:gap-4 w-full">
                            {addons.map((addon) => {
                                const isSelected = data.extras.includes(String(addon.id));
                                return (
                                    <button
                                        key={addon.id}
                                        onClick={() => toggleAddon(addon.id)}
                                        className={`
                                            h-[100px] md:h-28 rounded-xl flex flex-col items-center justify-center gap-2 border bg-white transition-all w-full md:w-[140px] px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1E78FF]
                                            ${isSelected
                                                ? "border-2 border-[#1E78FF] shadow-[0_4px_14px_rgba(30,120,255,0.15)] z-10 block"
                                                : "border-neutral-200 hover:border-neutral-300 relative"
                                            }
                                        `}
                                    >
                                        <div className={`w-8 h-10 border-2 rounded-md border-neutral-300 flex items-center justify-center ${isSelected ? "border-[#1E78FF]" : ""}`}>
                                            {/* Mock icon shape */}
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className={`text-[15px] font-bold ${isSelected ? "text-[#1E78FF]" : "text-[#0B1536]"}`}>{addon.name}</div>
                                            <div className="text-[13px] font-semibold text-neutral-400 mt-1">${addon.price.toFixed(0)}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Pets */}
                <div className="mb-8 md:mb-10 flex flex-col items-start w-full">
                    <p className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">
                        ANY PETS?
                    </p>
                    <div className="flex gap-3 mb-4 w-full">
                        <button
                            onClick={() => updateData({ hasPets: true })}
                            className={`
                            flex-1 h-[46px] rounded-lg text-[15px] font-bold transition-all px-6
                            ${data.hasPets
                                    ? "border-2 border-[#1E78FF] text-[#1E78FF] shadow-[0_4px_14px_rgba(30,120,255,0.15)] bg-white"
                                    : "border border-neutral-200 text-neutral-600 bg-white"
                                }
                        `}
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => updateData({ hasPets: false })}
                            className={`
                            flex-1 h-[46px] rounded-lg text-[15px] font-bold transition-all px-6
                            ${!data.hasPets
                                    ? "border-2 border-[#1E78FF] text-[#1E78FF] shadow-[0_4px_14px_rgba(30,120,255,0.15)] bg-white"
                                    : "border border-neutral-200 text-[#0B1536] bg-white"
                                }
                        `}
                        >
                            No
                        </button>
                    </div>
                    {data.hasPets && (
                        <textarea
                            placeholder="What types of pets? Some of our cleaners have pet allergies."
                            value={data.petDetails}
                            onChange={(e) => updateData({ petDetails: e.target.value })}
                            className="w-full h-24 p-4 border rounded-xl border-neutral-200 bg-white placeholder:text-neutral-400 text-[#0B1536] resize-none focus:outline-none focus:border-[#1E78FF] transition-colors"
                        />
                    )}
                </div>

                {/* Notes */}
                <div className="mb-8 md:mb-12 flex flex-col items-start w-full">
                    <p className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">
                        ADDITIONAL NOTES
                    </p>
                    <textarea
                        placeholder="I would like Sophie to be my cleaner. Please change my sheets (fresh bedding is on the bed) and empty the dishwasher."
                        value={data.notes}
                        onChange={(e) => updateData({ notes: e.target.value })}
                        className="w-full h-32 p-5 border rounded-xl border-neutral-200 bg-white placeholder:text-neutral-400 text-[#0B1536] resize-none focus:outline-none focus:border-[#1E78FF] transition-colors"
                    />
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
