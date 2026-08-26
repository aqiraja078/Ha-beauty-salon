"use client";

import { useState } from "react";
import type { HomeContent } from "@/lib/cms-types";

const TABS = [
  "hero",
  "makeup",
  "categories",
  "about",
  "why",
  "steps",
  "gallery",
  "offers",
  "testimonials",
  "cta",
] as const;

type Tab = (typeof TABS)[number];

const TAB_LABEL: Record<Tab, string> = {
  hero: "Hero",
  makeup: "Makeup cards",
  categories: "Service cards",
  about: "About",
  why: "Why us",
  steps: "Steps",
  gallery: "Gallery",
  offers: "Sales",
  testimonials: "Testimonials",
  cta: "CTA",
};

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      {multiline ? (
        <textarea
          className="console-field min-h-[80px]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="console-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

export function AdminHomeEditor({
  initial,
  initialTab = "hero",
  onlyTab,
}: {
  initial: HomeContent;
  initialTab?: Tab;
  /** When set, only this tab is shown (used by Offers sidebar). */
  onlyTab?: Tab;
}) {
  const tabs = onlyTab ? ([onlyTab] as readonly Tab[]) : TABS;
  const [data, setData] = useState(initial);
  const [tab, setTab] = useState<Tab>(onlyTab ?? initialTab);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/content/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Save failed");
      setData((await res.json()) as HomeContent);
      setMsg(
        onlyTab === "offers"
          ? "Sales saved — home aur /sales page pe refresh karke dekhein."
          : "Home content saved — main page pe refresh karke dekhein."
      );
    } catch {
      setMsg("Save fail hua. Dobara try karein.");
    } finally {
      setSaving(false);
    }
  }

  function moveOffer(from: number, to: number) {
    if (to < 0 || to >= data.offers.items.length) return;
    const items = [...data.offers.items];
    const [row] = items.splice(from, 1);
    items.splice(to, 0, row);
    setData({ ...data, offers: { ...data.offers, items } });
  }

  return (
    <div className="mt-7 space-y-4">
      <div className="console-card flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex max-w-full flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`min-h-[34px] rounded-full px-3.5 text-[11px] font-medium transition ${
                tab === t
                  ? "bg-gradient-to-r from-accent to-accent-strong text-accent-fg shadow-lift"
                  : "border border-line bg-surface text-ink-soft hover:text-accent"
              }`}
            >
              {TAB_LABEL[t]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="console-btn"
        >
          {saving
            ? "Saving…"
            : onlyTab === "offers"
              ? "Save sales"
              : "Save home"}
        </button>
      </div>

      {msg ? (
        <p className="rounded-xl border border-line bg-canvas-alt px-4 py-3 text-sm text-ink-soft">
          {msg}
        </p>
      ) : null}

      <section className="console-card space-y-4 p-5 sm:p-6">
        {onlyTab === "offers" ? (
          <p className="rounded-xl border border-accent/20 bg-accent-soft px-4 py-3 text-sm text-accent-strong">
            Yahan se packages add, edit, reorder ya remove karein. Save ke baad
            home Sales section aur{" "}
            <a href="/sales" className="font-semibold underline">
              /sales
            </a>{" "}
            page dono update ho jate hain.
          </p>
        ) : null}
        {tab === "hero" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Image URL"
              value={data.hero.image}
              onChange={(v) => setData({ ...data, hero: { ...data.hero, image: v } })}
            />
            <Field
              label="Image alt"
              value={data.hero.imageAlt}
              onChange={(v) =>
                setData({ ...data, hero: { ...data.hero, imageAlt: v } })
              }
            />
            <Field
              label="Headline (before accent)"
              value={data.hero.headlineBefore}
              onChange={(v) =>
                setData({ ...data, hero: { ...data.hero, headlineBefore: v } })
              }
            />
            <Field
              label="Headline accent word"
              value={data.hero.headlineAccent}
              onChange={(v) =>
                setData({ ...data, hero: { ...data.hero, headlineAccent: v } })
              }
            />
            <div className="sm:col-span-2">
              <Field
                label="Subcopy"
                multiline
                value={data.hero.subcopy}
                onChange={(v) =>
                  setData({ ...data, hero: { ...data.hero, subcopy: v } })
                }
              />
            </div>
            <Field
              label="Primary CTA label"
              value={data.hero.primaryCta.label}
              onChange={(v) =>
                setData({
                  ...data,
                  hero: {
                    ...data.hero,
                    primaryCta: { ...data.hero.primaryCta, label: v },
                  },
                })
              }
            />
            <Field
              label="Primary CTA href"
              value={data.hero.primaryCta.href}
              onChange={(v) =>
                setData({
                  ...data,
                  hero: {
                    ...data.hero,
                    primaryCta: { ...data.hero.primaryCta, href: v },
                  },
                })
              }
            />
            <Field
              label="Secondary CTA label"
              value={data.hero.secondaryCta.label}
              onChange={(v) =>
                setData({
                  ...data,
                  hero: {
                    ...data.hero,
                    secondaryCta: { ...data.hero.secondaryCta, label: v },
                  },
                })
              }
            />
            <Field
              label="Secondary CTA href"
              value={data.hero.secondaryCta.href}
              onChange={(v) =>
                setData({
                  ...data,
                  hero: {
                    ...data.hero,
                    secondaryCta: { ...data.hero.secondaryCta, href: v },
                  },
                })
              }
            />
            {data.hero.highlights.map((h, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 sm:col-span-2">
                <Field
                  label={`Highlight ${i + 1} value`}
                  value={h.value}
                  onChange={(v) => {
                    const highlights = data.hero.highlights.map((x, j) =>
                      j === i ? { ...x, value: v } : x
                    );
                    setData({ ...data, hero: { ...data.hero, highlights } });
                  }}
                />
                <Field
                  label={`Highlight ${i + 1} label`}
                  value={h.label}
                  onChange={(v) => {
                    const highlights = data.hero.highlights.map((x, j) =>
                      j === i ? { ...x, label: v } : x
                    );
                    setData({ ...data, hero: { ...data.hero, highlights } });
                  }}
                />
              </div>
            ))}
          </div>
        ) : null}

        {tab === "makeup" ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Eyebrow"
                value={data.makeupSection.eyebrow}
                onChange={(v) =>
                  setData({
                    ...data,
                    makeupSection: { ...data.makeupSection, eyebrow: v },
                  })
                }
              />
              <Field
                label="Title"
                value={data.makeupSection.title}
                onChange={(v) =>
                  setData({
                    ...data,
                    makeupSection: { ...data.makeupSection, title: v },
                  })
                }
              />
              <div className="sm:col-span-2">
                <Field
                  label="Lead"
                  multiline
                  value={data.makeupSection.lead}
                  onChange={(v) =>
                    setData({
                      ...data,
                      makeupSection: { ...data.makeupSection, lead: v },
                    })
                  }
                />
              </div>
            </div>
            {data.makeupSection.cards.map((card, i) => (
              <div
                key={card.id}
                className="grid gap-3 rounded-xl border border-line bg-canvas/50 p-4 sm:grid-cols-2"
              >
                <Field
                  label="Name"
                  value={card.name}
                  onChange={(v) => {
                    const cards = data.makeupSection.cards.map((c, j) =>
                      j === i ? { ...c, name: v } : c
                    );
                    setData({
                      ...data,
                      makeupSection: { ...data.makeupSection, cards },
                    });
                  }}
                />
                <Field
                  label="Price"
                  value={card.price}
                  onChange={(v) => {
                    const cards = data.makeupSection.cards.map((c, j) =>
                      j === i ? { ...c, price: v } : c
                    );
                    setData({
                      ...data,
                      makeupSection: { ...data.makeupSection, cards },
                    });
                  }}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Image URL"
                    value={card.image}
                    onChange={(v) => {
                      const cards = data.makeupSection.cards.map((c, j) =>
                        j === i ? { ...c, image: v } : c
                      );
                      setData({
                        ...data,
                        makeupSection: { ...data.makeupSection, cards },
                      });
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="console-btn-soft text-rose-600 sm:col-span-2"
                  onClick={() =>
                    setData({
                      ...data,
                      makeupSection: {
                        ...data.makeupSection,
                        cards: data.makeupSection.cards.filter((_, j) => j !== i),
                      },
                    })
                  }
                >
                  Remove card
                </button>
              </div>
            ))}
            <button
              type="button"
              className="console-btn-soft"
              onClick={() =>
                setData({
                  ...data,
                  makeupSection: {
                    ...data.makeupSection,
                    cards: [
                      ...data.makeupSection.cards,
                      {
                        id: `card-${Date.now()}`,
                        name: "New look",
                        price: "From Rs. 0",
                        image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80",
                      },
                    ],
                  },
                })
              }
            >
              + Add makeup card
            </button>
          </div>
        ) : null}

        {tab === "categories" ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Eyebrow"
                value={data.servicesSection.eyebrow}
                onChange={(v) =>
                  setData({
                    ...data,
                    servicesSection: { ...data.servicesSection, eyebrow: v },
                  })
                }
              />
              <Field
                label="Title"
                value={data.servicesSection.title}
                onChange={(v) =>
                  setData({
                    ...data,
                    servicesSection: { ...data.servicesSection, title: v },
                  })
                }
              />
              <div className="sm:col-span-2">
                <Field
                  label="Lead"
                  multiline
                  value={data.servicesSection.lead}
                  onChange={(v) =>
                    setData({
                      ...data,
                      servicesSection: { ...data.servicesSection, lead: v },
                    })
                  }
                />
              </div>
            </div>
            {data.servicesSection.categories.map((cat, i) => (
              <div
                key={cat.slug}
                className="grid gap-3 rounded-xl border border-line bg-canvas/50 p-4 sm:grid-cols-2"
              >
                <p className="sm:col-span-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  {cat.slug}
                </p>
                <Field
                  label="Title"
                  value={cat.title}
                  onChange={(v) => {
                    const categories = data.servicesSection.categories.map(
                      (c, j) => (j === i ? { ...c, title: v } : c)
                    );
                    setData({
                      ...data,
                      servicesSection: { ...data.servicesSection, categories },
                    });
                  }}
                />
                <Field
                  label="Starting price"
                  value={cat.price}
                  onChange={(v) => {
                    const categories = data.servicesSection.categories.map(
                      (c, j) => (j === i ? { ...c, price: v } : c)
                    );
                    setData({
                      ...data,
                      servicesSection: { ...data.servicesSection, categories },
                    });
                  }}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Short description"
                    value={cat.short}
                    onChange={(v) => {
                      const categories = data.servicesSection.categories.map(
                        (c, j) => (j === i ? { ...c, short: v } : c)
                      );
                      setData({
                        ...data,
                        servicesSection: {
                          ...data.servicesSection,
                          categories,
                        },
                      });
                    }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="Image URL"
                    value={cat.image}
                    onChange={(v) => {
                      const categories = data.servicesSection.categories.map(
                        (c, j) => (j === i ? { ...c, image: v } : c)
                      );
                      setData({
                        ...data,
                        servicesSection: {
                          ...data.servicesSection,
                          categories,
                        },
                      });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "about" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Eyebrow"
              value={data.about.eyebrow}
              onChange={(v) =>
                setData({ ...data, about: { ...data.about, eyebrow: v } })
              }
            />
            <Field
              label="Title"
              value={data.about.title}
              onChange={(v) =>
                setData({ ...data, about: { ...data.about, title: v } })
              }
            />
            <div className="sm:col-span-2">
              <Field
                label="Body (use {name} for salon name)"
                multiline
                value={data.about.body}
                onChange={(v) =>
                  setData({ ...data, about: { ...data.about, body: v } })
                }
              />
            </div>
            <Field
              label="Image URL"
              value={data.about.image}
              onChange={(v) =>
                setData({ ...data, about: { ...data.about, image: v } })
              }
            />
            <Field
              label="Badge value"
              value={data.about.badgeValue}
              onChange={(v) =>
                setData({ ...data, about: { ...data.about, badgeValue: v } })
              }
            />
            <Field
              label="Badge label"
              value={data.about.badgeLabel}
              onChange={(v) =>
                setData({ ...data, about: { ...data.about, badgeLabel: v } })
              }
            />
            <Field
              label="CTA label"
              value={data.about.ctaLabel}
              onChange={(v) =>
                setData({ ...data, about: { ...data.about, ctaLabel: v } })
              }
            />
            <div className="sm:col-span-2">
              <Field
                label="Bullets (one per line)"
                multiline
                value={data.about.bullets.join("\n")}
                onChange={(v) =>
                  setData({
                    ...data,
                    about: {
                      ...data.about,
                      bullets: v.split("\n").map((l) => l.trim()).filter(Boolean),
                    },
                  })
                }
              />
            </div>
          </div>
        ) : null}

        {tab === "why" ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Eyebrow"
                value={data.why.eyebrow}
                onChange={(v) =>
                  setData({ ...data, why: { ...data.why, eyebrow: v } })
                }
              />
              <Field
                label="Title"
                value={data.why.title}
                onChange={(v) =>
                  setData({ ...data, why: { ...data.why, title: v } })
                }
              />
            </div>
            {data.why.reasons.map((r, i) => (
              <div
                key={i}
                className="grid gap-3 rounded-xl border border-line bg-canvas/50 p-4"
              >
                <Field
                  label="Reason title"
                  value={r.title}
                  onChange={(v) => {
                    const reasons = data.why.reasons.map((x, j) =>
                      j === i ? { ...x, title: v } : x
                    );
                    setData({ ...data, why: { ...data.why, reasons } });
                  }}
                />
                <Field
                  label="Description"
                  multiline
                  value={r.desc}
                  onChange={(v) => {
                    const reasons = data.why.reasons.map((x, j) =>
                      j === i ? { ...x, desc: v } : x
                    );
                    setData({ ...data, why: { ...data.why, reasons } });
                  }}
                />
              </div>
            ))}
          </div>
        ) : null}

        {tab === "steps" ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Eyebrow"
                value={data.steps.eyebrow}
                onChange={(v) =>
                  setData({ ...data, steps: { ...data.steps, eyebrow: v } })
                }
              />
              <Field
                label="Title"
                value={data.steps.title}
                onChange={(v) =>
                  setData({ ...data, steps: { ...data.steps, title: v } })
                }
              />
              <div className="sm:col-span-2">
                <Field
                  label="Lead"
                  multiline
                  value={data.steps.lead}
                  onChange={(v) =>
                    setData({ ...data, steps: { ...data.steps, lead: v } })
                  }
                />
              </div>
            </div>
            {data.steps.items.map((s, i) => (
              <div
                key={s.n}
                className="grid gap-3 rounded-xl border border-line bg-canvas/50 p-4 sm:grid-cols-3"
              >
                <Field
                  label="Step #"
                  value={s.n}
                  onChange={(v) => {
                    const items = data.steps.items.map((x, j) =>
                      j === i ? { ...x, n: v } : x
                    );
                    setData({ ...data, steps: { ...data.steps, items } });
                  }}
                />
                <Field
                  label="Title"
                  value={s.title}
                  onChange={(v) => {
                    const items = data.steps.items.map((x, j) =>
                      j === i ? { ...x, title: v } : x
                    );
                    setData({ ...data, steps: { ...data.steps, items } });
                  }}
                />
                <Field
                  label="Description"
                  value={s.desc}
                  onChange={(v) => {
                    const items = data.steps.items.map((x, j) =>
                      j === i ? { ...x, desc: v } : x
                    );
                    setData({ ...data, steps: { ...data.steps, items } });
                  }}
                />
              </div>
            ))}
          </div>
        ) : null}

        {tab === "gallery" ? (
          <div className="space-y-3">
            <Field
              label="Eyebrow"
              value={data.gallery.eyebrow}
              onChange={(v) =>
                setData({ ...data, gallery: { ...data.gallery, eyebrow: v } })
              }
            />
            <Field
              label="Title"
              value={data.gallery.title}
              onChange={(v) =>
                setData({ ...data, gallery: { ...data.gallery, title: v } })
              }
            />
            <Field
              label="Image URLs (one per line)"
              multiline
              value={data.gallery.images.join("\n")}
              onChange={(v) =>
                setData({
                  ...data,
                  gallery: {
                    ...data.gallery,
                    images: v.split("\n").map((l) => l.trim()).filter(Boolean),
                  },
                })
              }
            />
          </div>
        ) : null}

        {tab === "offers" ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Section eyebrow"
                value={data.offers.eyebrow}
                onChange={(v) =>
                  setData({ ...data, offers: { ...data.offers, eyebrow: v } })
                }
              />
              <Field
                label="Section title"
                value={data.offers.title}
                onChange={(v) =>
                  setData({ ...data, offers: { ...data.offers, title: v } })
                }
              />
              <div className="sm:col-span-2">
                <Field
                  label="Section lead"
                  multiline
                  value={data.offers.lead}
                  onChange={(v) =>
                    setData({ ...data, offers: { ...data.offers, lead: v } })
                  }
                />
              </div>
            </div>

            {data.offers.items.map((offer, i) => (
              <div
                key={offer.id}
                className="grid gap-3 rounded-xl border border-line bg-canvas/50 p-4 sm:grid-cols-2"
              >
                <Field
                  label="Badge"
                  value={offer.badge}
                  onChange={(v) => {
                    const items = data.offers.items.map((x, j) =>
                      j === i ? { ...x, badge: v } : x
                    );
                    setData({ ...data, offers: { ...data.offers, items } });
                  }}
                />
                <Field
                  label="Title"
                  value={offer.title}
                  onChange={(v) => {
                    const items = data.offers.items.map((x, j) =>
                      j === i ? { ...x, title: v } : x
                    );
                    setData({ ...data, offers: { ...data.offers, items } });
                  }}
                />
                <Field
                  label="Title accent"
                  value={offer.titleAccent}
                  onChange={(v) => {
                    const items = data.offers.items.map((x, j) =>
                      j === i ? { ...x, titleAccent: v } : x
                    );
                    setData({ ...data, offers: { ...data.offers, items } });
                  }}
                />
                <Field
                  label="CTA label"
                  value={offer.ctaLabel}
                  onChange={(v) => {
                    const items = data.offers.items.map((x, j) =>
                      j === i ? { ...x, ctaLabel: v } : x
                    );
                    setData({ ...data, offers: { ...data.offers, items } });
                  }}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Body"
                    multiline
                    value={offer.body}
                    onChange={(v) => {
                      const items = data.offers.items.map((x, j) =>
                        j === i ? { ...x, body: v } : x
                      );
                      setData({ ...data, offers: { ...data.offers, items } });
                    }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="Package includes (one per line)"
                    multiline
                    value={(offer.includes ?? []).join("\n")}
                    onChange={(v) => {
                      const includes = v
                        .split("\n")
                        .map((l) => l.trim())
                        .filter(Boolean);
                      const items = data.offers.items.map((x, j) =>
                        j === i ? { ...x, includes } : x
                      );
                      setData({ ...data, offers: { ...data.offers, items } });
                    }}
                  />
                </div>
                <Field
                  label="Package price"
                  value={offer.price ?? ""}
                  onChange={(v) => {
                    const items = data.offers.items.map((x, j) =>
                      j === i ? { ...x, price: v } : x
                    );
                    setData({ ...data, offers: { ...data.offers, items } });
                  }}
                />
                <Field
                  label="CTA link"
                  value={offer.ctaHref}
                  onChange={(v) => {
                    const items = data.offers.items.map((x, j) =>
                      j === i ? { ...x, ctaHref: v } : x
                    );
                    setData({ ...data, offers: { ...data.offers, items } });
                  }}
                />
                <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row">
                  <button
                    type="button"
                    className="console-btn-soft flex-1"
                    disabled={i === 0}
                    onClick={() => moveOffer(i, i - 1)}
                  >
                    ↑ Move up
                  </button>
                  <button
                    type="button"
                    className="console-btn-soft flex-1"
                    disabled={i === data.offers.items.length - 1}
                    onClick={() => moveOffer(i, i + 1)}
                  >
                    ↓ Move down
                  </button>
                  <button
                    type="button"
                    className="console-btn-soft flex-1 text-rose-600"
                    onClick={() => {
                      const items = data.offers.items.filter((_, j) => j !== i);
                      setData({ ...data, offers: { ...data.offers, items } });
                    }}
                  >
                    Remove offer
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="console-btn-soft"
              onClick={() =>
                setData({
                  ...data,
                  offers: {
                    ...data.offers,
                    items: [
                      ...data.offers.items,
                      {
                        id: `offer-${Date.now()}`,
                        badge: "New",
                        title: "New",
                        titleAccent: "offer",
                        body: "",
                        includes: ["Item one", "Item two"],
                        price: "From Rs. 0",
                        ctaLabel: "Book this package",
                        ctaHref: "/book",
                      },
                    ],
                  },
                })
              }
            >
              + Add offer
            </button>
          </div>
        ) : null}

        {tab === "testimonials" ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Eyebrow"
                value={data.testimonials.eyebrow}
                onChange={(v) =>
                  setData({
                    ...data,
                    testimonials: { ...data.testimonials, eyebrow: v },
                  })
                }
              />
              <Field
                label="Title"
                value={data.testimonials.title}
                onChange={(v) =>
                  setData({
                    ...data,
                    testimonials: { ...data.testimonials, title: v },
                  })
                }
              />
            </div>
            {data.testimonials.items.map((t, i) => (
              <div
                key={i}
                className="grid gap-3 rounded-xl border border-line bg-canvas/50 p-4"
              >
                <Field
                  label="Quote"
                  multiline
                  value={t.quote}
                  onChange={(v) => {
                    const items = data.testimonials.items.map((x, j) =>
                      j === i ? { ...x, quote: v } : x
                    );
                    setData({
                      ...data,
                      testimonials: { ...data.testimonials, items },
                    });
                  }}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Name"
                    value={t.name}
                    onChange={(v) => {
                      const items = data.testimonials.items.map((x, j) =>
                        j === i ? { ...x, name: v } : x
                      );
                      setData({
                        ...data,
                        testimonials: { ...data.testimonials, items },
                      });
                    }}
                  />
                  <Field
                    label="Role"
                    value={t.role}
                    onChange={(v) => {
                      const items = data.testimonials.items.map((x, j) =>
                        j === i ? { ...x, role: v } : x
                      );
                      setData({
                        ...data,
                        testimonials: { ...data.testimonials, items },
                      });
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="console-btn-soft text-rose-600"
                  onClick={() =>
                    setData({
                      ...data,
                      testimonials: {
                        ...data.testimonials,
                        items: data.testimonials.items.filter((_, j) => j !== i),
                      },
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="console-btn-soft"
              onClick={() =>
                setData({
                  ...data,
                  testimonials: {
                    ...data.testimonials,
                    items: [
                      ...data.testimonials.items,
                      {
                        quote: "New client quote…",
                        name: "Client name",
                        role: "Service",
                      },
                    ],
                  },
                })
              }
            >
              + Add testimonial
            </button>
          </div>
        ) : null}

        {tab === "cta" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Title"
              value={data.cta.title}
              onChange={(v) =>
                setData({ ...data, cta: { ...data.cta, title: v } })
              }
            />
            <Field
              label="Subcopy"
              value={data.cta.subcopy}
              onChange={(v) =>
                setData({ ...data, cta: { ...data.cta, subcopy: v } })
              }
            />
            <div className="sm:col-span-2">
              <Field
                label="Trust points (one per line)"
                multiline
                value={data.cta.trustPoints.join("\n")}
                onChange={(v) =>
                  setData({
                    ...data,
                    cta: {
                      ...data.cta,
                      trustPoints: v
                        .split("\n")
                        .map((l) => l.trim())
                        .filter(Boolean),
                    },
                  })
                }
              />
            </div>
            {data.cta.proof.map((p, i) => (
              <div
                key={i}
                className="grid gap-2 rounded-xl border border-line bg-canvas/50 p-3 sm:col-span-2 sm:grid-cols-3"
              >
                <Field
                  label="Name"
                  value={p.name}
                  onChange={(v) => {
                    const proof = data.cta.proof.map((x, j) =>
                      j === i ? { ...x, name: v } : x
                    );
                    setData({ ...data, cta: { ...data.cta, proof } });
                  }}
                />
                <Field
                  label="Event"
                  value={p.event}
                  onChange={(v) => {
                    const proof = data.cta.proof.map((x, j) =>
                      j === i ? { ...x, event: v } : x
                    );
                    setData({ ...data, cta: { ...data.cta, proof } });
                  }}
                />
                <Field
                  label="Line"
                  value={p.line}
                  onChange={(v) => {
                    const proof = data.cta.proof.map((x, j) =>
                      j === i ? { ...x, line: v } : x
                    );
                    setData({ ...data, cta: { ...data.cta, proof } });
                  }}
                />
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
