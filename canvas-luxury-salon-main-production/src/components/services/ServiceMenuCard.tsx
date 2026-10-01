"use client";

import Image from "next/image";
import { canOptimizeImage } from "@/lib/image-host";
import Link from "next/link";
import { useState } from "react";
import {
  HAIR_LENGTH_LABELS,
  type HairLength,
  type HairLengthPrices,
} from "@/lib/hair-length-pricing";
import { bookingUrl } from "@/lib/booking-prefill";
import { makeupServiceImage } from "@/lib/service-card-images";
import {
  discountBadge,
  discountedPrice,
  type ServiceDiscount,
} from "@/lib/service-discount";

type Props = {
  name: string;
  /** Kept for CMS/data compatibility; the description is intentionally not shown on cards. */
  blurb?: string;
  price: string;
  lengthPrices?: HairLengthPrices;
  /** "luxury-wide" marks a signature service (gets a small "Signature" tag). */
  variant?: "default" | "luxury" | "luxury-wide";
  imageSrc?: string;
  discount?: ServiceDiscount;
  /** Position in its section — shown as a gold "01", "02"… */
  index?: number;
};

const lengths: HairLength[] = ["short", "medium", "long"];

/** "From Rs. 2,500" → { from: true, amount: "Rs. 2,500" } */
function splitPrice(price: string): { from: boolean; amount: string } {
  const m = /^\s*from\s+(.*)$/i.exec(price);
  return m ? { from: true, amount: m[1] } : { from: false, amount: price };
}

/**
 * "Poster" service card: the photo fills the whole card inside a thin gold frame,
 * and the name / price / Book button sit on a frosted glass plate at the bottom.
 */
export function ServiceMenuCard({
  name,
  price,
  lengthPrices,
  variant = "default",
  imageSrc,
  discount,
  index,
}: Props) {
  const [length, setLength] = useState<HairLength>("medium");
  const basePrice = lengthPrices ? lengthPrices[length] : price;
  const salePrice = discountedPrice(basePrice, discount);
  const displayPrice = salePrice ?? basePrice;
  const badge = salePrice && discount ? discountBadge(discount) : null;
  const bookService = lengthPrices
    ? `${name} (${HAIR_LENGTH_LABELS[length]})`
    : name;
  const bookHref = bookingUrl(bookService, displayPrice);
  const img = imageSrc ?? makeupServiceImage(name);
  const signature = variant === "luxury-wide";

  const shown = splitPrice(displayPrice);
  const was = salePrice ? splitPrice(basePrice).amount : null;

  return (
    <article className="group relative isolate flex h-full min-h-[25rem] flex-col justify-end overflow-hidden rounded-[1.75rem] border border-accent/35 bg-canvas-alt shadow-[0_22px_45px_-26px_rgb(0_0_0/0.9)] transition duration-500 hover:-translate-y-1.5 hover:border-accent/70 hover:shadow-lift-lg sm:min-h-[28rem]">
      {/* Photo */}
      <Image
        src={img}
        alt={name}
        fill
        unoptimized={!canOptimizeImage(img)}
        className="-z-10 object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.08]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Readability scrims */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-canvas/65 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[68%] bg-gradient-to-t from-canvas via-canvas/80 to-transparent"
        aria-hidden
      />

      {/* Light sweep on hover */}
      <div
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-0 transition duration-[1100ms] ease-out group-hover:translate-x-[520%] group-hover:opacity-100"
        aria-hidden
      />

      {/* Inner gold frame */}
      <div
        className="pointer-events-none absolute inset-2 rounded-[1.35rem] border border-accent/25 transition duration-500 group-hover:border-accent/55"
        aria-hidden
      />

      {/* Top row: number + offer */}
      <div className="absolute inset-x-5 top-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {typeof index === "number" ? (
            <span className="font-display text-[1.7rem] leading-none text-accent drop-shadow-[0_2px_6px_rgb(0_0_0/0.6)]">
              {String(index).padStart(2, "0")}
            </span>
          ) : null}
          {signature ? (
            <span className="rounded-full border border-accent/60 bg-canvas/55 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur-sm">
              Signature
            </span>
          ) : null}
        </div>
        {badge ? (
          <span className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-lift">
            {badge}
          </span>
        ) : null}
      </div>

      {/* Frosted info plate */}
      <div className="relative z-10 m-4 rounded-2xl border border-accent/25 bg-canvas/65 p-4 backdrop-blur-md sm:m-5 sm:p-[1.1rem]">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 flex-1 font-display text-[1.1rem] leading-snug text-ink xs:text-lg sm:text-[1.2rem]">
            {name}
          </h3>
          <div className="flex shrink-0 flex-col items-end">
            {shown.from ? (
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted">
                From
              </span>
            ) : null}
            <span className="whitespace-nowrap font-display text-[1.05rem] leading-tight text-accent sm:text-lg">
              {shown.amount}
            </span>
            {was ? (
              <span className="whitespace-nowrap text-[11px] leading-tight text-muted line-through">
                {was}
              </span>
            ) : null}
          </div>
        </div>

        {/* Gold ornament divider */}
        <div className="my-3 flex items-center gap-2" aria-hidden>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/55" />
          <span className="h-1.5 w-1.5 rotate-45 bg-accent" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/55" />
        </div>

        {lengthPrices ? (
          <div
            className="mb-3 grid grid-cols-3 gap-1 rounded-full border border-accent/25 bg-canvas/50 p-1"
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
                  className={`min-h-[34px] rounded-full px-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition duration-300 ${
                    active
                      ? "bg-gold-gradient text-accent-fg shadow-lift"
                      : "text-ink-soft hover:text-accent"
                  }`}
                >
                  {HAIR_LENGTH_LABELS[key]}
                </button>
              );
            })}
          </div>
        ) : null}

        <Link
          href={bookHref}
          className="group/btn flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full border border-accent/60 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent transition duration-300 hover:border-transparent hover:bg-gold-gradient hover:text-accent-fg"
        >
          Book now
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover/btn:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
