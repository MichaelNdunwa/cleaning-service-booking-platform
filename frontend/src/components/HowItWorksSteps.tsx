/**
 * HowItWorksSteps — "How It Works" diamond-card steps section.
 *
 * Three rotated-square ("diamond") cards arranged horizontally with decorative
 * dotted-circle accents, plus-sign markers at cardinal points, and a dashed
 * sine-curve SVG connecting the cards on desktop.
 *
 * Pure Server Component — no client-side JS required.
 */
import Image from "next/image";

/* ── Step data ── */
const steps = [
    {
        icon: "/images/calender-remainder.svg",
        label: "BOOK",
        description: "Tell us when and where you want your cleaning.",
    },
    {
        icon: "/images/cleaning-service.svg",
        label: "CLEAN",
        description:
            "A Professional cleaner comes over and cleans your place.",
    },
    {
        icon: "/images/sparkling.svg",
        label: "FREEDOM",
        description: "Enjoy your life and come back to a clean space!.",
    },
] as const;

/* ── Dotted-circle position per card index ── */
const dottedCirclePosition = [
    "bottom-[-56px] left-[-72px]",   // Card 0 — BOOK (bottom-left)
    "top-[-56px] left-[-56px]",      // Card 1 — CLEAN (top-left)
    "bottom-[-36px] right-[-48px]",  // Card 2 — FREEDOM (bottom-right)
] as const;

export default function HowItWorksSteps() {
    return (
        <div className="relative overflow-visible">
            {/* ── Dashed curve paths connecting diamonds (desktop only) ── */}
            <div
                className="hidden lg:block absolute top-[18%] left-[23%] z-0 pointer-events-none"
                aria-hidden="true"
            >
                <Image
                    src="/images/curve-path.svg"
                    alt=""
                    width={287}
                    height={143}
                    className="object-contain"
                />
            </div>
            <div
                className="hidden lg:block absolute top-[18%] right-[23%] z-0 pointer-events-none"
                aria-hidden="true"
            >
                <Image
                    src="/images/curve-path.svg"
                    alt=""
                    width={287}
                    height={143}
                    className="object-contain"
                />
            </div>

            {/* ── Step cards grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 lg:gap-20">
                {steps.map((item, index) => (
                    <div key={item.label} className="flex flex-col items-start group">
                        {/* Diamond wrapper — centered in column */}
                        <div className="relative self-center z-10 block">
                            {/* Outer diamond: sizing + hover transform */}
                            <div className="w-[180px] h-[180px] rotate-45 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:scale-[1.07]">
                                {/* Inner white card */}
                                <div
                                    className="w-[180px] h-[180px] rounded-[32px] bg-white flex items-center justify-center"
                                    style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.09)" }}
                                >
                                    {/* Icon — counter-rotated to appear upright */}
                                    <div className="-rotate-45 w-[72px] h-[72px] relative">
                                        <Image
                                            src={item.icon}
                                            alt={item.label}
                                            fill
                                            className="object-contain"
                                            sizes="72px"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Dotted circle decoration — positioned per card */}
                            <div
                                className={`absolute w-[150px] h-[150px] z-[-1] pointer-events-none ${dottedCirclePosition[index]}`}
                                aria-hidden="true"
                            >
                                <Image
                                    src="/images/right-dotted-circle.png"
                                    alt=""
                                    fill
                                    className="object-contain"
                                    sizes="150px"
                                />
                            </div>
                        </div>

                        {/* Step label */}
                        <p className="text-[14px] font-[800] tracking-[0.1em] text-[#3B82F6] mb-3 mt-12">
                            {item.label}
                        </p>

                        {/* Step description */}
                        <p className="text-[13px] text-neutral-400 leading-[1.8] max-w-[210px] font-medium tracking-wide">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
