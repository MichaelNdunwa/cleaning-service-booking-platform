import Image from "next/image";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/ui/CTABanner";

function SolutionsHero() {
    return (
        <section className="w-full relative flex flex-col lg:block overflow-hidden bg-white">
            {/* Content centered on mobile (top) & overlaid on desktop */}
            <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 w-full max-w-4xl mx-auto py-16 sm:py-24 lg:absolute lg:inset-0 lg:justify-center">
                <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-semibold text-[#0B1536] mb-8 leading-tight drop-shadow-sm">
                    Treat Employees Like<br />Your Own Customers
                </h1>
                <Button
                    href="/booking"
                    variant="primary-outline-hover"
                    className="w-full sm:w-auto px-10 py-4 text-lg font-semibold shadow-md"
                >
                    Request a Quote
                </Button>
            </div>

            {/* Full background overlay on desktop */}
            <div className="relative w-full hidden lg:block lg:h-[600px] lg:absolute lg:inset-0 z-0">
                <Image
                    src="/images/solutions-hero-bg-2.png"
                    alt="Solutions Hero Background"
                    fill
                    className="object-contain object-center"
                    priority
                />
            </div>

            {/* Desktop min-height spacer to ensure absolute image has space */}
            <div className="hidden lg:block w-full min-h-[600px]"></div>
        </section>
    );
}

function AccreditationsSection() {
    const accreditations = [
        { src: "/images/bbb-logo.svg", alt: "BBB Logo", width: 45, height: 43 },
        { src: "/images/ijcsa-logo.svg", alt: "IJCSA Logo", width: 128, height: 43 },
        { src: "/images/issa-logo.svg", alt: "ISSA Logo", width: 105, height: 40 },
        { src: "/images/arcsi-logo.svg", alt: "ARCSI Logo", width: 83, height: 40 },
        { src: "/images/a+-logo.svg", alt: "A+ Logo", width: 64, height: 40 }
    ];

    return (
        <section className="w-full relative h-[400px] flex flex-col justify-center bg-[#0B1536] overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image
                    // src="/images/shield-report-bg.png"
                    src="/images/accreditations-bg.png"
                    alt="Background"
                    fill
                    className="object-cover object-center"
                />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-20 -mt-10">
                    Our accreditations
                </h2>

                <div className="flex flex-wrap justify-center items-center gap-12 sm:gap-20">
                    {accreditations.map((logo, index) => (
                        <div key={index} className="flex items-center justify-center relative">
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={logo.width}
                                height={logo.height}
                                className="object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function BenefitsSection() {
    return (
        <section className="w-full bg-white py-20 lg:py-32">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 lg:mb-24">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B1536]">
                        What can Shield Cleaning do for you?
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 lg:gap-x-24 lg:gap-y-20">
                    {/* Benefit 1 */}
                    <div className="flex flex-col items-start text-left">
                        <Image src="/images/water-icon.svg" alt="Health & Safety Icon" width={60} height={60} className="mb-6" />
                        <h3 className="text-xl font-bold text-[#0B1536] mb-4">Health & Safety</h3>
                        <p className="text-[#3B4256] text-sm sm:text-base leading-relaxed">
                            Provide your staff or clients with a healthy environment for your business and operations. A clean office improves employee morale, health and overall safety.
                        </p>
                    </div>

                    {/* Benefit 2 */}
                    <div className="flex flex-col items-start text-left">
                        <Image src="/images/growth-icon.svg" alt="High Morale Icon" width={60} height={60} className="mb-6" />
                        <h3 className="text-xl font-bold text-[#0B1536] mb-4">High Morale</h3>
                        <p className="text-[#3B4256] text-sm sm:text-base leading-relaxed">
                            Improve employee morale. Employees who work in a clean office are happier and happy employees mean reduced turnover and increased productivity.
                        </p>
                    </div>

                    {/* Benefit 3 */}
                    <div className="flex flex-col items-start text-left">
                        <Image src="/images/increase-icon.svg" alt="Save Money Icon" width={60} height={60} className="mb-6" />
                        <h3 className="text-xl font-bold text-[#0B1536] mb-4">Save Money</h3>
                        <p className="text-[#3B4256] text-sm sm:text-base leading-relaxed">
                            Reduce costs and increase revenue. Clean offices are less expensive to maintain and outsourcing your cleaning saves on employee numbers.
                        </p>
                    </div>

                    {/* Benefit 4 */}
                    <div className="flex flex-col items-start text-left">
                        <Image src="/images/support-icon.svg" alt="Full-service Partnership Icon" width={60} height={60} className="mb-6" />
                        <h3 className="text-xl font-bold text-[#0B1536] mb-4">Full-service Partnership</h3>
                        <p className="text-[#3B4256] text-sm sm:text-base leading-relaxed">
                            With our service, you’ll no longer have to worry about inventory and ordering supplies monthly because we manage it all for you and provide our own supplies and equipment.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function SolutionsPage() {
    return (
        <div className="w-full overflow-x-hidden">
            <SolutionsHero />
            <AccreditationsSection />
            <BenefitsSection />
            <div className="py-16 sm:py-24 bg-white">
                <CTABanner title="The Ultimate Cleaning Companion" description="" />
            </div>
        </div>
    );
}
