"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/cms-types";

export function AdminSiteEditor({ initial }: { initial: SiteContent }) {
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  function set<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/content/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Save failed");
      const saved = (await res.json()) as SiteContent;
      setData(saved);
      setMsg("Saved — header, footer aur WhatsApp update ho gaye.");
    } catch {
      setMsg("Save fail hua. Dobara try karein.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="console-card mt-7 space-y-5 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg text-ink">Site identity</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Phone, email, address — public site pe live update.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="console-btn"
        >
          {saving ? "Saving…" : "Save site"}
        </button>
      </div>

      {msg ? (
        <p className="rounded-xl border border-line bg-canvas-alt px-4 py-3 text-sm text-ink-soft">
          {msg}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            ["name", "Salon name"],
            ["tagline", "Tagline"],
            ["phone", "Phone"],
            ["phoneDigits", "WhatsApp digits (no +)"],
            ["email", "Email"],
            ["address", "Address / areas"],
            ["logo", "Logo path (leave /logo-adaa.png for the built-in Adaa logo)"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block sm:col-span-1">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              {label}
            </span>
            <input
              className="console-field"
              value={data[key]}
              onChange={(e) => set(key, e.target.value)}
            />
          </label>
        ))}
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Description
          </span>
          <textarea
            className="console-field min-h-[88px]"
            value={data.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </label>
        {(
          [
            ["instagram", "Instagram URL"],
            ["facebook", "Facebook URL"],
            ["tiktok", "TikTok URL"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              {label}
            </span>
            <input
              className="console-field"
              value={data.social[key]}
              onChange={(e) =>
                set("social", { ...data.social, [key]: e.target.value })
              }
            />
          </label>
        ))}
      </div>
    </section>
  );
}
