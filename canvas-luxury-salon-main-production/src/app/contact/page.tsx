import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return {
    title: "Contact",
    description: `Contact ${site.name} — ${site.address}`,
  };
}

const hours = [
  { day: "Monday – Friday", time: "10:00 — 19:00" },
  { day: "Saturday", time: "10:00 — 20:00" },
  { day: "Sunday", time: "By appointment" },
];

export default async function ContactPage() {
  const site = await getSiteContent();

  return (
    <ThemeScope scope="contact">
      <section className="aurora relative overflow-hidden px-4 pb-6 pt-[max(5.25rem,calc(env(safe-area-inset-top)+3.5rem))] sm:px-6 sm:pb-14 sm:pt-[max(8rem,env(safe-area-inset-top))] md:px-8 md:pb-20">
        <div className="relative z-10 mx-auto max-w-7xl">
          <Reveal blur>
            <p className="eyebrow">Say hello</p>
            <h1 className="mt-2.5 font-display text-[2.4rem] leading-[1.06] text-ink xs:text-5xl sm:mt-3 sm:text-6xl">
              Let’s plan your <span className="accent-gradient-text">look</span>
            </h1>
            <p className="mt-3.5 max-w-2xl text-sm leading-relaxed text-ink-soft sm:mt-5 sm:text-base">
              Reach us by call, WhatsApp, or email. We usually respond quickly
              and help you pick the right service slot.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <a
                href={`https://wa.me/${site.phoneDigits}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary w-full sm:w-auto"
              >
                WhatsApp us
              </a>
              <a
                href={`tel:+${site.phoneDigits}`}
                className="btn-ghost w-full sm:w-auto"
              >
                Call now
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-canvas-alt px-4 py-8 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <RevealGroup className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            <RevealItem className="h-full">
              <div className="h-full rounded-3xl border border-line bg-surface p-5 shadow-soft transition duration-500 hover:-translate-y-1.5 hover:border-accent/30 sm:p-7">
                <a
                  href={`tel:+${site.phoneDigits}`}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent transition hover:bg-accent hover:text-accent-fg"
                  aria-label={`Call ${site.phone}`}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-2.2 2.2z" />
                  </svg>
                </a>
                <h2 className="mt-5 font-display text-xl text-ink">Call</h2>
                <a
                  href={`tel:+${site.phoneDigits}`}
                  className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
                >
                  {site.phone}
                </a>
                <p className="mt-2 text-sm text-ink-soft">
                  Tap the phone icon or number to call.
                </p>
                <a
                  href={`https://wa.me/${site.phoneDigits}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#25D366]/35 bg-[#25D366]/10 px-4 py-2 text-xs font-semibold text-[#128C7E] transition hover:bg-[#25D366]/20"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                    <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4 0-.1-.2-.2-.5-.3zM12.1 21.2h0a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.9 9.9 0 0 1 12 2.1a9.9 9.9 0 0 1 9.9 9.9 9.9 9.9 0 0 1-9.8 9.2zm8.4-18.3A11.8 11.8 0 0 0 12 0 11.9 11.9 0 0 0 .2 11.9a11.8 11.8 0 0 0 1.6 5.9L0 24l6.3-1.7a11.9 11.9 0 0 0 5.7 1.4h0a11.9 11.9 0 0 0 11.9-11.9 11.8 11.8 0 0 0-3.5-8.4z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </RevealItem>

            <RevealItem className="h-full">
              <div className="h-full rounded-3xl border border-line bg-surface p-5 shadow-soft transition duration-500 hover:-translate-y-1.5 hover:border-accent/30 sm:p-7">
                <a
                  href={`mailto:${site.email}`}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent transition hover:bg-accent hover:text-accent-fg"
                  aria-label={`Email ${site.email}`}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z" />
                  </svg>
                </a>
                <h2 className="mt-5 font-display text-xl text-ink">Email</h2>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-3 inline-block break-all text-sm font-medium text-accent hover:underline"
                >
                  {site.email}
                </a>
                <p className="mt-2 text-sm text-ink-soft">
                  Tap the mail icon or address to open your email app.
                </p>
              </div>
            </RevealItem>

            <RevealItem className="h-full">
              <div className="h-full rounded-3xl border border-line bg-surface p-5 shadow-soft transition duration-500 hover:-translate-y-1.5 hover:border-accent/30 sm:p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-lg">
                  ⌖
                </span>
                <h2 className="mt-5 font-display text-xl text-ink">Service areas</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {site.address}
                </p>
              </div>
            </RevealItem>
          </RevealGroup>

          <div className="mt-5 grid gap-5 lg:grid-cols-5">
            <Reveal from="left" className="lg:col-span-2">
              <div className="h-full rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-9">
                <p className="eyebrow">Opening hours</p>
                <ul className="mt-6 divide-y divide-line">
                  {hours.map((h) => (
                    <li
                      key={h.day}
                      className="flex items-center justify-between py-3.5 text-sm"
                    >
                      <span className="text-ink-soft">{h.day}</span>
                      <span className="font-medium text-ink">{h.time}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 rounded-2xl bg-accent-soft p-5">
                  <p className="text-sm leading-relaxed text-accent-strong">
                    Home service available across Jhelum, Dina, and Gujrat — share
                    your address when booking.
                  </p>
                </div>

                <Link href="/book" className="btn-primary mt-7 w-full">
                  Book appointment
                </Link>
              </div>
            </Reveal>

            <Reveal from="right" delay={0.08} className="lg:col-span-3">
              <div className="h-full min-h-[280px] overflow-hidden rounded-3xl border border-line bg-surface shadow-soft sm:min-h-[380px]">
                <iframe
                  title={`Map — ${site.name}, ${site.address}`}
                  className="h-full min-h-[280px] w-full sm:min-h-[380px]"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(`${site.address}, Pakistan`)}&hl=en&z=12&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </ThemeScope>
  );
}
