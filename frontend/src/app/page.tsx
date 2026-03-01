import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

/* ── Hero Section ── */
function Hero() {
  return (
    <section className="hero-section relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4 lg:pt-6 lg:pb-4 relative lg:mb-20">

        {/* ── Character Illustrations ── */}
        <div className="relative min-h-[420px] lg:min-h-[520px] flex items-center justify-center">

          {/* Left — Woman on ladder cleaning window */}
          <div className="hidden lg:block absolute left-[2%] xl:left-[4%] bottom-0 w-[280px] xl:w-[340px] h-[460px] xl:h-[520px] z-[2] animate-fade-in-up">
            <Image
              src="/images/hero-cleaner-ladder.png"
              alt="Cleaner on ladder wiping window"
              fill
              className="object-contain object-bottom"
              sizes="340px"
              priority
            />
          </div>

          {/* Top-Center — Man hanging on rope with squeegee */}
          <div className="hidden lg:block absolute left-[38%] xl:left-[40%] -translate-x-1/2 -top-4 w-[240px] xl:w-[270px] h-[350px] xl:h-[390px] z-[3] animate-fade-in-up-delay-1">
            <Image
              src="/images/hero-cleaner-rope.png"
              alt="Cleaner hanging on rope with squeegee"
              fill
              className="object-contain object-top"
              sizes="280px"
              priority
            />
          </div>

          {/* Right — Man with vacuum cleaner */}
          <div className="hidden lg:block absolute right-[4%] xl:right-[6%] bottom-0 w-[280px] xl:w-[340px] h-[470px] xl:h-[520px] z-[2] animate-fade-in-up-delay-2">
            <Image
              src="/images/hero-cleaner-vacuum.png"
              alt="Cleaner with vacuum"
              fill
              className="object-contain object-bottom"
              sizes="360px"
              priority
            />
          </div>

          {/* Left floor/shadow under ladder lady */}
          <div className="hidden lg:block absolute left-[3%] xl:left-[5%] bottom-0 w-[280px] xl:w-[340px] h-[60px] xl:h-[70px] z-[1]" aria-hidden="true">
            <Image
              src="/images/left-floor.png"
              alt=""
              fill
              className="object-contain object-bottom"
              sizes="360px"
            />
          </div>

          {/* Left dotted circle pattern */}
          <div className="hidden lg:block absolute left-[20%] xl:left-[22%] bottom-[20%] xl:bottom-[24%] w-[90px] xl:w-[110px] h-[90px] xl:h-[110px] z-[0]" aria-hidden="true">
            <Image
              src="/images/left-dotted-circle.png"
              alt=""
              fill
              className="object-contain"
              sizes="100px"
            />
          </div>

          {/* Right floor/shadow under vacuum man */}
          <div className="hidden lg:block absolute right-[1%] xl:right-[3%] bottom-0 w-[320px] xl:w-[380px] h-[50px] xl:h-[60px] z-[1]" aria-hidden="true">
            <Image
              src="/images/right-floor.png"
              alt=""
              fill
              className="object-contain object-bottom"
              sizes="300px"
            />
          </div>

          {/* Right dotted circle pattern */}
          <div className="hidden lg:block absolute right-[24%] xl:right-[26%] top-[55%] xl:top-[50%] w-[90px] xl:w-[110px] h-[90px] xl:h-[110px] z-[0]" aria-hidden="true">
            <Image
              src="/images/right-dotted-circle.png"
              alt=""
              fill
              className="object-contain"
              sizes="100px"
            />
          </div>

          {/* ── Center Content ── */}
          <div className="text-center max-w-2xl mx-auto relative z-10 pt-20 lg:pt-28">
            <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] xl:text-[3rem] font-extrabold tracking-tight text-brand-primary leading-[1.15] mb-6">
              Your One Stop Cleaning
              <br />
              Centre For All Needs
            </h1>
          </div>
        </div>

        {/* ── Booking Bar ── */}
        <div className="relative z-20 -mt-6 lg:-mt-10 animate-fade-in-up-delay-1">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0 bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-neutral-100 overflow-hidden">

              {/* Bedrooms dropdown */}
              <div className="flex-1 relative border-b sm:border-b-0 sm:border-r border-neutral-100">
                <select
                  className="w-full px-5 py-4 text-sm text-neutral-700 bg-transparent outline-none appearance-none cursor-pointer font-medium"
                  defaultValue="Two"
                >
                  <option>One</option>
                  <option>Two</option>
                  <option>Three</option>
                  <option>Four</option>
                  <option>Five+</option>
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Bathroom dropdown */}
              <div className="flex-1 relative border-b sm:border-b-0 sm:border-r border-neutral-100">
                <select
                  className="w-full px-5 py-4 text-sm text-neutral-400 bg-transparent outline-none appearance-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled>Bathroom</option>
                  <option>1 Bathroom</option>
                  <option>2 Bathrooms</option>
                  <option>3 Bathrooms</option>
                  <option>4+ Bathrooms</option>
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Standard dropdown */}
              <div className="flex-1 relative border-b sm:border-b-0 sm:border-r border-neutral-100">
                <select
                  className="w-full px-5 py-4 text-sm text-neutral-400 bg-transparent outline-none appearance-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled>Standard</option>
                  <option>Standard</option>
                  <option>Deep Clean</option>
                  <option>Premium</option>
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* CTA Button */}
              <Link
                href="/booking"
                className="px-6 py-4 bg-brand-accent text-white text-sm font-semibold whitespace-nowrap text-center hover:bg-brand-accent-hover transition-colors duration-200"
              >
                Booking from $80
              </Link>
            </div>
          </div>
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
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        {/* Top Row: Title + Description */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-24 lg:mb-40">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-brand-primary leading-tight">
              Why Choose
              <br />
              Shield ?
            </h2>
          </div>
          <div className="lg:pt-2">
            <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
              We understand your home is important to you. That&apos;s
              why we focus on the quality of the clean. Our cleaners
              aren&apos;t contract workers - they are full-time employees.
              They care as much as we do.
            </p>
          </div>
        </div>

        {/* Feature Diamonds with Curve Path */}
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
      </div>
    </section>
  );
}

/* ── The Shield Report (Blog) Section ── */
function BlogSection() {
  const posts = [
    {
      title: "5 Easy & Effective Tips For A Hygenic Living Area",
      date: "Feb 20, 2026",
      readTime: "4 min read",
      image: "/images/blog-cleaning-tips.png",
    },
    {
      title: "How to Create a Self Cleaning Home",
      date: "Feb 15, 2026",
      readTime: "3 min read",
      image: "/images/blog-self-cleaning.png",
    },
    {
      title: "10 Easy Ways to Get Housekeeping Happy",
      date: "Feb 10, 2026",
      readTime: "5 min read",
      image: "/images/blog-housekeeping.png",
    },
  ];

  return (
    <section className="shield-report-section py-16 lg:py-24 relative overflow-hidden">
      {/* Subtle bg pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-2 border-white" />
        <div className="absolute bottom-10 right-16 w-60 h-60 rounded-full border-2 border-white" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full border border-white" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            The Shield Report
          </h2>
          <div className="w-12 h-1 bg-brand-accent mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post) => (
            <article
              key={post.title}
              className="group rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="aspect-[16/10] relative overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 lg:p-6">
                <h3 className="font-bold text-brand-primary text-sm sm:text-base leading-snug mb-3 group-hover:text-brand-accent transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <Link
                    href="/blog"
                    className="text-xs font-semibold text-brand-accent hover:text-brand-accent-hover transition-colors flex items-center gap-1"
                  >
                    Read More
                    <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <Button variant="primary" size="lg" href="/blog">
            Read Latest Blog
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ── CTA Banner ── */
function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cta-banner rounded-3xl px-8 py-12 lg:px-16 lg:py-16 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight">
              Servicing 100K+ Users Across Your City
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Join thousands of satisfied customers who trust Shield for their
              cleaning needs. Book your first clean today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                href="/booking"
                className="bg-white !text-brand-primary hover:bg-neutral-100 shadow-lg"
              >
                Book Now — It&apos;s Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                href="/about"
                className="!border-white/40 !text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>
          </div>
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
      <CTASection />
    </>
  );
}
