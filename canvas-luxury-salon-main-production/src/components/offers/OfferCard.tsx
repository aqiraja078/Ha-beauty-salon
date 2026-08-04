import Link from "next/link";
import { bookingUrl } from "@/lib/booking-prefill";

export type OfferCardData = {
  id: string;
  badge: string;
  title: string;
  titleAccent: string;
  body: string;
  includes: string[];
  price: string;
  ctaLabel: string;
  ctaHref: string;
};

type Props = {
  offer: OfferCardData;
  /** Larger layout for /offers page */
  featured?: boolean;
  contactHref?: string;
  contactLabel?: string;
};

function offerBookHref(offer: OfferCardData): string {
  const href = offer.ctaHref || "/book";
  if (!href.startsWith("/book")) return href;
  try {
    const url = new URL(href, "https://ha.local");
    const existing = url.searchParams.get("service");
    if (!existing) {
      const label = `${offer.title} ${offer.titleAccent}`.replace(/\s+/g, " ").trim();
      if (label) url.searchParams.set("service", label);
    }
    if (!url.searchParams.get("price") && offer.price) {
      url.searchParams.set("price", offer.price);
    }
    const q = url.searchParams.toString();
    return q ? `/book?${q}` : "/book";
  } catch {
    return bookingUrl(
      `${offer.title} ${offer.titleAccent}`.trim(),
      offer.price
    );
  }
}

export function OfferCard({
  offer,
  featured = false,
  contactHref = "/contact",
  contactLabel = "Ask HA",
}: Props) {
  const bookHref = offerBookHref(offer);
  return (
    <article
      className={`card-surface aurora relative flex h-full flex-col overflow-hidden ${
        featured ? "p-4 sm:p-7" : "p-4 sm:p-5"
      }`}
    >
      <div className="relative z-10 flex h-full flex-col">
        <span className="inline-flex w-fit items-center rounded-full border border-accent/25 bg-accent-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
          {offer.badge}
        </span>

        <h3
          className={`mt-3 font-display leading-tight text-ink sm:mt-3.5 ${
            featured
              ? "text-[1.6rem] xs:text-3xl sm:text-4xl md:text-[2.75rem]"
              : "text-[1.35rem] sm:text-[1.55rem]"
          }`}
        >
          {offer.title}{" "}
          <span className="accent-gradient-text">{offer.titleAccent}</span>
        </h3>

        <p
          className={`mt-2 text-sm leading-snug text-ink-soft ${
            featured ? "sm:mt-2.5 sm:leading-relaxed sm:text-base" : ""
          }`}
        >
          {offer.body}
        </p>

        {offer.includes.length > 0 ? (
          <ul className="mt-3 space-y-1.5 border-t border-line pt-3 sm:mt-3.5">
            <li className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
              Package includes
            </li>
            {offer.includes.map((line) => (
              <li
                key={line}
                className="flex gap-2 text-sm leading-snug text-ink-soft"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-3 flex flex-wrap items-end justify-between gap-2 border-t border-line pt-3 sm:mt-3.5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
              Package price
            </p>
            <p className="mt-0.5 font-display text-xl text-accent sm:text-2xl">
              {offer.price}
            </p>
          </div>
        </div>

        <div
          className={`mt-3.5 flex gap-2 sm:mt-4 sm:gap-2.5 ${
            featured ? "flex-row items-center" : "flex-col"
          }`}
        >
          <Link
            href={bookHref}
            className={`btn-primary w-full ${
              featured
                ? "min-w-0 flex-1 px-3 text-[10px] tracking-[0.12em] xs:px-4 xs:text-[11px] sm:w-auto sm:flex-none sm:px-8 sm:tracking-[0.2em]"
                : ""
            }`}
          >
            {offer.ctaLabel}
          </Link>
          {featured ? (
            <Link
              href={contactHref}
              className="btn-ghost min-w-0 flex-1 px-3 text-[10px] tracking-[0.12em] xs:px-4 xs:text-[11px] sm:w-auto sm:flex-none sm:px-8 sm:tracking-[0.2em]"
            >
              {contactLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
