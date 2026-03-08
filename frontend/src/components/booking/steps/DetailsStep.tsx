"use client";

import { BookingState } from "@/app/booking/page";
import Button from "@/components/ui/Button";

interface Props {
    data: BookingState;
    updateData: (updates: Partial<BookingState>) => void;
    onNext: () => void;
}

export default function DetailsStep({ data, updateData, onNext }: Props) {
    const frequencies = [
        { id: "Onetime", label: "Onetime", discount: null },
        { id: "Weekly", label: "Weekly", discount: "20% OFF" },
        { id: "Every 2 weeks", label: "Every 2 weeks", discount: "15% OFF" },
        { id: "Every 4 Weeks", label: "Every 4 Weeks", discount: "10% OFF" },
    ];

    const entryMethods = ["Someone is Home", "Doorman", "Hidden Key", "Others"];

    const extrasOptions = [
        { id: "Inside fridge", label: "Inside fridge", price: "$35" },
        { id: "Inside oven", label: "Inside oven", price: "$35" },
        { id: "Inside Cabinets", label: "Inside Cabinets", price: "$35" },
    ];

    const toggleExtra = (id: string) => {
        const newExtras = data.extras.includes(id)
            ? data.extras.filter(e => e !== id)
            : [...data.extras, id];
        updateData({ extras: newExtras });
    };

    return (
        <div className="w-full max-w-3xl flex flex-col items-center animate-fade-in">
            <h2 className="text-3xl font-bold text-[#0B1536] mb-2">Select Frequency</h2>
            <p className="text-[#9CA3AF] text-[15px] mb-12">Book ForShield's recurring plan and save 20% annually.</p>

            {/* Frequency */}
            <div className="w-full mb-16 flex flex-col items-center">
                <p className="text-[10px] font-extrabold text-neutral-300 uppercase tracking-widest mb-4">
                    Recurring
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                    {frequencies.map((freq) => (
                        <div key={freq.id} className="flex flex-col items-center gap-2">
                            <button
                                type="button"
                                onClick={() => updateData({ frequency: freq.id })}
                                className={`
                                    h-[46px] rounded-lg text-[15px] font-bold transition-all duration-200 min-w-[130px] px-4 flex items-center justify-center
                                    ${data.frequency === freq.id
                                        ? "border-2 border-[#1E78FF] text-[#1E78FF] shadow-[0_4px_14px_rgba(30,120,255,0.15)] bg-white"
                                        : "border border-neutral-200 text-[#0B1536] hover:border-neutral-300 bg-white"
                                    }
                                `}
                            >
                                {freq.label}
                            </button>
                            {freq.discount && (
                                <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">{freq.discount}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <h2 className="text-3xl font-bold text-[#0B1536] mb-2">Add Your Address & Details</h2>
            <p className="text-[#9CA3AF] text-[15px] mb-12">Be specific of any additional details we might need from you</p>

            {/* Address */}
            <div className="w-full max-w-2xl flex gap-4 mb-10">
                <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[10px] font-extrabold text-neutral-300 uppercase tracking-widest pl-1">Address</label>
                    <input
                        type="text"
                        placeholder="Enter a Location"
                        value={data.address}
                        onChange={(e) => updateData({ address: e.target.value })}
                        className="h-[52px] w-full border border-neutral-200 rounded-lg px-4 text-[15px] text-[#0B1536] focus:border-[#1E78FF] focus:ring-1 focus:ring-[#1E78FF] outline-none placeholder:text-neutral-400"
                    />
                </div>
                <div className="w-[140px] flex flex-col gap-2">
                    <label className="text-[10px] font-extrabold text-neutral-300 uppercase tracking-widest pl-1">Apt.Number</label>
                    <input
                        type="text"
                        value={data.aptNumber}
                        onChange={(e) => updateData({ aptNumber: e.target.value })}
                        className="h-[52px] w-full border border-neutral-200 rounded-lg px-4 text-[15px] text-[#0B1536] focus:border-[#1E78FF] focus:ring-1 focus:ring-[#1E78FF] outline-none placeholder:text-neutral-400"
                    />
                </div>
            </div>

            {/* Entry Method */}
            <div className="w-full max-w-2xl mb-10 flex flex-col items-center">
                <p className="text-[10px] font-extrabold text-neutral-300 uppercase tracking-widest mb-4">
                    How do we get in?
                </p>
                <div className="flex flex-wrap justify-between w-full gap-3">
                    {entryMethods.map((method) => (
                        <button
                            key={method}
                            type="button"
                            onClick={() => updateData({ entryMethod: method })}
                            className={`
                                flex-1 h-[46px] rounded-lg text-[15px] font-bold transition-all duration-200 min-w-[120px] whitespace-nowrap px-2
                                ${data.entryMethod === method
                                    ? "border-2 border-[#1E78FF] text-[#1E78FF] shadow-[0_4px_14px_rgba(30,120,255,0.15)] bg-white"
                                    : "border border-neutral-200 text-neutral-600 hover:border-neutral-300 bg-white"
                                }
                            `}
                        >
                            {method}
                        </button>
                    ))}
                </div>
            </div>

            {/* Extras */}
            <div className="w-full max-w-2xl mb-12 flex flex-col items-center">
                <p className="text-[10px] font-extrabold text-neutral-300 uppercase tracking-widest mb-4">
                    Extras
                </p>
                <div className="flex justify-center gap-4 w-full">
                    {extrasOptions.map((extra) => {
                        const isSelected = data.extras.includes(extra.id);
                        return (
                            <button
                                key={extra.id}
                                type="button"
                                onClick={() => toggleExtra(extra.id)}
                                className={`
                                    flex-1 h-[140px] rounded-xl flex flex-col items-center justify-center gap-3 transition-all duration-200
                                    ${isSelected
                                        ? "border-2 border-[#1E78FF] shadow-[0_4px_14px_rgba(30,120,255,0.15)] bg-white"
                                        : "border border-neutral-200 bg-white hover:border-neutral-300"
                                    }
                                `}
                            >
                                <div className={`w-8 h-10 border-2 rounded-md border-neutral-300 flex items-center justify-center ${isSelected ? "border-[#1E78FF]" : ""}`}>
                                    {/* Mock icon shape */}
                                </div>
                                <div>
                                    <div className={`text-[15px] font-bold ${isSelected ? "text-[#1E78FF]" : "text-[#0B1536]"}`}>{extra.label}</div>
                                    <div className="text-[13px] font-semibold text-neutral-400 mt-1">{extra.price}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Pets */}
            <div className="w-full max-w-2xl mb-8 flex flex-col items-center">
                <p className="text-[10px] font-extrabold text-neutral-300 uppercase tracking-widest mb-4">
                    Any Pets?
                </p>
                <div className="flex justify-center gap-3 w-full max-w-[200px] mx-auto mb-4">
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

                <input
                    type="text"
                    placeholder="What types of pets? Some of our cleaners have pet allergies."
                    value={data.petDetails}
                    onChange={(e) => updateData({ petDetails: e.target.value })}
                    className="h-[52px] w-full border border-neutral-200 rounded-lg px-4 text-[14px] text-[#0B1536] focus:border-[#1E78FF] focus:ring-1 focus:ring-[#1E78FF] outline-none placeholder:text-neutral-400 font-medium"
                />
            </div>

            {/* Notes */}
            <div className="w-full max-w-2xl mb-12 flex flex-col gap-2">
                <label className="text-[10px] font-extrabold text-neutral-300 uppercase tracking-widest pl-1">Additional Notes</label>
                <textarea
                    placeholder="I would like Sophie to be my cleaner. Please change my sheets (fresh bedding is on the bed) and empty the dishwasher."
                    value={data.notes}
                    onChange={(e) => updateData({ notes: e.target.value })}
                    className="h-[100px] py-4 w-full border border-neutral-200 rounded-lg px-4 text-[14px] text-[#0B1536] focus:border-[#1E78FF] focus:ring-1 focus:ring-[#1E78FF] outline-none placeholder:text-neutral-400 font-medium resize-none leading-relaxed"
                />
            </div>

            <Button onClick={onNext} className="w-[180px] h-[48px] text-[15px]">
                Next
            </Button>
        </div>
    );
}
