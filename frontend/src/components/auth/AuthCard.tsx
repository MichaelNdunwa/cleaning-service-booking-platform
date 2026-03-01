import type { ReactNode } from "react";
import Link from "next/link";

interface AuthCardProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

export default function AuthCard({ children, title, subtitle }: AuthCardProps) {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center">
                        <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <span className="text-2xl font-bold text-brand-primary tracking-tight">
                        Shield
                    </span>
                </Link>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-brand-primary">{title}</h1>
                        {subtitle && (
                            <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>
                        )}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
