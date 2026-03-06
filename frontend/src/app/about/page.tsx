import Image from "next/image";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/ui/CTABanner";

function AboutHero() {
    return (
        <section className="w-full relative flex flex-col lg:block overflow-hidden bg-white">
            {/* Content centered on mobile (top) & overlaid on desktop */}
            <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 w-full max-w-4xl mx-auto py-12 sm:py-16 lg:absolute lg:inset-0 lg:justify-center">
                <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-semibold text-black mb-8 leading-tight drop-shadow-md">
                    About Us
                </h1>
                <Button
                    href="/booking"
                    variant="primary-outline-hover"
                    className="w-full sm:w-auto px-10 py-4 text-lg font-semibold shadow-xl"
                >
                    Request A Quote
                </Button>
            </div>

            {/* Image below text on mobile, full background overlay on desktop */}
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[600px] lg:absolute lg:inset-0 z-0">
                {/* Desktop Image */}
                <Image
                    src="/images/about-us.png"
                    alt="About Shield Cleaning.Co"
                    fill
                    className="hidden lg:block object-contain object-center"
                    priority
                />
                {/* Mobile/Tablet Image */}
                <Image
                    src="/images/about-us-mobile.png"
                    alt="About Shield Cleaning.Co Mobile"
                    fill
                    className="block lg:hidden object-cover object-center"
                    priority
                />
            </div>

            {/* Desktop min-height spacer to ensure absolute image has space */}
            <div className="hidden lg:block w-full min-h-[600px]"></div>
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
                    Our story began in 2014 when we realized there’s no convenient way for us to find cleaners in a simple manner.
                    We take our jobs very seriously, just ask the 10,000+ recurring customers who keep coming back for our professional
                    services. We use a combination of enterprise grade technology and technical cleaning methods to ensure that your house,
                    office or commercial setting is as good as new, healthy and clean - when we’re done.
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
                        If you call during our business hours you’ll get through to us instantly. If you email, we’ll usually get
                        back to you within the same business day. Our client services team members are eager to answer all of your
                        cleaning services questions.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row justify-center md:items-start gap-12 lg:gap-24 max-w-4xl mx-auto">
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
    const clients = [
        { src: "/images/pera-logo.png", alt: "Pera Group Cleaning Logo", width: 120, height: 40 },
        { src: "/images/showroom-logo.png", alt: "Showroom Logo", width: 120, height: 40 },
        { src: "/images/ish-logo.png", alt: "ISH Logo", width: 100, height: 60 },
        { src: "/images/canaras.png", alt: "Canaras Logo", width: 140, height: 40 },
        { src: "/images/light-iron-logo.png", alt: "Light Iron Logo", width: 140, height: 40 },
        { src: "/images/theatre.png", alt: "Theatre Logo", width: 100, height: 100 },
        { src: "/images/kings-bay-logo.png", alt: "Kings Bay Logo", width: 50, height: 100 },
        { src: "/images/museum-logo.png", alt: "Museum Logo", width: 100, height: 100 },
    ];

    return (
        <section className="w-full bg-white py-20 lg:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-semibold text-[#0B1536] mb-12 sm:mb-16">
                    Our Amazing Clients
                </h2>
                <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                    {clients.map((client, index) => (
                        <div key={index} className="relative flex items-center justify-center">
                            <Image
                                src={client.src}
                                alt={client.alt}
                                width={client.width}
                                height={client.height}
                                className="object-contain"
                            />
                        </div>
                    ))}
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
