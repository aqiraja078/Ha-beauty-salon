import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { HomeHeroAnimated } from "@/components/home/HomeHeroAnimated";
import type { HomeContent } from "@/lib/cms-types";
import { canOptimizeImage } from "@/lib/image-host";
import { parseVideoEmbed, type GalleryItem } from "@/lib/gallery-types";
import { whatsappBookUrl } from "@/lib/site";

const TestimonialSlider = dynamic(
  () =>
    import("@/components/home/TestimonialSlider").then((m) => ({
      default: m.TestimonialSlider,
    })),
  {
    loading: () => (
      <div
        className="mx-auto h-56 max-w-3xl animate-pulse rounded-3xl bg-canvas-alt"
        aria-hidden
      />
    ),
  }
);

const OffersSlider = dynamic(
  () =>
    import("@/components/offers/OffersSlider").then((m) => ({
      default: m.OffersSlider,
    })),
  {
    loading: () => (
      <div
        className="h-72 animate-pulse rounded-3xl bg-canvas-alt sm:h-80"
        aria-hidden
      />
    ),
  }
);

const sectionPad = "px-4 py-8 sm:px-6 sm:py-16 md:px-8 md:py-24";

function SectionHeading({
  eyebrow,
  title,
  lead,
  center,
  titleClassName,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  center?: boolean;
  titleClassName?: string;
}) {
  return (
    <Reveal blur className={center ? "text-center" : undefined}>
      <p className="eyebrow">{eyebrow}</p>
      <h2
        className={`mt-2 font-display leading-[1.12] text-ink sm:mt-3 ${
          titleClassName ??
          "text-[2rem] sm:text-4xl md:text-[2.75rem]"
        }`}
      >
        {title}
      </h2>
      <div
        className={`mt-3 h-[3px] w-16 rounded-full bg-gradient-to-r from-accent to-tint sm:mt-4 ${
          center ? "mx-auto" : ""
        }`}
        aria-hidden
      />
      {lead ? (
        <p
          className={`mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft sm:mt-4 sm:text-base ${
            center ? "mx-auto" : ""
          }`}
        >
          {lead}
        </p>
      ) : null}
    </Reveal>
  );
}

export function HomePageSections({
  home,
  siteName,
  phoneDigits,
  galleryItems,
}: {
  home: HomeContent;
  siteName: string;
  phoneDigits: string;
  /** First published /gallery items (max 6). The home gallery block is hidden when empty. */
  galleryItems?: GalleryItem[];
}) {
  const homeGallery: GalleryItem[] =
    galleryItems && galleryItems.length > 0
      ? galleryItems.slice(0, 6)
      : [];
  const aboutBody = home.about.body.replaceAll("{name}", siteName);
  const whatsappHref = whatsappBookUrl(undefined, {
    name: siteName,
    phoneDigits,
  });

  return (
    <>
      <HomeHeroAnimated
        siteName={siteName}
        hero={home.hero}
        whatsappHref={whatsappHref}
      />

      <section className={`bg-canvas-alt ${sectionPad}`}>
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            center
            eyebrow={home.makeupSection.eyebrow}
            title={home.makeupSection.title}
            lead={home.makeupSection.lead}
          />

          <RevealGroup
            className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
            stagger={0.07}
          >
            {home.makeupSection.cards.map((card) => (
              <RevealItem key={card.id} className="h-full">
                <article className="card-interactive group flex h-full flex-col overflow-hidden">
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.name}
                      fill
                      className="object-cover transition duration-[900ms] group-hover:scale-[1.07]"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 30vw, 18vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-70 transition group-hover:opacity-90" />
                  </div>

                  <div className="card-body">
                    <h3 className="font-display text-xl text-ink">{card.name}</h3>
                    <p className="mt-2 flex-1 text-sm font-semibold text-accent">
                      {card.price}
                    </p>
                    <Link
                      href={`/book?service=${encodeURIComponent(card.name)}${
                        card.price
                          ? `&price=${encodeURIComponent(card.price)}`
                          : ""
                      }`}
                      className="mt-5 inline-flex min-h-[42px] w-full items-center justify-center rounded-full border border-accent/25 bg-accent-soft text-[10px] font-semibold uppercase tracking-[0.18em] text-accent transition duration-300 hover:bg-accent hover:text-accent-fg"
                    >
                      Book now
                    </Link>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-canvas px-4 py-6 sm:px-6 sm:py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-3 text-center">
            <SectionHeading
              center
              eyebrow={home.offers.eyebrow}
              title={home.offers.title}
              lead={home.offers.lead}
              titleClassName="whitespace-nowrap text-[1.35rem] xs:text-[1.55rem] sm:text-4xl md:text-[2.75rem]"
            />
            <Reveal delay={0.05}>
              <Link
                href="/sales"
                className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent"
              >
                View all sales
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>
          </div>

          <div className="mt-5 sm:mt-8">
            <OffersSlider items={home.offers.items} />
          </div>
        </div>
      </section>

      <section className={`bg-canvas-alt ${sectionPad}`}>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow={home.servicesSection.eyebrow}
              title={home.servicesSection.title}
              lead={home.servicesSection.lead}
              titleClassName="whitespace-nowrap text-[1.15rem] xs:text-[1.4rem] sm:text-4xl md:text-[2.75rem]"
            />
            <Reveal delay={0.1} from="right">
              <Link
                href="/services/hair"
                className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent"
              >
                View all menus
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>
          </div>

          <RevealGroup className="mt-8 sm:mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {home.servicesSection.categories.map((s, index) => (
              <RevealItem key={s.slug} className="h-full">
                <Link
                  href={s.href}
                  className="group flex h-full flex-col rounded-[1.5rem] bg-surface p-2.5 shadow-[0_1px_0_rgb(var(--gilt)/0.35),0_18px_40px_-28px_rgb(var(--ink)/0.45)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_1px_0_rgb(var(--gilt)/0.7),0_28px_50px_-24px_rgb(var(--accent)/0.35)]"
                >
                  <div className="relative aspect-[5/4] overflow-hidden rounded-[1.1rem]">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <span className="absolute left-3 top-3 inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-surface/90 px-2 text-[10px] font-semibold tracking-[0.18em] text-accent backdrop-blur-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-accent text-sm text-accent-fg opacity-0 shadow-lift transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      →
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col px-2.5 pb-3 pt-4 sm:px-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-[1.45rem] leading-none text-ink sm:text-[1.6rem]">
                        {s.title}
                      </h3>
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gilt transition group-hover:scale-125"
                        aria-hidden
                      />
                    </div>
                    <p className="mt-2 flex-1 text-[13px] leading-snug text-ink-soft">
                      {s.short}
                    </p>
                    <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-accent">
                      {s.price || "On request"}
                    </p>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className={`bg-canvas-alt ${sectionPad}`}>
        <div className="mx-auto grid max-w-7xl items-center gap-8 md:gap-16 lg:grid-cols-2">
          <Reveal from="left" className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line shadow-soft">
              <Image
                src={home.about.image}
                alt="Salon interior"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="card-surface absolute -bottom-6 -right-2 hidden px-6 py-5 sm:block lg:-right-6">
              <p className="font-display text-3xl text-accent">
                {home.about.badgeValue}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted">
                {home.about.badgeLabel}
              </p>
            </div>
          </Reveal>

          <Reveal from="right" delay={0.08}>
            <p className="eyebrow">{home.about.eyebrow}</p>
            <h2 className="mt-3 whitespace-nowrap font-display text-[1.35rem] leading-[1.12] text-ink xs:text-[1.55rem] sm:text-4xl md:text-[2.75rem]">
              {home.about.title}
            </h2>
            <div
              className="mt-5 h-[3px] w-16 rounded-full bg-gradient-to-r from-accent to-tint"
              aria-hidden
            />
            <p className="mt-6 text-sm leading-relaxed text-ink-soft sm:text-base">
              {aboutBody}
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {home.about.bullets.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink-soft"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[10px] font-bold text-accent">
                    ✓
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className={`bg-canvas ${sectionPad}`}>
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            center
            eyebrow={home.why.eyebrow}
            title={home.why.title}
          />

          <RevealGroup className="mt-10 sm:mt-14 grid gap-6 md:grid-cols-3 md:gap-5" stagger={0.1}>
            {home.why.reasons.map((r, idx) => (
              <RevealItem key={r.title} className="h-full">
                <div className="card-interactive relative h-full px-6 pb-6 pt-10">
                  <span className="absolute left-6 top-0 -translate-y-1/2 rounded-full bg-accent px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-fg shadow-lift">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl text-ink sm:text-2xl">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {r.desc}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className={`bg-canvas-alt ${sectionPad}`}>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow={home.steps.eyebrow}
              title={home.steps.title}
              lead={home.steps.lead}
              titleClassName="whitespace-nowrap text-[1.35rem] xs:text-[1.55rem] sm:text-4xl md:text-[2.75rem]"
            />
            <Reveal delay={0.1} from="right">
              <Link
                href="/how-to-book"
                className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent"
              >
                Full booking guide
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>
          </div>

          <RevealGroup className="mt-10 sm:mt-14 grid gap-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {home.steps.items.map((s) => (
              <RevealItem key={s.n} className="h-full">
                <div className="card-interactive relative h-full px-6 pb-6 pt-10">
                  <span className="absolute left-6 top-0 -translate-y-1/2 rounded-full bg-accent px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-fg shadow-lift">
                    Step {String(s.n).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl text-ink">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {s.desc}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {homeGallery.length > 0 ? (
      <section className={`bg-canvas ${sectionPad}`}>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow={home.gallery.eyebrow}
              title={home.gallery.title}
              titleClassName="whitespace-nowrap text-[1.25rem] xs:text-[1.5rem] sm:text-4xl md:text-[2.75rem]"
            />
            <Reveal delay={0.1} from="right">
              <Link
                href="/gallery"
                className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent"
              >
                View full gallery
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>
          </div>

          <RevealGroup
            className="mt-8 sm:mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4"
            stagger={0.06}
          >
            {homeGallery.map((item, idx) => {
              const embed =
                item.type === "video" ? parseVideoEmbed(item.src) : null;
              const still =
                item.type === "image"
                  ? item.src
                  : item.poster ||
                    (embed?.kind === "youtube"
                      ? `https://img.youtube.com/vi/${embed.id}/hqdefault.jpg`
                      : "");
              const label =
                item.title || `${siteName} portfolio preview ${idx + 1}`;
              return (
                <RevealItem
                  key={item.id}
                  className={
                    idx === 0 || idx === 5
                      ? "col-span-2 md:col-span-1"
                      : undefined
                  }
                >
                  <Link
                    href="/gallery"
                    aria-label={`${label} — open gallery`}
                    className="card-media group relative block aspect-square"
                  >
                    {still ? (
                      <Image
                        src={still}
                        alt={label}
                        fill
                        unoptimized={!canOptimizeImage(still)}
                        className="object-cover transition duration-[900ms] group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    ) : embed?.kind === "file" ? (
                      <video
                        src={`${item.src}#t=0.1`}
                        muted
                        playsInline
                        preload="metadata"
                        aria-label={label}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-surface" />
                    )}
                    {item.type === "video" ? (
                      <span
                        className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent/70 bg-canvas/70 text-accent backdrop-blur-sm"
                        aria-hidden
                      >
                        <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor">
                          <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11-6.86a1 1 0 0 0 0-1.7l-11-6.86A1 1 0 0 0 8 5.14z" />
                        </svg>
                      </span>
                    ) : null}
                    <div className="pointer-events-none absolute inset-0 bg-accent/0 transition duration-500 group-hover:bg-accent/15" />
                  </Link>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>
      ) : null}

      <section className={`bg-canvas ${sectionPad}`}>
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            center
            eyebrow={home.testimonials.eyebrow}
            title={home.testimonials.title}
          />
          <div className="mt-6 sm:mt-8">
            <TestimonialSlider items={home.testimonials.items} />
          </div>
        </div>
      </section>

      <section className={`bg-canvas-alt ${sectionPad}`}>
        <RevealGroup className="mx-auto mb-6 grid max-w-5xl grid-cols-2 gap-2 sm:mb-10 sm:gap-3 lg:grid-cols-4">
          {home.cta.trustPoints.map((point) => (
            <RevealItem key={point}>
              <div className="flex min-h-[44px] items-center justify-center rounded-full border border-line bg-surface px-2 py-2 text-center text-[9px] font-medium uppercase tracking-[0.12em] text-ink-soft xs:px-3 xs:text-[10px] sm:min-h-[48px] sm:px-4 sm:py-2.5 sm:text-[11px] sm:tracking-[0.16em]">
                {point}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <RevealGroup className="mx-auto mb-6 grid max-w-5xl gap-4 sm:mb-10 sm:grid-cols-2">
          {home.cta.proof.map((p) => (
            <RevealItem key={p.name}>
              <figure className="card-interactive h-full p-6">
                <blockquote className="text-sm leading-relaxed text-ink-soft">
                  “{p.line}”
                </blockquote>
                <figcaption className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                  {p.name} · {p.event}
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal scale>
          <div className="card-surface aurora relative mx-auto flex max-w-5xl flex-col items-center overflow-hidden px-5 py-10 text-center sm:px-10 sm:py-20">
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="font-display text-[1.85rem] leading-tight text-ink xs:text-3xl md:text-5xl">
                {home.cta.title}
              </h2>
              <p className="mt-4 max-w-md text-sm text-ink-soft sm:mt-5 sm:text-base">
                {home.cta.subcopy}
              </p>
              <div className="mt-6 flex w-full flex-row items-center gap-2 sm:mt-9 sm:w-auto sm:gap-3">
                <Link
                  href={home.cta.primaryCta.href}
                  className="btn-primary min-w-0 flex-1 px-3 text-[10px] tracking-[0.12em] xs:px-4 xs:text-[11px] sm:w-auto sm:flex-none sm:px-8 sm:tracking-[0.2em]"
                >
                  {home.cta.primaryCta.label}
                </Link>
                <Link
                  href={home.cta.secondaryCta.href}
                  className="btn-ghost min-w-0 flex-1 px-3 text-[10px] tracking-[0.12em] xs:px-4 xs:text-[11px] sm:w-auto sm:flex-none sm:px-8 sm:tracking-[0.2em]"
                >
                  {home.cta.secondaryCta.label}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
