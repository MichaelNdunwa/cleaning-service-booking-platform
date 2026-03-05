import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import BookingBar from "@/components/BookingBar";
import CTABanner from "@/components/ui/CTABanner";

/* ── Hero Section ── */
function Hero() {
  return (
    <section className="hero-section relative overflow-visible min-h-[100vh] lg:min-h-0 flex flex-col lg:block bg-gradient-to-b from-white to-neutral-50 lg:bg-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 sm:pt-10 sm:pb-8 lg:pt-6 lg:pb-4 relative lg:mb-20 flex-1 flex flex-col lg:block justify-center">

        {/* ── Mobile Title & CTA ── */}
        <div className="lg:hidden w-full text-center flex flex-col items-center justify-center mt-12 sm:mt-16 mb-6 z-10 px-2 space-y-6 lg:mt-0 lg:mb-8">
          <h1 className="text-[46px] sm:text-[52px] md:text-[64px] font-bold tracking-tight text-brand-primary leading-[1.05] font-sans">
            Your One Stop
            <br />
            Cleaning Centre
          </h1>
          <div className="w-full relative z-40">
            <BookingBar />
          </div>
        </div>

        {/* ── Character Illustrations ── */}
        <div className="relative flex-1 lg:flex-none flex items-center justify-center lg:block">

          {/* Top-Center — Man hanging on rope with squeegee */}
          <div className="absolute left-[3%] sm:left-[15%] top-0 lg:left-[38%] xl:left-[40%] lg:-translate-x-1/2 lg:-top-30 w-[160px] sm:w-[200px] lg:w-[240px] xl:w-[270px] h-[220px] sm:h-[280px] lg:h-[350px] xl:h-[390px] z-[3] animate-fade-in-up-delay-1">
            <Image
              src="/images/hero-cleaner-rope.png"
              alt="Cleaner hanging on rope with squeegee"
              fill
              className="object-contain object-top"
              sizes="(max-width: 1024px) 200px, 280px"
              priority
            />
          </div>

          <div className="relative min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] w-full flex items-center justify-center mt-24 lg:mt-24">

            {/* Left — Woman on ladder cleaning window */}
            {/* INCREASED SIZE ON MOBILE AGAIN: w-[280px] -> h-[480px] AND MOVED RIGHT TO left-[22%] */}
            <div className="absolute left-[2%] sm:left-[15%] md:left-[-5%] bottom-[15%] lg:bottom-0 lg:left-[2%] xl:left-[4%] w-[260px] sm:w-[320px] lg:w-[280px] xl:w-[340px] h-[480px] sm:h-[500px] lg:h-[460px] xl:h-[520px] z-[2] animate-fade-in-up">
              <Image
                src="/images/hero-cleaner-ladder.png"
                alt="Cleaner on ladder wiping window"
                fill
                className="object-contain object-bottom"
                sizes="(max-width: 1024px) 320px, 340px"
                priority
              />
            </div>

            {/* Right — Man with vacuum cleaner */}
            <div className="absolute right-[-10%] sm:right-[10%] md:right-[-5%] bottom-[15%] lg:bottom-0 lg:right-[4%] xl:right-[6%] w-[150px] sm:w-[180px] lg:w-[270px] h-[350px] sm:h-[300px] lg:h-[450px] z-[2] animate-fade-in-up-delay-2">
              <Image
                src="/images/hero-cleaner-vacuum.png"
                alt="Cleaner with vacuum"
                fill
                className="object-contain object-bottom"
                sizes="(max-width: 1024px) 180px, 270px"
                priority
              />
            </div>

            {/* Left floor/shadow under ladder lady - hidden on mobile */}
            <div className="hidden lg:block absolute left-[3%] xl:left-[5%] bottom-0 w-[360px] h-[260px] z-[1]" aria-hidden="true">
              <Image
                src="/images/left-floor.png"
                alt=""
                fill
                className="object-contain object-bottom"
                sizes="360px"
              />
            </div>

            {/* Left dotted circle pattern - hidden on mobile */}
            <div className="hidden lg:block absolute left-[20%] xl:left-[22%] bottom-[20%] xl:bottom-[24%] w-[90px] xl:w-[110px] h-[90px] xl:h-[110px] z-[0]" aria-hidden="true">
              <Image
                src="/images/left-dotted-circle.png"
                alt=""
                fill
                className="object-contain"
                sizes="100px"
              />
            </div>

            {/* Right floor/shadow under vacuum man - hidden on mobile */}
            <div className="hidden lg:block absolute right-[1%] xl:right-[3%] bottom-0 w-[320px] xl:w-[380px] h-[50px] xl:h-[60px] z-[1]" aria-hidden="true">
              <Image
                src="/images/right-floor.png"
                alt=""
                fill
                className="object-contain object-bottom"
                sizes="300px"
              />
            </div>

            {/* Right dotted circle pattern - hidden on mobile */}
            <div className="hidden lg:block absolute right-[24%] xl:right-[26%] top-[55%] xl:top-[50%] w-[90px] xl:w-[110px] h-[90px] xl:h-[110px] z-[0]" aria-hidden="true">
              <Image
                src="/images/right-dotted-circle.png"
                alt=""
                fill
                className="object-contain"
                sizes="100px"
              />
            </div>

            {/* ── Desktop Center Content ── */}
            <div className="hidden lg:block text-center max-w-2xl mx-auto relative z-10">
              <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] xl:text-[3rem] font-bold tracking-tight text-brand-primary leading-[1.15] mb-6">
                Your One Stop Cleaning
                <br />
                Centre For All Needs
              </h1>
            </div>
          </div>
        </div>

        {/* ── Desktop Booking Bar ── */}
        <div className="hidden lg:block relative z-50 -mt-6 lg:-mt-50 animate-fade-in-up-delay-1">
          <BookingBar />
        </div>
      </div>

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}

/* ── Why Choose Shield Section ── */
function WhyChoose() {
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

  return (
    <section className="pt-0 pb-16 lg:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-10 overflow-hidden sm:overflow-visible">
        {/* Top Row: Title + Description */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-start mb-16 lg:mb-40 text-left lg:text-left">
          <div>
            <h2 className="text-4xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#0B1536] leading-tight mt-0 lg:mt-0">
              Why Choose
              <br />
              Shield ?
            </h2>
          </div>
          <div className="lg:pt-2">
            <p className="text-[#3B4256] leading-relaxed text-[17px] sm:text-base">
              We understand your home is important to you. That&apos;s
              why we focus on the quality of the cleaner. Our cleaners
              aren&apos;t contract workers - they are full-time employees.
              They care as much as we do.
            </p>
          </div>
        </div>

        {/* Feature Diamonds with Curve Path */}
        <div className="relative overflow-x-auto overflow-y-visible snap-x snap-mandatory pt-16 sm:pt-0 pb-12 -mx-4 sm:mx-0 sm:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="relative w-full sm:w-auto mx-auto">
            {/* ── Dashed curve paths connecting diamonds (Desktop only here) ── */}
            <div
              className="hidden sm:block absolute top-[5%] left-[19%] z-0 pointer-events-none"
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
              className="hidden sm:block absolute top-[2%] right-[19%] z-0 pointer-events-none"
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
            <div className="flex sm:grid sm:grid-cols-3 gap-0 sm:gap-20 w-fit sm:w-auto">
              {steps.map((item, index) => (
                <div key={item.label} className="w-screen sm:w-auto flex-shrink-0 flex flex-col items-center group snap-center relative">

                  {/* Mobile Curve Paths connecting cards */}
                  {index < 2 && (
                    <div
                      className={`absolute ${index === 0 ? "top-[15%]" : "top-[10%]"} left-[50%] w-screen flex justify-center z-[5] pointer-events-none sm:hidden`}
                      aria-hidden="true"
                    >
                      <Image
                        src="/images/curve-path.svg"
                        alt=""
                        width={300}
                        height={250}
                        className="object-contain opacity-50"
                      />
                    </div>
                  )}

                  {/* Container sized to diamond's bounding box (~255px) */}
                  <div className="w-[255px] flex flex-col items-center sm:items-start text-center sm:text-left relative z-10">
                    {/* Diamond wrapper — centered in container */}
                    <div className="relative self-center z-10 block">
                      {/* Outer diamond: sizing + hover transform */}
                      <div className="w-[180px] h-[180px] rotate-45 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:scale-[1.07]">
                        {/* Inner white card */}
                        <div
                          className="w-[180px] h-[180px] rounded-[24px] bg-white flex items-center justify-center p-[2px] shadow-[0_12px_45px_rgba(0,0,0,0.12)] ring-1 ring-gray-100/50"
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

                    {/* Text content directly centered under diamond on mobile */}
                    <div className="mt-20 sm:mt-12 flex flex-col items-center sm:items-start ml-0 sm:ml-2 md:ml-3">
                      {/* Step label */}
                      <p className="text-[16px] sm:text-[14px] font-[800] tracking-[0.1em] text-[#2979FF] mb-3">
                        {item.label}
                      </p>

                      {/* Step description */}
                      <p className="text-[15px] sm:text-[13px] text-[#869ab8] leading-[1.8] max-w-[210px] font-medium tracking-wide">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── The Shield Report (Blog) Section ── */
function BlogSection() {
  const posts = [
    {
      title: "How to Efficiently Clean & Organize Living Areas:",
      summary: "November is here, and with it comes a fresh opportunity to tackle the clutter and dust that may have acc...",
      authorName: "Laura Pelitia",
      authorAvatar: "/images/blog-cleaning-tips.png", // Using existing image as placeholder avatar
      date: "December 18, 2023",
      image: "/images/blog-cleaning-tips.png",
    },
    {
      title: "How to Create a Self-Cleaning Home.",
      summary: "Creating a home that practically cleans itself may sound like a dream, but with a little know-how and some...",
      authorName: "Sebrina Ludowski",
      authorAvatar: "/images/blog-self-cleaning.png",
      date: "December 24, 2023",
      image: "/images/blog-self-cleaning.png",
    },
    {
      title: "10 Easy Ways to Turn Homekeeping, Happy!",
      summary: "Homekeeping can sometimes feel like a never-ending to-do list that zaps the joy right out of your day. But wh...",
      authorName: "Katrina Gomez",
      authorAvatar: "/images/blog-housekeeping.png",
      date: "January 2, 2024",
      image: "/images/blog-housekeeping.png",
    },
  ];

  return (
    <section
      className="shield-report-section py-16 lg:py-24 relative overflow-hidden bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: "url('/images/shield-report-bg.png')" }}
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            The Shield Report
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
          {posts.map((post) => (
            <article
              key={post.title}
              className="group relative w-[300px] h-[382px] rounded-[10px] overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Image with slanted cut at the bottom */}
              <div
                className="relative w-[300px] h-[174px] shrink-0 overflow-hidden bg-neutral-100"
              // style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 )", zIndex: 1 }}
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content area */}
              <div className="flex flex-col flex-1 px-6 pb-6 pt-3 relative" style={{ zIndex: 2 }}>
                <h3 className="font-bold text-[#1a202c] text-[16px] leading-[1.3] mb-2 group-hover:text-brand-accent transition-colors">
                  {post.title}
                </h3>

                <p className="text-[13px] text-neutral-400 leading-[1.6] line-clamp-3 mb-auto">
                  {post.summary}
                </p>

                {/* Author row */}
                <div className="flex items-center gap-3 mt-4 pt-4">
                  <div className="w-[34px] h-[34px] rounded-full relative overflow-hidden bg-neutral-200 shrink-0">
                    <Image
                      src={post.authorAvatar}
                      alt={post.authorName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#1a202c] leading-tight">
                      {post.authorName}
                    </span>
                    <span className="text-[11px] text-neutral-400 mt-0.5">
                      {post.date}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            variant="primary-outline-hover"
            size="lg"
            href="/blog"
          >
            Read Latest Blog
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ── Home Page ── */
export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyChoose />
      <BlogSection />
      <CTABanner />
    </>
  );
}
