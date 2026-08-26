import type { Metadata } from "next";
import Link from "next/link";
import nextDynamic from "next/dynamic";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { getSiteContent } from "@/lib/content-store";
import { serviceCategories, whatsappBookUrl } from "@/lib/site";

const BookingGuideVideo = nextDynamic(
  () =>
    import("@/components/booking/BookingGuideVideo").then((m) => ({
      default: m.BookingGuideVideo,
    })),
  {
    loading: () => (
      <div
        className="mx-auto h-[420px] max-w-5xl animate-pulse rounded-3xl bg-canvas-alt"
        aria-hidden
      />
    ),
  }
);

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return {
    title: "How to book",
    description: `Learn how to book hair, makeup, facial, and wax services with ${site.name} in Jhelum, Dina, and Gujrat.`,
  };
}

const STEPS = [
  {
    n: "01",
    title: "Choose a service",
    desc: "Open a menu below or pick from the booking form — single service or multi (bridal week).",
  },
  {
    n: "02",
    title: "Add area, date & time",
    desc: "Select Jhelum, Dina, or Gujrat, then your preferred day and slot.",
  },
  {
    n: "03",
    title: "Send the form",
    desc: "Tap Send now — your request is saved and WhatsApp opens with the details.",
  },
  {
    n: "04",
    title: "We confirm in 48h",
    desc: "Our team replies with your slot, travel plan, and any length or package notes.",
  },
  {
    n: "05",
    title: "We come to you",
    desc: "Setup at home — you stay with family while we finish the look.",
  },
] as const;

const TIPS = [
  {
    q: "Can I book more than one service?",
    a: "Yes — choose Multi service on the booking form for bridal week or stacked looks.",
  },
  {
    q: "Are menu prices final?",
    a: "“From” prices are starting points. Length or add-ons are confirmed before we start.",
  },
  {
    q: "What if my time is taken?",
    a: "The form checks busy slots. Pick another time if that one is already booked.",
  },
] as const;

export default async function HowToBookPage() {
  const site = await getSiteContent();
  const waHref = whatsappBookUrl(undefined, {
    name: site.name,
    phoneDigits: site.phoneDigits,
  });

  return (
    <ThemeScope scope="book">
      <section className="aurora relative overflow-hidden px-4 pb-8 pt-[max(5.25rem,calc(env(safe-area-inset-top)+3.5rem))] sm:px-6 sm:pb-14 sm:pt-[max(8rem,env(safe-area-inset-top))] md:px-8 md:pb-16">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Reveal blur>
            <p className="eyebrow">{site.name}</p>
            <h1 className="mt-2.5 font-display text-[2.35rem] leading-[1.06] text-ink xs:text-5xl sm:mt-3 sm:text-6xl">
              How to{" "}
              <span className="accent-gradient-text">book</span>
            </h1>
            <p className="mx-auto mt-3.5 max-w-xl text-sm leading-relaxed text-ink-soft sm:mt-5 sm:text-base">
              Pick a service, fill the form, and we confirm your home visit —
              Jhelum, Dina, or Gujrat.
            </p>
            <div className="mx-auto mt-6 flex w-full max-w-md flex-row items-center gap-2 sm:mt-8 sm:max-w-none sm:justify-center sm:gap-3">
              <Link
                href="/book"
                className="btn-primary min-w-0 flex-1 px-3 text-[10px] tracking-[0.12em] xs:px-4 xs:text-[11px] sm:w-auto sm:flex-none sm:px-8 sm:tracking-[0.2em]"
              >
                Book now
              </Link>
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost inline-flex min-w-0 flex-1 items-center justify-center gap-2 px-3 text-[10px] tracking-[0.12em] xs:px-4 xs:text-[11px] sm:w-auto sm:flex-none sm:px-8 sm:tracking-[0.2em]"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0 fill-current"
                  aria-hidden
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-canvas px-4 py-10 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <BookingGuideVideo siteName={site.name} />
      </section>

      <section className="border-t border-line bg-canvas-alt px-4 py-10 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal blur>
            <p className="eyebrow">Where to book</p>
            <h2 className="mt-2 font-display text-[1.75rem] leading-tight text-ink sm:text-4xl">
              Three easy ways
            </h2>
            <div
              className="mt-3 h-[3px] w-16 rounded-full bg-gradient-to-r from-accent to-tint"
              aria-hidden
            />
          </Reveal>

          <RevealGroup className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-5">
            <RevealItem className="h-full">
              <Link
                href="/book"
                className="card-interactive group flex h-full flex-col px-5 py-6 sm:px-6"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                  Best
                </span>
                <h3 className="mt-3 font-display text-2xl text-ink">
                  Booking form
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                  Choose service, area, date, and time — then send. Preferred
                  for a clear slot.
                </p>
                <span className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted transition group-hover:text-accent">
                  Open form →
                </span>
              </Link>
            </RevealItem>

            <RevealItem className="h-full">
              <div className="card-surface flex h-full flex-col px-5 py-6 sm:px-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gilt">
                  Browse
                </span>
                <h3 className="mt-3 font-display text-2xl text-ink">
                  Service menus
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                  Open Hair, Makeup, Facial, and more — tap Book on the service
                  you want.
                </p>
                <span className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  See menus below
                </span>
              </div>
            </RevealItem>

            <RevealItem className="h-full">
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="card-interactive group flex h-full flex-col px-5 py-6 sm:px-6"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                  Chat
                </span>
                <h3 className="mt-3 font-display text-2xl text-ink">WhatsApp</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                  Message us for questions, trials, or a quick booking when you
                  prefer chat.
                </p>
                <span className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted transition group-hover:text-accent">
                  Message →
                </span>
              </a>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      <section className="bg-canvas px-4 py-10 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal blur>
            <p className="eyebrow">What you can book</p>
            <h2 className="mt-2 font-display text-[1.75rem] leading-tight text-ink sm:text-4xl">
              All six menus
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
              Every menu service can be booked online. Pick a category, then
              Book this or open the full menu.
            </p>
            <div
              className="mt-3 h-[3px] w-16 rounded-full bg-gradient-to-r from-accent to-tint"
              aria-hidden
            />
          </Reveal>

          <RevealGroup className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {serviceCategories.map((c) => (
              <RevealItem key={c.slug} className="h-full">
                <div className="card-surface flex h-full flex-col p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl text-ink sm:text-2xl">
                      {c.title}
                    </h3>
                    <span className="shrink-0 text-[11px] font-semibold text-accent">
                      {c.price}
                    </span>
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-snug text-ink-soft">
                    {c.short}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4">
                    <Link
                      href={c.href}
                      className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted transition hover:text-accent"
                    >
                      View menu
                    </Link>
                    <Link
                      href={`/book?service=${encodeURIComponent(c.title)}`}
                      className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent transition hover:text-accent-strong"
                    >
                      Book this →
                    </Link>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="border-t border-line bg-canvas-alt px-4 py-10 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal blur className="text-center">
            <p className="eyebrow">Step by step</p>
            <h2 className="mt-2 font-display text-[1.75rem] leading-tight text-ink sm:text-4xl">
              From form to home visit
            </h2>
            <div
              className="mx-auto mt-3 h-[3px] w-16 rounded-full bg-gradient-to-r from-accent to-tint"
              aria-hidden
            />
          </Reveal>

          <RevealGroup className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
            {STEPS.map((s) => (
              <RevealItem key={s.n} className="h-full">
                <div className="card-interactive relative h-full px-5 pb-5 pt-9 sm:px-6 sm:pb-6 sm:pt-10">
                  <span className="absolute left-5 top-0 -translate-y-1/2 rounded-full bg-accent px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-fg shadow-lift sm:left-6">
                    Step {s.n}
                  </span>
                  <h3 className="font-display text-lg text-ink sm:text-xl">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                    {s.desc}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-canvas px-4 py-10 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal blur>
            <p className="eyebrow">Good to know</p>
            <h2 className="mt-2 font-display text-[1.75rem] leading-tight text-ink sm:text-4xl">
              Quick answers
            </h2>
            <div
              className="mt-3 h-[3px] w-16 rounded-full bg-gradient-to-r from-accent to-tint"
              aria-hidden
            />
          </Reveal>

          <RevealGroup className="mt-8 space-y-3 sm:mt-10">
            {TIPS.map((t) => (
              <RevealItem key={t.q}>
                <div className="rounded-2xl border border-line bg-surface px-5 py-4 sm:px-6 sm:py-5">
                  <h3 className="text-sm font-semibold text-ink sm:text-base">
                    {t.q}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                    {t.a}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="border-t border-line bg-canvas-alt px-4 py-10 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <Reveal scale>
          <div className="card-surface aurora relative mx-auto flex max-w-3xl flex-col items-center overflow-hidden px-5 py-10 text-center sm:px-10 sm:py-14">
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="font-display text-[1.85rem] leading-tight text-ink xs:text-3xl md:text-4xl">
                Ready when you are
              </h2>
              <p className="mt-3 max-w-md text-sm text-ink-soft sm:mt-4 sm:text-base">
                Start on the booking form, or message us on WhatsApp if you want
                help choosing.
              </p>
              <div className="mt-6 flex w-full max-w-md flex-row items-center gap-2 sm:mt-8 sm:w-auto sm:gap-3">
                <Link
                  href="/book"
                  className="btn-primary min-w-0 flex-1 px-3 text-[10px] tracking-[0.12em] xs:px-4 xs:text-[11px] sm:w-auto sm:flex-none sm:px-8 sm:tracking-[0.2em]"
                >
                  Book appointment
                </Link>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost min-w-0 flex-1 px-3 text-[10px] tracking-[0.12em] xs:px-4 xs:text-[11px] sm:w-auto sm:flex-none sm:px-8 sm:tracking-[0.2em]"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </ThemeScope>
  );
}
