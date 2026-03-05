import Image from "next/image";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/ui/CTABanner";

function AboutHero() {
    return (
        <section className="w-full relative bg-white py-12 lg:py-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">
                {/* Left Column - Text & CTA */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-10 w-full lg:w-1/2 mb-12 lg:mb-0">
                    <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-[#0B1536] mb-8 leading-tight">
                        About Us
                    </h1>
                    <Button
                        href="/booking"
                        variant="primary-outline-hover"
                        className="px-8 py-3.5 text-lg font-semibold shadow-md"
                    >
                        Request A Quote
                    </Button>
                </div>

                {/* Right Column - Illustration */}
                <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end z-0">
                    <div className="relative w-full max-w-[600px] aspect-[4/3]">
                        <Image
                            src="/images/about-us.png"
                            alt="Professional cleaner mopping the floor"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function StorySection() {
    return (
        <section className="w-full bg-white py-16 lg:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1536] mb-8">
                    The Shield Cleaning.Co Story
                </h2>
                <p className="text-[#3B4256] text-[15px] sm:text-base leading-[1.8] max-w-3xl mx-auto">
                    Our story began in 2014 when we realized there's a real problem with the way cleaning is
                    currently handled. We believe you care deeply about the life and the working standard
                    of your cleaning team. As our professional cleaners, we provide comprehensive verified
                    guides on healthy and holistic cleaning methods to ensure that your home, office or
                    commercial building is as clean as a healthy and safe—environment.
                </p>
            </div>
        </section>
    );
}

function ContactSection() {
    return (
        <section className="w-full bg-[#F4F8FF]/60 py-16 lg:py-24">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1536] mb-6">
                        Contact Us
                    </h2>
                    <p className="text-[#3B4256] text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
                        If you will like to do business with us through partnerships, then email will
                        usually get back to you within the same business day. Our client services teams are
                        always ready to answer all your booking related questions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 max-w-4xl mx-auto">
                    {/* Working Hours */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="text-lg font-bold text-[#0B1536] mb-6">Working Hours</h3>
                        <div className="w-full max-w-[280px]">
                            <div className="flex justify-between items-center py-3 border-b border-blue-100/50">
                                <span className="text-sm font-medium text-neutral-600">Monday - Friday</span>
                                <span className="text-sm font-bold text-[#1E78FF]">8 AM - 5 PM</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-blue-100/50">
                                <span className="text-sm font-medium text-neutral-600">Saturday</span>
                                <span className="text-sm font-bold text-[#1E78FF]">8 AM - 4 PM</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-blue-100/50">
                                <span className="text-sm font-medium text-neutral-600">Sunday</span>
                                <span className="text-sm font-bold text-[#1E78FF]">8 AM - 1 PM</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left pt-2 md:pt-14">
                        <ul className="space-y-6">
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 mt-0.5 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm font-medium text-neutral-600">771 Stratford Ave<br />Parsippany, NJ 07054</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <a href="tel:8452344583" className="text-sm font-medium text-neutral-600 hover:text-[#1E78FF] transition-colors">(845) 234-4583</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a href="mailto:contact@shieldcleaning.co" className="text-sm font-medium text-neutral-600 hover:text-[#1E78FF] transition-colors">contact@shieldcleaning.co</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ClientsSection() {
    return (
        <section className="w-full bg-white py-20 lg:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1536] mb-12 sm:mb-16">
                    Our Amazing Clients
                </h2>
                {/* Placeholder Logos until assets are provided */}
                <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-16 opacity-50 grayscale">
                    <div className="text-2xl font-bold font-serif italic text-neutral-800 tracking-tighter">pera<br /><span className="text-[10px] font-sans font-normal tracking-wide uppercase text-neutral-400">group cleaning</span></div>
                    <div className="text-3xl font-[cursive] text-neutral-700">Brookie M</div>
                    <div className="text-3xl font-black tracking-tighter text-neutral-900">.iab.</div>
                    <div className="text-4xl font-bold text-neutral-800 tracking-tighter mix-blend-multiply">CANARAS</div>
                    <div className="text-xl font-light text-neutral-800 uppercase tracking-[0.2em]">LIGHT<span className="font-bold">IRON</span><br /><span className="text-[8px] tracking-normal">A PANAVISION COMPANY</span></div>
                </div>
            </div>
        </section>
    );
}

export default function AboutPage() {
    return (
        <div className="w-full overflow-x-hidden">
            <AboutHero />
            <StorySection />
            <ContactSection />
            <ClientsSection />
            <CTABanner />
        </div>
    );
}
