"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About Us" },
        { href: "/solutions", label: "Solutions" },
        { href: "/booking", label: "Book Now" },
    ];

    return (
        <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-lg border-b border-neutral-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-18">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group relative h-10 w-[140px]">
                        <Image
                            src="/images/logo-1.png"
                            alt="Shield Logo"
                            fill
                            className="object-contain transition-transform duration-200 group-hover:scale-105"
                            sizes="140px"
                            priority
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-sm font-medium text-neutral-600 rounded-lg transition-all duration-200 hover:text-[#3B82F6] hover:bg-transparent"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm font-medium text-neutral-600 rounded-lg transition-colors duration-200 hover:text-[#3B82F6] hover:bg-transparent"
                        >
                            Log in
                        </Link>
                        <Button
                            href="/signup"
                            variant="primary-outline-hover"
                            className="px-5 py-2.5 text-sm"
                        >
                            Get Started
                        </Button>
                    </div>

                    <div className="md:hidden flex items-center gap-2">
                        {/* Mobile Log In Button */}
                        <Button
                            href="/login"
                            variant="outline"
                            className="!px-3 !py-1.5 !text-sm"
                        >
                            Log in
                        </Button>

                        {/* Mobile menu button */}
                        <button
                            className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-50 transition-colors"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {mobileOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden pb-4 border-t border-neutral-100 mt-2 animate-fade-in-up">
                        <nav className="flex flex-col gap-1 pt-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-4 py-2.5 text-sm font-medium text-neutral-600 rounded-lg hover:bg-transparent hover:text-[#3B82F6] transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-3 mt-2 border-t border-neutral-100">
                                <Button
                                    href="/signup"
                                    variant="primary-outline-hover"
                                    fullWidth
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Get Started
                                </Button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
