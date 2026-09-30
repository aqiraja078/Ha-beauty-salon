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
  variant?: "default" | "luxury" | "luxury-wide";
  imageSrc?: string;
  discount?: ServiceDiscount;
};

const lengths: HairLength[] = ["short", "medium", "long"];

function CardIcon({ name }: { name: string }) {
  const lower = name.toLowerCase();
  const path =
    lower.includes("bridal") || lower.includes("walima")
      ? "M12 2l2.2 6.8H21l-5.5 4 2.1 6.8L12 15.6 6.4 19.6l2.1-6.8L3 8.8h6.8L12 2z"
      : lower.includes("party") || lower.includes("festive")
        ? "M8 22h8M12 18V6M7 10l5-4 5 4"
        : lower.includes("mehndi")
          ? "M12 3c3 4 6 6 6 10a6 6 0 1 1-12 0c0-4 3-6 6-10z"
          : "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 4v8m-4-4h8";

  return (
    <span
      className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/50 bg-surface text-accent shadow-ring"
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d={path} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function WaveDivider() {
  return (
    <svg
      viewBox="0 0 400 28"
      className="absolute -bottom-px left-0 w-full text-surface"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0,12 C80,28 120,0 200,14 C280,28 320,4 400,16 L400,28 L0,28 Z"
      />
    </svg>
  );
}

export function ServiceMenuCard({
  name,
  price,
  lengthPrices,
  variant = "default",
  imageSrc,
  discount,
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
  const isLuxury = variant === "luxury" || variant === "luxury-wide";
  const wide = variant === "luxury-wide";
  const img = imageSrc ?? makeupServiceImage(name);

  if (isLuxury) {
    return (
      <article
        className={`luxury-card group flex h-full overflow-hidden transition duration-500 hover:border-accent/60 hover:shadow-lift-lg ${
          wide ? "flex-col sm:flex-row" : "flex-col"
        }`}
      >
        <div
          className={`relative shrink-0 overflow-hidden bg-canvas-2 ${
            wide ? "h-56 sm:h-auto sm:min-h-[15rem] sm:w-[42%]" : "h-56 sm:h-60"
          }`}
        >
          <Image
            src={img}
            alt=""
            fill
            unoptimized={!canOptimizeImage(img)}
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes={wide ? "(max-width: 640px) 100vw, 320px" : "(max-width: 640px) 100vw, 280px"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />
          {badge ? (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-rose-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-lift">
              {badge}
            </span>
          ) : null}
          {!wide ? <WaveDivider /> : null}
          <div
            className={`absolute z-10 ${wide ? "bottom-4 left-4" : "left-1/2 top-[calc(100%-1.25rem)] -translate-x-1/2"}`}
          >
            <CardIcon name={name} />
          </div>
        </div>

        <div className={`flex flex-1 flex-col p-4 sm:p-5 ${wide ? "justify-center" : "pt-6"}`}>
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 flex-1 font-display text-[1.05rem] leading-snug text-accent xs:text-lg sm:text-[1.25rem]">
              {name}
            </h3>
            <div className="flex shrink-0 flex-col items-end gap-0.5">
              <span className="whitespace-nowrap rounded-full bg-gold-gradient px-3 py-1 text-[11px] font-semibold text-accent-fg">
                {displayPrice}
              </span>
              {salePrice ? (
                <span className="whitespace-nowrap text-[11px] text-muted line-through">
                  {basePrice}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex-1" aria-hidden />

          {lengthPrices ? (
            <div className="mt-3 border-t border-line/80 pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                Select length
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2" role="group" aria-label={`Hair length for ${name}`}>
                {lengths.map((key) => {
                  const active = length === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setLength(key)}
                      aria-pressed={active}
                      className={`min-h-[36px] rounded-full border px-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition duration-300 ${
                        active
                          ? "border-accent/50 bg-accent/15 text-accent"
                          : "border-line bg-surface text-ink-soft hover:border-accent/35 hover:text-accent"
                      }`}
                    >
                      {HAIR_LENGTH_LABELS[key]}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <Link
            href={bookHref}
            className="mt-4 inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-full border border-accent/50 bg-canvas/60 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent transition duration-300 hover:border-accent hover:bg-accent/10 sm:w-auto sm:px-8"
          >
            Book now
            <span aria-hidden>→</span>
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col rounded-3xl border border-line bg-surface p-5 shadow-soft transition duration-500 hover:-translate-y-1.5 hover:border-accent/35 hover:shadow-lift-lg sm:p-6">
      <h3 className="font-display text-lg leading-snug text-accent sm:text-xl">{name}</h3>
      <div className="flex-1" aria-hidden />

      {lengthPrices ? (
        <div className="mt-5 border-t border-line pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            Select length
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label={`Hair length for ${name}`}>
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
            {salePrice ? (
              <>
                <span className="text-xs text-muted line-through">{basePrice}</span>
                <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                  {badge}
                </span>
              </>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <span className="rounded-full bg-accent-soft px-3.5 py-1.5 text-xs font-semibold text-accent">
            {displayPrice}
          </span>
          {salePrice ? (
            <>
              <span className="text-xs text-muted line-through">{basePrice}</span>
              <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                {badge}
              </span>
            </>
          ) : null}
        </div>
      )}

      <Link
        href={bookHref}
        className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-accent/35 bg-surface text-[10px] font-semibold uppercase tracking-[0.18em] text-accent transition duration-300 hover:bg-accent hover:text-accent-fg sm:w-auto sm:px-7"
      >
        Book now
      </Link>
    </article>
  );
}
