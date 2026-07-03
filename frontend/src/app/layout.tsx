import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { SessionProvider } from "next-auth/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Shield Cleaning — Professional Cleaning Services",
    template: "%s | Shield Cleaning",
  },
  description:
    "Your one stop cleaning centre for all needs. Book professional residential, office, and commercial cleaning services online.",
  keywords: [
    "cleaning service",
    "house cleaning",
    "office cleaning",
    "deep clean",
    "end of tenancy",
    "professional cleaners",
  ],
  icons: {
    icon: "/images/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen flex flex-col">
        <SessionProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
