"use client";

import Link from "next/link";
import { useState } from "react";
import {
  HAIR_LENGTH_LABELS,
  type HairLength,
  type HairLengthPrices,
} from "@/lib/hair-length-pricing";
import { bookingUrl } from "@/lib/booking-prefill";

type Props = {
  name: string;
  blurb: string;
  price: string;
  meta?: string;
  lengthPrices?: HairLengthPrices;
};

const lengths: HairLength[] = ["short", "medium", "long"];

export function ServiceMenuCard({
  name,
  blurb,
  price,
  meta,
  lengthPrices,
}: Props) {
  const [length, setLength] = useState<HairLength>("medium");
  const displayPrice = lengthPrices ? lengthPrices[length] : price;
  const bookService = lengthPrices
    ? `${name} (${HAIR_LENGTH_LABELS[length]})`
    : name;
  const bookHref = bookingUrl(bookService, displayPrice);

  return (
    <article className="flex h-full flex-col rounded-3xl border border-line bg-surface p-5 shadow-soft transition duration-500 hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-lift-lg sm:p-6">
      <h3 className="font-display text-lg leading-snug text-ink sm:text-xl">
        {name}
      </h3>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-soft">
        {blurb}
      </p>

      {lengthPrices ? (
        <div className="mt-5 border-t border-line pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            Select length
          </p>
          <div
            className="mt-3 grid grid-cols-3 gap-2"
            role="group"
            aria-label={`Hair length for ${name}`}
          >
            {lengths.map((key) => {
              const active = length === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setLength(key)}
                  aria-pressed={active}
                  className={`min-h-[40px] rounded-full border px-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition duration-300 active:scale-[0.98] ${
                    active
                      ? "border-accent/40 bg-accent-soft text-accent"
                      : "border-line bg-surface text-ink-soft hover:border-accent/30 hover:text-accent"
                  }`}
                >
                  {HAIR_LENGTH_LABELS[key]}
                </button>
              );
            })}
          </div>
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent-soft px-3.5 py-1.5 text-xs font-semibold text-accent">
              {displayPrice}
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <span className="rounded-full bg-accent-soft px-3.5 py-1.5 text-xs font-semibold text-accent">
            {price}
          </span>
          {meta ? (
            <span className="rounded-full border border-line px-3 py-1.5 text-[11px] text-muted">
              {meta}
            </span>
          ) : null}
        </div>
      )}

      <Link
        href={bookHref}
        className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-accent/25 bg-surface text-[10px] font-semibold uppercase tracking-[0.18em] text-accent transition duration-300 hover:bg-accent hover:text-accent-fg sm:w-auto sm:px-7"
      >
        Book now
      </Link>
    </article>
  );
}
