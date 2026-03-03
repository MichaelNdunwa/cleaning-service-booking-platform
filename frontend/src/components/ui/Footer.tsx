"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <footer className="bg-white text-neutral-600 border-t border-neutral-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer */}
                <div className="py-12 md:py-8 lg:py-16 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-4 lg:gap-12 text-center md:text-left">
                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start lg:col-span-1 order-last md:order-first">
                        <Link href="/" className="flex items-center gap-2 mb-4 relative h-6 w-24">
                            <Image
                                src="/images/logo-2.png"
                                alt="Shield Logo"
                                fill
                                className="object-contain object-left transition-transform duration-200 group-hover:scale-105"
                                sizes="96px"
                            />
                        </Link>
                        <p className="text-neutral-500 text-sm md:text-xs lg:text-sm leading-relaxed mb-6 md:mb-4 lg:mb-6 pr-0 md:pr-4 lg:pr-0">
                            Your one stop cleaning centre for all needs. Professional,
                            reliable, and thorough cleaning services.
                        </p>
                        <div className="flex gap-4 items-center">
                            <a href="#facebook" aria-label="facebook" className="flex items-center justify-center w-5 h-5 text-neutral-400 hover:text-brand-accent transition-colors duration-200">
                                <Image src="/images/facebook.svg" alt="Facebook" width={20} height={20} className="w-5 h-5 object-contain opacity-70 hover:opacity-100" />
                            </a>
                            <a href="#twitter" aria-label="twitter" className="flex items-center justify-center w-5 h-5 text-neutral-400 hover:text-brand-accent transition-colors duration-200">
                                <Image src="/images/twitter.svg" alt="Twitter" width={20} height={20} className="w-5 h-5 object-contain opacity-70 hover:opacity-100" />
                            </a>
                            <a href="#instagram" aria-label="instagram" className="flex items-center justify-center w-5 h-5 text-neutral-400 hover:text-brand-accent transition-colors duration-200">
                                <Image src="/images/instagram.svg" alt="Instagram" width={20} height={20} className="w-5 h-5 object-contain opacity-70 hover:opacity-100" />
                            </a>
                            <a href="#linkedin" aria-label="linkedin" className="flex items-center justify-center w-5 h-5 text-neutral-400 hover:text-brand-accent transition-colors duration-200">
                                <Image src="/images/Linkedin.svg" alt="LinkedIn" width={20} height={20} className="w-5 h-5 object-contain opacity-70 hover:opacity-100" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:pl-2 lg:pl-8 border-b border-neutral-100 md:border-none">
                        <button
                            className="w-full flex justify-between items-center md:cursor-default py-4 md:py-0 md:mb-4 lg:mb-5"
                            onClick={() => toggleSection("quickLinks")}
                            aria-expanded={openSection === "quickLinks"}
                        >
                            <h3 className="font-semibold text-sm md:text-xs lg:text-sm uppercase tracking-wider text-neutral-800">
                                Quick Links
                            </h3>
                            <svg
                                className={`w-5 h-5 text-neutral-400 transition-transform duration-200 md:hidden ${openSection === "quickLinks" ? "rotate-180" : ""}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${openSection === "quickLinks" ? "max-h-64 opacity-100 pb-4 md:pb-0" : "max-h-0 opacity-0 md:max-h-none md:opacity-100"}`}>
                            <ul className="space-y-3 md:space-y-2 lg:space-y-3 flex flex-col text-left">
                                {[
                                    { href: "/", label: "Home" },
                                    { href: "/about", label: "About Us" },
                                    { href: "/solutions", label: "Solutions" },
                                    { href: "/booking", label: "Book Now" },
                                ].map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-neutral-500 text-sm md:text-[13px] lg:text-sm hover:text-brand-accent transition-colors duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Services */}
                    <div className="border-b border-neutral-100 md:border-none">
                        <button
                            className="w-full flex justify-between items-center md:cursor-default py-4 md:py-0 md:mb-4 lg:mb-5"
                            onClick={() => toggleSection("services")}
                            aria-expanded={openSection === "services"}
                        >
                            <h3 className="font-semibold text-sm md:text-xs lg:text-sm uppercase tracking-wider text-neutral-800">
                                Services
                            </h3>
                            <svg
                                className={`w-5 h-5 text-neutral-400 transition-transform duration-200 md:hidden ${openSection === "services" ? "rotate-180" : ""}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${openSection === "services" ? "max-h-64 opacity-100 pb-4 md:pb-0" : "max-h-0 opacity-0 md:max-h-none md:opacity-100"}`}>
                            <ul className="space-y-3 md:space-y-2 lg:space-y-3 flex flex-col text-left">
                                {[
                                    "Residential Cleaning",
                                    "Office Cleaning",
                                    "Deep Clean",
                                    "End of Tenancy",
                                    "Post Construction",
                                ].map((service) => (
                                    <li key={service}>
                                        <span className="text-neutral-500 text-sm md:text-[13px] lg:text-sm">{service}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="border-b border-neutral-100 md:border-none">
                        <button
                            className="w-full flex justify-between items-center md:cursor-default py-4 md:py-0 md:mb-4 lg:mb-5"
                            onClick={() => toggleSection("contact")}
                            aria-expanded={openSection === "contact"}
                        >
                            <h3 className="font-semibold text-sm md:text-xs lg:text-sm uppercase tracking-wider text-neutral-800">
                                Contact Us
                            </h3>
                            <svg
                                className={`w-5 h-5 text-neutral-400 transition-transform duration-200 md:hidden ${openSection === "contact" ? "rotate-180" : ""}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${openSection === "contact" ? "max-h-64 opacity-100 pb-4 md:pb-0" : "max-h-0 opacity-0 md:max-h-none md:opacity-100"}`}>
                            <ul className="space-y-3 md:space-y-2 lg:space-y-3 text-neutral-500 text-sm md:text-[13px] lg:text-sm flex flex-col text-left">
                                <li className="flex items-center lg:items-start gap-2 hover:text-brand-accent transition-colors duration-200">
                                    <svg
                                        className="w-4 h-4 mt-0.5 text-brand-accent-light shrink-0"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <a href="mailto:hello@shieldcleaning.co">hello@shieldcleaning.co</a>
                                </li>
                                <li className="flex items-start gap-2 hover:text-brand-accent transition-colors duration-200">
                                    <svg
                                        className="w-4 h-4 mt-0.5 text-brand-accent-light shrink-0"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    <a href="tel:+442071234567">+44 20 7123 4567</a>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg
                                        className="w-4 h-4 mt-0.5 text-brand-accent-light shrink-0"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    London, United Kingdom
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 lg:border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-neutral-500 text-xs text-center sm:text-left order-last sm:order-first">
                        © {currentYear} Shield Cleaning Co. All rights reserved.
                    </p>
                    <div className="flex gap-4 sm:gap-6 justify-center">
                        <Link
                            href="/privacy"
                            className="text-neutral-500 text-xs hover:text-brand-accent transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-neutral-500 text-xs hover:text-brand-accent transition-colors"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
