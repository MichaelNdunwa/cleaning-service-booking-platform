import BookingBar from "@/components/BookingBar";

interface CTABannerProps {
    title?: string;
    description?: string;
}

export default function CTABanner({
    title = "Servicing 100K+ Users Across Your City",
    description = "Join thousands of satisfied customers who trust Shield for their cleaning needs. Book your first clean today."
}: CTABannerProps) {
    return (
        <section
            className="w-full bg-cover bg-center bg-no-repeat relative flex flex-col items-center justify-center p-0 m-0"
            style={{ backgroundImage: "url('/images/cta-banner-bg.png')" }}
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="cta-banner rounded-3xl h-[350px] flex flex-col items-center justify-center px-4 sm:px-8 text-center relative overflow-visible">
                    {/* Decorative elements (re-added for visual flair) */}
                    <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

                    <div className="relative z-10 w-full max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 mb-2 sm:mb-4 leading-tight">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-neutral-500 font-medium text-sm sm:text-base leading-relaxed mb-8 sm:mb-10 max-w-xl mx-auto">
                                {description}
                            </p>
                        )}

                        {/* The newly added Booking Bar integrated here */}
                        <div className="w-full">
                            <BookingBar className="max-w-5xl" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
