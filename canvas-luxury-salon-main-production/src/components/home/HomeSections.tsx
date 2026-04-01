import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { HomeHeroAnimated } from "@/components/home/HomeHeroAnimated";
import { homeMakeupCards } from "@/lib/makeup-home-cards";
import { serviceCategories, site } from "@/lib/site";

const TestimonialSlider = dynamic(
  () =>
    import("@/components/home/TestimonialSlider").then((m) => ({
      default: m.TestimonialSlider,
    })),
  {
    loading: () => (
      <div
        className="mx-auto h-48 max-w-3xl animate-pulse rounded-3xl bg-white/[0.04]"
        aria-hidden
      />
    ),
  }
);

const galleryImages = [
  "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80",
  "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80",
  "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=600&q=80",
  "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80",
];

const steps = [
  { n: "01", title: "Book appointment", desc: "Share your date and preferred service." },
  { n: "02", title: "Trial setup", desc: "Optional trial for bridal and special events." },
  { n: "03", title: "Confirm booking", desc: "We confirm timing and personalize your plan." },
  { n: "04", title: "Enjoy service", desc: "Relax — our artists take care of the rest." },
];

export function HomeHero() {
  return <HomeHeroAnimated />;
}

/** Makeup feature row — matches salon “five pillars” with image, price, book CTA. */
export function HomeMakeupServices() {
  return (
    <section className="border-t border-white/5 bg-[#0a0a0a] px-5 py-12 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-center text-xs uppercase tracking-[0.35em] text-gold">
            Makeup services
          </p>
          <h2 className="mt-3 text-center font-display text-2xl text-white xs:text-3xl md:text-4xl">
            Signature looks for every celebration
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-white/70 sm:text-sm">
            Bridal, walima, and event artistry — priced clearly, booked in one step.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {homeMakeupCards.map((card, idx) => (
            <Reveal key={card.id} delay={idx * 0.06} scale>
              <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-gold">
                <div className="relative aspect-[5/7] sm:aspect-[4/6] md:aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2.5 p-3 md:p-4">
                    <span className="mx-auto inline-block rounded-full border border-gold/45 bg-black/65 px-3 py-1.5 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-gold-light backdrop-blur-sm md:text-[11px]">
                      {card.name}
                    </span>
                    <p className="text-center font-display text-sm text-gold-light md:text-base">
                      {card.price}
                    </p>
                    <Link
                      href={`/book?service=${encodeURIComponent(card.name)}`}
                      className="mt-0.5 w-full rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition hover:opacity-95"
                    >
                      Book now
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeServices() {
  return (
    <section className="border-t border-white/5 bg-[#0a0a0a] px-4 py-12 sm:px-6 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.35em] text-gold">Services</p>
          <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl md:text-5xl">
            Crafted for every occasion
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {serviceCategories.map((s, idx) => (
            <Reveal key={s.slug} delay={idx * 0.08} scale>
              <Link
                href={s.href}
                className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-gold"
              >
                <div className="relative aspect-[5/6] sm:aspect-[4/5] overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="font-display text-lg text-white sm:text-xl">{s.title}</h3>
                  <p className="mt-2 text-xs text-white/70 sm:text-sm">{s.short}</p>
                  <p className="mt-2 text-sm font-semibold text-gold-light">{s.price ?? "Competitive pricing available"}</p>
                  <span className="mt-4 inline-block text-xs uppercase tracking-[0.2em] text-gold opacity-0 transition group-hover:opacity-100">
                    View all →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeAbout() {
  return (
    <section className="border-t border-white/5 px-4 py-12 sm:px-6 md:px-8 md:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:gap-14 lg:grid-cols-2">
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
          <Image
            src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=900&q=80"
            alt="Salon interior"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Reveal>
        <div>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.35em] text-gold">About</p>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl md:text-5xl">
              Where elegance meets expertise
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-white/70 sm:text-base">
              Welcome to {site.name} — a full-service beauty destination led by
              specialists with over a decade of experience. We focus on clean,
              luminous skin, tailored hair design, and makeup that enhances your
              natural features for weddings, celebrations, and everyday confidence.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-block text-xs uppercase tracking-[0.25em] text-gold underline-offset-4 hover:underline"
            >
              Our story
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function HomeWhy() {
  const reasons = [
    { title: "Experienced staff", desc: "Senior artists across hair, skin, and makeup." },
    { title: "Premium products", desc: "Editorial-grade formulas chosen for longevity." },
    { title: "Customer satisfaction", desc: "Consultative care with meticulous finishing." },
  ];
  return (
    <section className="border-t border-white/5 bg-gradient-to-b from-black to-[#0f0f0f] px-4 py-12 sm:px-6 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">Why us</p>
          <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl md:text-5xl">
            The Huma standard
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-8 md:grid-cols-3">
          {reasons.map((r, idx) => (
            <Reveal key={r.title} delay={idx * 0.1} scale>
              <div className="glass-panel h-full rounded-2xl p-6 text-center transition duration-500 hover:-translate-y-1 hover:border-gold/30 sm:p-8">
                <span className="font-display text-3xl text-gold/80">{idx + 1}</span>
                <h3 className="mt-4 font-display text-2xl text-white">{r.title}</h3>
                <p className="mt-3 text-sm text-white/70">{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeSteps() {
  return (
    <section className="border-t border-white/5 px-4 py-12 sm:px-6 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.35em] text-gold">Process</p>
          <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl md:text-5xl">
            Your journey
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => (
            <Reveal key={s.n} delay={idx * 0.08}>
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 pt-10 transition hover:border-gold/25">
                <span className="absolute left-6 top-0 -translate-y-1/2 rounded-full border border-gold/40 bg-black px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
                  Step {s.n}
                </span>
                <h3 className="font-display text-xl text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-white/70">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeGallery() {
  return (
    <section className="border-t border-white/5 bg-[#080808] px-4 py-12 sm:px-6 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Portfolio</p>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl md:text-5xl">
              Moments of glow
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="text-xs uppercase tracking-[0.25em] text-gold hover:underline"
          >
            View full gallery
          </Link>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-2 sm:mt-12 sm:gap-3 md:grid-cols-3 lg:gap-4">
          {galleryImages.map((src, idx) => (
            <Reveal key={src} delay={(idx % 3) * 0.06} scale className="group relative aspect-square overflow-hidden rounded-xl border border-white/10">
              <Image
                src={src}
                alt={`${site.name} portfolio preview ${idx + 1} of ${galleryImages.length}`}
                fill
                className="object-cover transition duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeOffers() {
  return (
    <section className="border-t border-white/5 px-4 py-12 sm:px-6 md:px-8 md:py-20">
      <Reveal scale>
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/15 via-black to-nude-deep/10 p-6 text-center animate-glow-soft sm:p-10 md:p-16">
          <p className="text-xs uppercase tracking-[0.4em] text-gold-light">
            Limited offer
          </p>
          <p className="mt-4 font-display text-4xl text-white xs:text-5xl md:text-7xl">25% OFF</p>
          <p className="mt-4 text-white/70">
            Professional makeup services — reserve your slot this season.
          </p>
          <Link
            href="/book"
            className="mt-8 inline-flex rounded-full bg-white px-10 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-nude-muted"
          >
            Reserve your spot
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

export function HomeTestimonials() {
  return (
    <section className="border-t border-white/5 px-4 py-12 sm:px-6 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">Testimonials</p>
          <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl md:text-5xl">
            Loved by our clients
          </h2>
        </Reveal>
        <div className="mt-14">
          <TestimonialSlider />
        </div>
      </div>
    </section>
  );
}

export function HomeCta() {
  const trustPoints = [
    "Certified staff",
    "Hygiene protocol",
    "Premium products",
    "On-time slots",
  ] as const;
  const proof = [
    { name: "Areeba K.", event: "Bridal", line: "Makeup stayed flawless for 12+ hours." },
    { name: "Hina M.", event: "Party", line: "Quick service, polished look, right on time." },
  ] as const;

  return (
    <section className="border-t border-white/5 px-4 py-16 sm:px-6 md:px-8 md:py-20">
      <Reveal>
        <div className="mx-auto mb-8 grid max-w-5xl gap-3 sm:mb-10 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((point) => (
            <div
              key={point}
              className="flex min-h-[44px] items-center justify-center rounded-full border border-white/12 bg-white/[0.02] px-4 py-2 text-center text-xs uppercase tracking-[0.18em] text-white/85"
            >
              {point}
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal>
        <div className="mx-auto mb-8 grid max-w-5xl gap-3 sm:mb-10 sm:grid-cols-2">
          {proof.map((p) => (
            <div key={p.name} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
              <p className="text-sm text-white/80">{p.line}</p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-gold">
                {p.name} · {p.event}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal scale>
        <div className="mx-auto flex max-w-5xl flex-col items-center rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-12 text-center backdrop-blur-xl sm:px-8 sm:py-16 md:py-20">
          <h2 className="font-display text-2xl text-white xs:text-3xl md:text-5xl">
            Book your appointment now
          </h2>
          <p className="mt-4 max-w-md text-sm text-white/70">
            Tell us your preferred date — we will confirm within 48 hours.
          </p>
          <Link
            href="/book"
            className="mt-8 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-12 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-black"
          >
            Schedule visit
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
