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
        iconWidth: 82,
        iconHeight: 97,
        label: "BOOK",
        description: "Tell us when and where you want your cleaning.",
    },
    {
        icon: "/images/cleaning-service.svg",
        iconWidth: 84,
        iconHeight: 107.42,
        label: "CLEAN",
        description:
            "A Professional cleaner comes over and cleans your place.",
    },
    {
        icon: "/images/sparkling.svg",
        iconWidth: 84.8,
        iconHeight: 99.73,
        label: "FREEDOM",
        description: "Enjoy your life and come back to a clean space!.",
    },
] as const;

/* ── Dotted-circle position per card index ── */
const dottedCirclePosition = [
    "bottom-[-10px] left-[-65px]",   // Card 0 — BOOK (bottom-left area, shifted up from the bottom tip)
    "top-[-65px] left-[-10px]",      // Card 1 — CLEAN (top-left area, matching horizontal gap size)
    "bottom-[-10px] right-[-65px]",  // Card 2 — FREEDOM (bottom-right area, shifted up from the bottom tip)
] as const;

export default function HowItWorksSteps() {
    return (
        <div className="relative overflow-visible">
            {/* ── Dashed curve paths connecting diamonds (desktop only) ── */}
            <div
                className="hidden lg:block absolute top-[5%] left-[19%] z-0 pointer-events-none"
                aria-hidden="true"
            >
                <Image
                    src="/images/curve-path.svg"
                    alt=""
                    width={350}
                    height={300}
                    className="object-contain"
                />
            </div>
            <div
                className="hidden lg:block absolute top-[2%] right-[19%] z-0 pointer-events-none"
                aria-hidden="true"
            >
                <Image
                    src="/images/curve-path.svg"
                    alt=""
                    width={350}
                    height={300}
                    className="object-contain"
                />
            </div>

            {/* ── Step cards grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 lg:gap-20">
                {steps.map((item, index) => (
                    <div key={item.label} className="flex flex-col items-center group">
                        {/* Container sized to diamond's bounding box (~255px) so left-aligned text starts at the diamond's left tip */}
                        <div className="w-[255px] flex flex-col items-start">
                            {/* Diamond wrapper — centered in container */}
                            <div className="relative self-center z-10 block">
                                {/* Outer diamond: sizing + hover transform */}
                                <div className="w-[180px] h-[180px] rotate-45 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:scale-[1.07]">
                                    {/* Inner white card */}
                                    <div
                                        className="w-[180px] h-[180px] rounded-[24px] bg-white flex items-center justify-center"
                                        style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.09)" }}
                                    >
                                        {/* Icon — counter-rotated to appear upright */}
                                        <div
                                            className="-rotate-45 relative"
                                            style={{ width: item.iconWidth, height: item.iconHeight }}
                                        >
                                            <Image
                                                src={item.icon}
                                                alt={item.label}
                                                fill
                                                className="object-contain"
                                                sizes={`${Math.ceil(item.iconWidth)}px`}
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

                            {/* Text content shifted slightly right to account for the diamond's rounded corner inset */}
                            <div className="ml-2 md:ml-3">
                                {/* Step label */}
                                <p className="text-[14px] font-[800] tracking-[0.1em] text-[#3B82F6] mb-3 mt-12">
                                    {item.label}
                                </p>

                                {/* Step description */}
                                <p className="text-[13px] text-neutral-400 leading-[1.8] max-w-[210px] font-medium tracking-wide">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
