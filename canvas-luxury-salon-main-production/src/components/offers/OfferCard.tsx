import Link from "next/link";

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

export function OfferCard({
  offer,
  featured = false,
  contactHref = "/contact",
  contactLabel = "Ask HA",
}: Props) {
  return (
    <article
      className={`card-surface aurora relative flex h-full flex-col overflow-hidden ${
        featured ? "p-5 sm:p-9" : "p-5 sm:p-6"
      }`}
    >
      <div className="relative z-10 flex h-full flex-col">
        <span className="inline-flex w-fit items-center rounded-full border border-accent/25 bg-accent-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
          {offer.badge}
        </span>

        <h3
          className={`mt-4 font-display leading-tight text-ink sm:mt-5 ${
            featured
              ? "text-[1.75rem] xs:text-3xl sm:text-4xl md:text-5xl"
              : "text-2xl sm:text-[1.65rem]"
          }`}
        >
          {offer.title}{" "}
          <span className="accent-gradient-text">{offer.titleAccent}</span>
        </h3>

        <p
          className={`mt-3 text-sm leading-relaxed text-ink-soft ${
            featured ? "sm:text-base" : ""
          }`}
        >
          {offer.body}
        </p>

        {offer.includes.length > 0 ? (
          <ul className="mt-5 space-y-2 border-t border-line pt-4">
            <li className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
              Package includes
            </li>
            {offer.includes.map((line) => (
              <li
                key={line}
                className="flex gap-2 text-sm leading-snug text-ink-soft"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
              Package price
            </p>
            <p className="mt-1 font-display text-2xl text-accent sm:text-[1.75rem]">
              {offer.price}
            </p>
          </div>
        </div>

        <div
          className={`mt-6 flex flex-col gap-3 ${
            featured ? "sm:flex-row" : ""
          }`}
        >
          <Link
            href={offer.ctaHref}
            className={`btn-primary w-full ${featured ? "sm:w-auto" : ""}`}
          >
            {offer.ctaLabel}
          </Link>
          {featured ? (
            <Link href={contactHref} className="btn-ghost w-full sm:w-auto">
              {contactLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
