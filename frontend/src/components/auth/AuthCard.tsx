import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

interface AuthCardProps {
    children: ReactNode;
    title?: string;
}

export default function AuthCard({ children, title }: AuthCardProps) {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center mb-8">
                    <Image
                        src="/images/logo-1.png"
                        alt="Clean Logo"
                        width={120}
                        height={40}
                        className="object-contain"
                    />
                </Link>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
                    {title && (
                        <div className="mb-6 text-center">
                            <h1 className="text-2xl font-bold text-[#0B1536]">{title}</h1>
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
}
