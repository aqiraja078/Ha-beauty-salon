"use client";

import { ImageUploadButton } from "@/components/admin/ImageUploadField";
import { discountedPrice, toServiceDiscount } from "@/lib/service-discount";
import { useMemo, useState } from "react";
import type {
  CmsMenuItem,
  CmsMenuSection,
  CmsServiceCategory,
  ServiceCategorySlug,
  ServiceMenus,
} from "@/lib/cms-types";
import { SERVICE_CATEGORY_SLUGS } from "@/lib/cms-types";
import {
  deriveLengthPrices,
  HAIR_LENGTH_LABELS,
  HAIR_LENGTH_SECTION_IDS,
  type HairLength,
  type HairLengthPrices,
} from "@/lib/hair-length-pricing";

const LABELS: Record<ServiceCategorySlug, string> = {
  hair: "Hair",
  makeup: "Makeup",
  facial: "Facial",
  "body-spa": "Wax & Body",
};

const LENGTHS: HairLength[] = ["short", "medium", "long"];

function usesLengthPricing(section: CmsMenuSection, item: CmsMenuItem) {
  return HAIR_LENGTH_SECTION_IDS.has(section.id) || Boolean(item.lengthPrices);
}

function ensureLengthPrices(item: CmsMenuItem): HairLengthPrices {
  if (item.lengthPrices) return item.lengthPrices;
  return deriveLengthPrices(item.price);
}

function newItem(sectionId?: string): CmsMenuItem {
  const base: CmsMenuItem = {
    name: "New service",
    blurb: "",
    price: "Rs. 0",
  };
  if (sectionId && HAIR_LENGTH_SECTION_IDS.has(sectionId)) {
    base.lengthPrices = deriveLengthPrices(base.price);
  }
  return base;
}

function newSection(): CmsMenuSection {
  return {
    id: `section-${Date.now()}`,
    emoji: "✨",
    title: "New section",
    items: [newItem()],
  };
}

export function AdminServicesEditor({ initial }: { initial: ServiceMenus }) {
  const [menus, setMenus] = useState(initial);
  const [slug, setSlug] = useState<ServiceCategorySlug>("hair");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const cat = menus[slug];

  const itemCount = useMemo(
    () => cat.sections.reduce((n, s) => n + s.items.length, 0),
    [cat]
  );

  function patchCat(next: CmsServiceCategory) {
    setMenus((m) => ({ ...m, [slug]: next }));
  }

  function patchSection(si: number, next: CmsMenuSection) {
    const sections = cat.sections.map((s, i) => (i === si ? next : s));
    patchCat({ ...cat, sections });
  }

  function patchItem(si: number, ii: number, next: CmsMenuItem) {
    const section = cat.sections[si];
    const items = section.items.map((it, i) => (i === ii ? next : it));
    patchSection(si, { ...section, items });
  }

  function enableLengthPrices(si: number, ii: number) {
    const item = cat.sections[si].items[ii];
    patchItem(si, ii, {
      ...item,
      lengthPrices: ensureLengthPrices(item),
    });
  }

  function disableLengthPrices(si: number, ii: number) {
    const item = cat.sections[si].items[ii];
    patchItem(si, ii, {
      name: item.name,
      blurb: item.blurb,
      price: item.price,
      duration: item.duration,
      image: item.image,
      discountType: item.discountType,
      discountValue: item.discountValue,
    });
  }

  function patchLengthPrice(
    si: number,
    ii: number,
    key: HairLength,
    value: string
  ) {
    const item = cat.sections[si].items[ii];
    const lengthPrices = {
      ...ensureLengthPrices(item),
      [key]: value,
    };
    patchItem(si, ii, {
      ...item,
      lengthPrices,
      // Keep menu "price" in sync with Medium (default shown / booking base).
      price: key === "medium" ? value : item.price,
    });
  }

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      // Persist derived length prices for length sections so live cards stay editable.
      const data: CmsServiceCategory = {
        ...menus[slug],
        sections: menus[slug].sections.map((s) => ({
          ...s,
          items: s.items.map((item) => {
            if (!usesLengthPricing(s, item) && !HAIR_LENGTH_SECTION_IDS.has(s.id)) {
              return item;
            }
            if (HAIR_LENGTH_SECTION_IDS.has(s.id) || item.lengthPrices) {
              const lengthPrices = ensureLengthPrices(item);
              return {
                ...item,
                lengthPrices,
                price: lengthPrices.medium || item.price,
              };
            }
            return item;
          }),
        })),
      };
      const res = await fetch("/api/admin/content/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: slug, data }),
      });
      if (!res.ok) throw new Error("Save failed");
      const saved = (await res.json()) as ServiceMenus;
      setMenus(saved);
      setMsg(`${LABELS[slug]} menu saved — /services/${slug} pe live hai.`);
    } catch {
      setMsg("Save fail hua. Dobara try karein.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-7 space-y-4">
      <div className="console-card flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {SERVICE_CATEGORY_SLUGS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setSlug(s);
                setMsg("");
              }}
              className={`min-h-[36px] rounded-full px-4 text-xs font-medium transition ${
                slug === s
                  ? "bg-gradient-to-r from-accent to-accent-strong text-accent-fg shadow-lift"
                  : "border border-line bg-surface text-ink-soft hover:border-accent/45 hover:text-accent"
              }`}
            >
              {LABELS[s]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs tabular-nums text-muted">
            {cat.sections.length} sections · {itemCount} items
          </span>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="console-btn"
          >
            {saving ? "Saving…" : "Save menu"}
          </button>
        </div>
      </div>

      {msg ? (
        <p className="rounded-xl border border-line bg-canvas-alt px-4 py-3 text-sm text-ink-soft">
          {msg}
        </p>
      ) : null}

      {slug === "hair" ? (
        <p className="rounded-xl border border-accent/20 bg-accent-soft px-4 py-3 text-sm text-accent-strong">
          Hair coloring, treatment, aur advanced / premium services pe{" "}
          <strong>Short / Medium / Long</strong> prices edit kar sakte ho — Save
          ke baad live cards update ho jate hain.
        </p>
      ) : null}

      <section className="console-card space-y-4 p-5 sm:p-6">
        <h2 className="font-display text-lg text-ink">Page chrome</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["kicker", "Hero label (small text above headline)"],
              ["title", "Page title (browser tab / SEO)"],
              ["headline", "Hero headline — line 1"],
              ["headlineAccent", "Hero headline — line 2"],
              ["script", "Script tagline on photo"],
              ["heroAlt", "Hero photo alt text"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block">
              <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                {label}
              </span>
              <input
                className="console-field"
                value={cat[key] ?? ""}
                onChange={(e) => patchCat({ ...cat, [key]: e.target.value })}
              />
            </label>
          ))}
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              Description
            </span>
            <textarea
              className="console-field min-h-[72px]"
              value={cat.description}
              onChange={(e) =>
                patchCat({ ...cat, description: e.target.value })
              }
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              Footer note
            </span>
            <textarea
              className="console-field min-h-[64px]"
              value={cat.footerNote}
              onChange={(e) =>
                patchCat({ ...cat, footerNote: e.target.value })
              }
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              Hero photo (first line is shown on the page)
            </span>
            <span className="mb-2 flex items-center gap-2">
              <ImageUploadButton
                label="Upload hero photo"
                onUploaded={(url) =>
                  patchCat({ ...cat, heroImages: [url, ...cat.heroImages] })
                }
              />
              <span className="text-xs text-muted">
                Uploaded photo goes to the first line and becomes the hero.
              </span>
            </span>
            <textarea
              className="console-field min-h-[72px] font-mono text-xs"
              value={cat.heroImages.join("\n")}
              onChange={(e) =>
                patchCat({
                  ...cat,
                  heroImages: e.target.value
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean),
                })
              }
            />
          </label>
        </div>
      </section>

      {cat.sections.map((section, si) => {
        const lengthSection = HAIR_LENGTH_SECTION_IDS.has(section.id);
        return (
          <section
            key={section.id}
            className="console-card space-y-4 p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-end gap-3">
              <label className="w-16">
                <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Emoji
                </span>
                <input
                  className="console-field text-center"
                  value={section.emoji}
                  onChange={(e) =>
                    patchSection(si, { ...section, emoji: e.target.value })
                  }
                />
              </label>
              <label className="min-w-[12rem] flex-1">
                <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Section title
                </span>
                <input
                  className="console-field"
                  value={section.title}
                  onChange={(e) =>
                    patchSection(si, { ...section, title: e.target.value })
                  }
                />
              </label>
              <button
                type="button"
                className="console-btn-soft text-rose-600 hover:border-rose-300"
                onClick={() =>
                  patchCat({
                    ...cat,
                    sections: cat.sections.filter((_, i) => i !== si),
                  })
                }
              >
                Delete section
              </button>
            </div>

            {lengthSection ? (
              <p className="text-xs text-muted">
                Section id <code className="text-accent">{section.id}</code> —
                length pricing on (Short / Medium / Long).
              </p>
            ) : null}

            <div className="space-y-3">
              {section.items.map((item, ii) => {
                const lengthOn = usesLengthPricing(section, item);
                const lengthPrices = lengthOn
                  ? ensureLengthPrices(item)
                  : null;

                return (
                  <div
                    key={`${section.id}-${ii}`}
                    className="rounded-xl border border-line bg-canvas/50 p-3 sm:p-4"
                  >
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <label className="block lg:col-span-1">
                        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                          Name
                        </span>
                        <input
                          className="console-field"
                          value={item.name}
                          onChange={(e) =>
                            patchItem(si, ii, {
                              ...item,
                              name: e.target.value,
                            })
                          }
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                          {lengthOn ? "Base / Medium price" : "Price"}
                        </span>
                        <input
                          className="console-field"
                          value={
                            lengthOn
                              ? lengthPrices!.medium
                              : item.price
                          }
                          onChange={(e) => {
                            if (lengthOn) {
                              patchLengthPrice(si, ii, "medium", e.target.value);
                            } else {
                              patchItem(si, ii, {
                                ...item,
                                price: e.target.value,
                              });
                            }
                          }}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                          Duration
                        </span>
                        <input
                          className="console-field"
                          value={item.duration ?? ""}
                          placeholder="optional"
                          onChange={(e) =>
                            patchItem(si, ii, {
                              ...item,
                              duration: e.target.value || undefined,
                            })
                          }
                        />
                      </label>
                      <div className="flex flex-wrap items-end gap-2">
                        {!lengthSection ? (
                          <button
                            type="button"
                            className="console-btn-soft flex-1"
                            onClick={() =>
                              lengthOn
                                ? disableLengthPrices(si, ii)
                                : enableLengthPrices(si, ii)
                            }
                          >
                            {lengthOn ? "Remove length prices" : "+ Length prices"}
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className="console-btn-soft flex-1 text-rose-600"
                          onClick={() =>
                            patchSection(si, {
                              ...section,
                              items: section.items.filter((_, i) => i !== ii),
                            })
                          }
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-4">
                        <label className="block">
                          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                            Discount type
                          </span>
                          <select
                            className="console-field"
                            value={item.discountType ?? ""}
                            onChange={(e) => {
                              const t = e.target.value as "" | "percent" | "amount";
                              patchItem(si, ii, {
                                ...item,
                                discountType: t || undefined,
                                discountValue: t ? item.discountValue : undefined,
                              });
                            }}
                          >
                            <option value="">No discount</option>
                            <option value="percent">Percent (%) off</option>
                            <option value="amount">Fixed amount (Rs.) off</option>
                          </select>
                        </label>
                        {item.discountType ? (
                          <label className="block">
                            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                              {item.discountType === "percent"
                                ? "Discount % (e.g. 20)"
                                : "Discount amount in Rs. (e.g. 500)"}
                            </span>
                            <input
                              className="console-field"
                              type="number"
                              min={0}
                              step="any"
                              inputMode="decimal"
                              value={item.discountValue ?? ""}
                              onChange={(e) =>
                                patchItem(si, ii, {
                                  ...item,
                                  discountValue:
                                    e.target.value === ""
                                      ? undefined
                                      : Number(e.target.value),
                                })
                              }
                            />
                          </label>
                        ) : null}
                        {item.discountType ? (
                          <p className="self-end pb-2 text-xs text-muted sm:col-span-2">
                            {(() => {
                              const d = toServiceDiscount(
                                item.discountType,
                                item.discountValue
                              );
                              const base = lengthOn
                                ? lengthPrices!.medium
                                : item.price;
                              const sale = discountedPrice(base, d);
                              return sale
                                ? `Customers will see ${base} → ${sale}`
                                : "Valid discount enter karein (price mein ek hi number hona chahiye).";
                            })()}
                          </p>
                        ) : null}
                      </div>
                      <div className="block sm:col-span-2 lg:col-span-4">
                        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                          Card photo (optional — blank = automatic photo)
                        </span>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-canvas-2">
                            {item.image ? (
                              // eslint-disable-next-line @next/next/no-img-element -- admin preview
                              <img src={item.image} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-muted">Auto</span>
                            )}
                          </div>
                          <input
                            className="console-field min-w-0 flex-1 font-mono text-xs"
                            value={item.image ?? ""}
                            placeholder="Upload a photo, or paste a link (https://…)"
                            onChange={(e) =>
                              patchItem(si, ii, {
                                ...item,
                                image: e.target.value.trim() || undefined,
                              })
                            }
                          />
                          <ImageUploadButton
                            onUploaded={(url) => patchItem(si, ii, { ...item, image: url })}
                          />
                          {item.image ? (
                            <button
                              type="button"
                              className="console-btn-soft text-rose-600"
                              onClick={() => patchItem(si, ii, { ...item, image: undefined })}
                            >
                              Clear
                            </button>
                          ) : null}
                        </div>
                      </div>
                      <label className="block sm:col-span-2 lg:col-span-4">
                        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                          Description (internal note — not shown on service cards)
                        </span>
                        <input
                          className="console-field"
                          value={item.blurb}
                          onChange={(e) =>
                            patchItem(si, ii, {
                              ...item,
                              blurb: e.target.value,
                            })
                          }
                        />
                      </label>
                    </div>

                    {lengthPrices ? (
                      <div className="mt-3 rounded-xl border border-accent/20 bg-surface p-3">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                          Length prices (live card)
                        </p>
                        <div className="grid gap-2 sm:grid-cols-3">
                          {LENGTHS.map((key) => (
                            <label key={key} className="block">
                              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                                {HAIR_LENGTH_LABELS[key]}
                              </span>
                              <input
                                className="console-field"
                                value={lengthPrices[key]}
                                onChange={(e) =>
                                  patchLengthPrice(
                                    si,
                                    ii,
                                    key,
                                    e.target.value
                                  )
                                }
                              />
                            </label>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="console-btn-soft mt-3 text-xs"
                          onClick={() =>
                            patchItem(si, ii, {
                              ...item,
                              lengthPrices: deriveLengthPrices(
                                lengthPrices.medium || item.price
                              ),
                              price: lengthPrices.medium || item.price,
                            })
                          }
                        >
                          Auto-fill from Medium (−15% / +25%)
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="console-btn-soft"
              onClick={() =>
                patchSection(si, {
                  ...section,
                  items: [...section.items, newItem(section.id)],
                })
              }
            >
              + Add service
            </button>
          </section>
        );
      })}

      <button
        type="button"
        className="console-btn-soft"
        onClick={() =>
          patchCat({ ...cat, sections: [...cat.sections, newSection()] })
        }
      >
        + Add section
      </button>
    </div>
  );
}
