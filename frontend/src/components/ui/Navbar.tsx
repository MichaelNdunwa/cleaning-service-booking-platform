"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About Us" },
        { href: "/solutions", label: "Solutions" },
        { href: "/booking", label: "Book Now" },
    ];

    if (pathname?.startsWith("/booking")) {
        return null;
    }

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
                    <nav className="hidden lg:flex items-center gap-1">
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

                    {/* Desktop Auth / Profile */}
                    <div className="hidden lg:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-neutral-100">
                                    <div className="w-7 h-7 rounded-full bg-[#1E78FF] text-white flex items-center justify-center font-bold text-xs uppercase">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-semibold text-[#0B1536]">
                                        {user.name.split(" ")[0]}
                                    </span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors px-2 py-1"
                                >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>

                    <div className="lg:hidden flex items-center gap-2">
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
                    <div className="lg:hidden pb-4 border-t border-neutral-100 mt-2 animate-fade-in-up">
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

                            {/* Mobile Auth Bottom Section */}
                            <div className="pt-3 mt-2 border-t border-neutral-100">
                                {user ? (
                                    <div className="flex flex-col gap-3 px-2 py-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#1E78FF] text-white flex items-center justify-center font-bold text-sm uppercase">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#0B1536]">{user.name}</span>
                                                <span className="text-xs text-neutral-400">{user.email}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setMobileOpen(false);
                                            }}
                                            className="w-full py-2.5 text-sm font-bold text-red-500 bg-red-50 border border-red-100 rounded-lg text-center mt-2 hover:bg-red-100 transition-colors"
                                        >
                                            Log out
                                        </button>
                                    </div>
                                ) : (
                                    <Button
                                        href="/signup"
                                        variant="primary-outline-hover"
                                        fullWidth
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Get Started
                                    </Button>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
