"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getBooking } from "@/lib/api";
import type { Booking } from "@/lib/types";

const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || "Shield Cleaning";

function ConfirmationContent() {    const searchParams = useSearchParams();
    const bookingId = searchParams.get("id");

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!bookingId) {
            setError("No booking ID provided.");
            setLoading(false);
            return;
        }
        const id = parseInt(bookingId, 10);
        if (isNaN(id)) {
            setError("Invalid booking ID.");
            setLoading(false);
            return;
        }

        getBooking(id)
            .then((res) => {
                setBooking(res.booking);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Failed to load booking details.");
                setLoading(false);
            });
    }, [bookingId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-neutral-400 text-sm font-medium">Loading booking details...</div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <p className="text-red-600 text-lg font-semibold">{error || "Booking not found."}</p>
                <Link href="/" className="text-[#1E78FF] font-semibold hover:underline mt-2">
                    Back to home
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h1 className="text-[28px] md:text-3xl font-bold text-[#0B1536] mb-2 text-center">
                Booking Confirmed!
            </h1>
            <p className="text-[#9CA3AF] text-[15px] mb-8 text-center max-w-md">
                Thank you for booking with {COMPANY_NAME}. Your booking reference is{" "}
                <span className="font-bold text-[#0B1536]">{booking.reference}</span>.
            </p>

            <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-100 shadow-sm p-8 mb-8">
                <div className="flex flex-col gap-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-neutral-400">Date</span>
                        <span className="font-semibold text-[#0B1536]">
                            {new Date(booking.booking_date + "T12:00:00").toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-neutral-400">Time</span>
                        <span className="font-semibold text-[#0B1536]">{booking.time_slot.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-neutral-400">Service</span>
                        <span className="font-semibold text-[#0B1536]">{booking.pricing.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-neutral-400">Address</span>
                        <span className="font-semibold text-[#0B1536] text-right max-w-[200px]">
                            {booking.address.line_1}{booking.address.line_2 ? `, ${booking.address.line_2}` : ""}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-neutral-400">Total</span>
                        <span className="font-semibold text-[#0B1536]">${booking.amount_total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-neutral-400">Status</span>
                        <span className="font-semibold text-green-600 capitalize">{booking.state}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center h-[48px] px-8 rounded-lg bg-[#1E78FF] text-white font-bold text-[15px] hover:bg-blue-600 transition-colors"
                >
                    Back to home
                </Link>
            </div>

            <p className="text-neutral-400 text-[13px] mt-8 text-center max-w-sm">
                A confirmation email with your booking details has been sent to{" "}
                <span className="font-semibold text-[#0B1536]">{booking.customer.email}</span>.
            </p>
        </div>
    );
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="text-neutral-400 text-sm font-medium">Loading...</div></div>}>
            <ConfirmationContent />
        </Suspense>
    );
}
