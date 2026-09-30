"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SlipDocument } from "@/components/slips/SlipDocument";
import { IconPlus, IconSearch } from "@/components/admin/icons";
import type { SiteContent } from "@/lib/cms-types";
import type { SalonClient } from "@/lib/clients-types";
import type { Slip, SlipPaymentMethod } from "@/lib/slips-types";
import { SLIP_PAYMENT_LABELS } from "@/lib/slips-types";
import {
  SLIP_STATUS_LABEL,
  buildSlipShareText,
  computeSlipTotals,
  formatRs,
  formatSlipDate,
  whatsappDigits,
} from "@/lib/slips-utils";

type DraftItem = { id: string; description: string; qty: string; price: string };

type Draft = {
  id: string | null;
  publicId: string | null;
  number: string;
  date: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  idCard: string;
  appointment: string;
  staff: string;
  items: DraftItem[];
  discount: string;
  advance: string;
  paymentMethod: SlipPaymentMethod;
  notes: string;
};

const label =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted";

function uid() {
  return `i_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function today() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function blankItem(): DraftItem {
  return { id: uid(), description: "", qty: "1", price: "" };
}

function blankDraft(): Draft {
  return {
    id: null,
    publicId: null,
    number: "",
    date: today(),
    name: "",
    phone: "",
    email: "",
    address: "",
    idCard: "",
    appointment: "",
    staff: "",
    items: [blankItem()],
    discount: "",
    advance: "",
    paymentMethod: "cash",
    notes: "",
  };
}

function draftFromSlip(s: Slip): Draft {
  return {
    id: s.id,
    publicId: s.publicId,
    number: s.number,
    date: s.date,
    name: s.client.name,
    phone: s.client.phone,
    email: s.client.email,
    address: s.client.address,
    idCard: s.client.idCard,
    appointment: s.appointment,
    staff: s.staff,
    items: s.items.length
      ? s.items.map((i) => ({
          id: i.id,
          description: i.description,
          qty: String(i.qty),
          price: i.price ? String(i.price) : "",
        }))
      : [blankItem()],
    discount: s.discount ? String(s.discount) : "",
    advance: s.advance ? String(s.advance) : "",
    paymentMethod: s.paymentMethod,
    notes: s.notes,
  };
}

function toNumber(v: string): number {
  const n = Number(v.replace(/,/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function draftToPayload(d: Draft) {
  return {
    date: d.date,
    client: {
      name: d.name,
      phone: d.phone,
      email: d.email,
      address: d.address,
      idCard: d.idCard,
    },
    appointment: d.appointment,
    staff: d.staff,
    items: d.items
      .filter((i) => i.description.trim())
      .map((i) => ({
        id: i.id,
        description: i.description,
        qty: Math.max(1, Math.round(toNumber(i.qty)) || 1),
        price: toNumber(i.price),
      })),
    discount: toNumber(d.discount),
    advance: toNumber(d.advance),
    paymentMethod: d.paymentMethod,
    notes: d.notes,
  };
}

/** Shape the preview / share helpers expect, built from the (possibly unsaved) draft. */
function draftAsSlip(d: Draft): Slip {
  const p = draftToPayload(d);
  return {
    id: d.id ?? "draft",
    publicId: d.publicId ?? "",
    number: d.number || "Auto on save",
    createdAt: "",
    updatedAt: "",
    ...p,
  };
}

const STATUS_CLS = {
  paid: "bg-emerald-500/15 text-emerald-300",
  partial: "bg-amber-500/15 text-amber-300",
  unpaid: "bg-rose-500/15 text-rose-300",
} as const;

export function AdminSlipsPanel({ site }: { site: SiteContent }) {
  const [slips, setSlips] = useState<Slip[]>([]);
  const [clients, setClients] = useState<SalonClient[]>([]);
  const [draft, setDraft] = useState<Draft>(blankDraft);
  const [saveClient, setSaveClient] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const [sRes, cRes] = await Promise.all([
        fetch("/api/admin/slips", { cache: "no-store" }),
        fetch("/api/admin/clients", { cache: "no-store" }),
      ]);
      if (sRes.ok) setSlips((await sRes.json()) as Slip[]);
      if (cRes.ok) setClients((await cRes.json()) as SalonClient[]);
    } catch {
      setNotice({ tone: "err", text: "Could not load slips." });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const slipView = useMemo(() => draftAsSlip(draft), [draft]);
  const totals = useMemo(() => computeSlipTotals(slipView), [slipView]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return slips;
    return slips.filter((s) =>
      [s.number, s.client.name, s.client.phone, s.date]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [slips, query]);

  function patch(p: Partial<Draft>) {
    setDraft((d) => ({ ...d, ...p }));
    setNotice(null);
  }

  function patchItem(id: string, p: Partial<DraftItem>) {
    setDraft((d) => ({
      ...d,
      items: d.items.map((i) => (i.id === id ? { ...i, ...p } : i)),
    }));
    setNotice(null);
  }

  function pickClient(id: string) {
    const c = clients.find((x) => x.id === id);
    if (!c) return;
    patch({
      name: c.name,
      phone: c.phone,
      email: c.email ?? "",
      address: c.address ?? "",
      idCard: c.idCard ?? "",
    });
    setEmailTo(c.email ?? "");
  }

  function newSlip() {
    setDraft(blankDraft());
    setSaveClient(false);
    setEmailTo("");
    setNotice(null);
  }

  function editSlip(s: Slip) {
    setDraft(draftFromSlip(s));
    setEmailTo(s.client.email);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /** Save (create or update). Returns the saved slip, or null after showing an error. */
  async function persist(): Promise<Slip | null> {
    const payload = draftToPayload(draft);
    if (!payload.client.name.trim()) {
      setNotice({ tone: "err", text: "Client name is required." });
      return null;
    }
    if (payload.items.length === 0) {
      setNotice({ tone: "err", text: "Add at least one service / item with a description." });
      return null;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/slips", {
        method: draft.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft.id ? { id: draft.id, ...payload } : payload),
      });
      const data = (await res.json()) as Slip & { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not save the slip.");
      setSlips((list) =>
        draft.id ? list.map((s) => (s.id === data.id ? data : s)) : [data, ...list]
      );
      setDraft(draftFromSlip(data));

      if (
        saveClient &&
        payload.client.name &&
        !clients.some(
          (c) => payload.client.phone && c.phone === payload.client.phone
        )
      ) {
        const cRes = await fetch("/api/admin/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload.client),
        });
        if (cRes.ok) {
          const created = (await cRes.json()) as SalonClient;
          setClients((l) => [created, ...l]);
        }
        setSaveClient(false);
      }
      return data;
    } catch (e) {
      setNotice({ tone: "err", text: e instanceof Error ? e.message : "Save failed." });
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function onSave() {
    const saved = await persist();
    if (saved) setNotice({ tone: "ok", text: `Saved as ${saved.number}.` });
  }

  const linkFor = (s: Pick<Slip, "publicId">) =>
    `${window.location.origin}/slip/${s.publicId}`;

  async function shareWhatsApp(target?: Slip) {
    // Open the tab synchronously so mobile browsers do not block it after the await.
    const win = window.open("", "_blank");
    const s = target ?? (await persist());
    if (!s) {
      win?.close();
      return;
    }
    const digits = whatsappDigits(s.client.phone);
    if (!digits) {
      win?.close();
      setNotice({ tone: "err", text: "Add a valid client phone number to share on WhatsApp." });
      return;
    }
    const url = `https://wa.me/${digits}?text=${encodeURIComponent(
      buildSlipShareText(s, site.name, linkFor(s))
    )}`;
    if (win) win.location.href = url;
    else window.location.href = url;
    setNotice({ tone: "ok", text: `WhatsApp opened for ${s.number}.` });
  }

  async function shareEmail(target?: Slip) {
    const s = target ?? (await persist());
    if (!s) return;
    const to = (target ? target.client.email : emailTo || s.client.email).trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      setNotice({ tone: "err", text: "Enter a valid client email address first." });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/slips/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id, to, origin: window.location.origin }),
      });
      const data = (await res.json()) as { sent?: boolean; reason?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Email failed.");
      if (data.sent) {
        setNotice({ tone: "ok", text: `Emailed ${s.number} to ${to}.` });
      } else {
        // Email service not configured on the server → open the admin's own mail app.
        const subject = `Your slip ${s.number} — ${site.name}`;
        const body = buildSlipShareText(s, site.name, linkFor(s));
        window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setNotice({
          tone: "ok",
          text: "Server email is not set up, so your mail app was opened instead.",
        });
      }
    } catch (e) {
      setNotice({ tone: "err", text: e instanceof Error ? e.message : "Email failed." });
    } finally {
      setBusy(false);
    }
  }

  async function printSlip(target?: Slip) {
    const win = window.open("", "_blank");
    const s = target ?? (await persist());
    if (!s) {
      win?.close();
      return;
    }
    const url = `${linkFor(s)}?print=1`;
    if (win) win.location.href = url;
    else window.location.href = url;
  }

  async function copyLink(target?: Slip) {
    const s = target ?? (await persist());
    if (!s) return;
    try {
      await navigator.clipboard.writeText(linkFor(s));
      setNotice({ tone: "ok", text: "Slip link copied." });
    } catch {
      window.prompt("Copy this slip link:", linkFor(s));
    }
  }

  async function remove(s: Slip) {
    if (!window.confirm(`Delete slip ${s.number} for ${s.client.name}? Its public link will stop working.`)) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/slips", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id }),
      });
      if (!res.ok) throw new Error("Delete failed.");
      setSlips((l) => l.filter((x) => x.id !== s.id));
      if (draft.id === s.id) newSlip();
    } catch (e) {
      setNotice({ tone: "err", text: e instanceof Error ? e.message : "Delete failed." });
    } finally {
      setBusy(false);
    }
  }

  const saved = Boolean(draft.id);

  return (
    <div className="mt-7 space-y-7">
      <div className="grid gap-7 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* ───────────── Form ───────────── */}
        <section className="console-card space-y-6 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl text-ink">
                {saved ? `Editing ${draft.number}` : "New slip"}
              </h2>
              <p className="text-xs text-muted">
                Fill in the details — the slip preview updates live.
              </p>
            </div>
            <button type="button" onClick={newSlip} className="console-btn-soft">
              <IconPlus className="h-4 w-4" /> New slip
            </button>
          </div>

          {/* Client */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-accent">Client details</legend>
            {clients.length > 0 ? (
              <div>
                <label className={label} htmlFor="slip-client-pick">
                  Pick a saved client
                </label>
                <select
                  id="slip-client-pick"
                  className="console-field"
                  value=""
                  onChange={(e) => pickClient(e.target.value)}
                >
                  <option value="">— choose to auto-fill —</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.phone ? ` · ${c.phone}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="slip-name">Client name *</label>
                <input id="slip-name" className="console-field" value={draft.name} onChange={(e) => patch({ name: e.target.value })} />
              </div>
              <div>
                <label className={label} htmlFor="slip-phone">Phone / WhatsApp</label>
                <input id="slip-phone" inputMode="tel" placeholder="0300 1234567" className="console-field" value={draft.phone} onChange={(e) => patch({ phone: e.target.value })} />
              </div>
              <div>
                <label className={label} htmlFor="slip-email">Email</label>
                <input id="slip-email" type="email" className="console-field" value={draft.email} onChange={(e) => { patch({ email: e.target.value }); setEmailTo(e.target.value); }} />
              </div>
              <div>
                <label className={label} htmlFor="slip-id">CNIC (optional)</label>
                <input id="slip-id" className="console-field" value={draft.idCard} onChange={(e) => patch({ idCard: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="slip-address">Address</label>
                <input id="slip-address" className="console-field" value={draft.address} onChange={(e) => patch({ address: e.target.value })} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-ink-soft">
              <input type="checkbox" checked={saveClient} onChange={(e) => setSaveClient(e.target.checked)} className="h-4 w-4 accent-[#C9A35B]" />
              Also save this client in the Clients list
            </label>
          </fieldset>

          {/* Service */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-accent">Service details</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className={label} htmlFor="slip-date">Slip date</label>
                <input id="slip-date" type="date" className="console-field" value={draft.date} onChange={(e) => patch({ date: e.target.value })} />
              </div>
              <div>
                <label className={label} htmlFor="slip-appt">Appointment</label>
                <input id="slip-appt" placeholder="e.g. 12 Oct, 4:00 PM" className="console-field" value={draft.appointment} onChange={(e) => patch({ appointment: e.target.value })} />
              </div>
              <div>
                <label className={label} htmlFor="slip-staff">Artist / staff</label>
                <input id="slip-staff" className="console-field" value={draft.staff} onChange={(e) => patch({ staff: e.target.value })} />
              </div>
            </div>
          </fieldset>

          {/* Items */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-accent">Services / items</legend>
            <div className="space-y-2.5">
              {draft.items.map((it, idx) => (
                <div key={it.id} className="grid grid-cols-[minmax(0,1fr)_4.25rem_6.5rem_2.25rem] items-center gap-2">
                  <input aria-label={`Item ${idx + 1} description`} placeholder="Service / item" className="console-field" value={it.description} onChange={(e) => patchItem(it.id, { description: e.target.value })} />
                  <input aria-label={`Item ${idx + 1} quantity`} inputMode="numeric" placeholder="Qty" className="console-field px-2 text-center" value={it.qty} onChange={(e) => patchItem(it.id, { qty: e.target.value })} />
                  <input aria-label={`Item ${idx + 1} price`} inputMode="numeric" placeholder="Price" className="console-field px-2" value={it.price} onChange={(e) => patchItem(it.id, { price: e.target.value })} />
                  <button
                    type="button"
                    aria-label={`Remove item ${idx + 1}`}
                    disabled={draft.items.length === 1}
                    onClick={() => setDraft((d) => ({ ...d, items: d.items.filter((x) => x.id !== it.id) }))}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-rose-400 hover:text-rose-400 disabled:opacity-30"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setDraft((d) => ({ ...d, items: [...d.items, blankItem()] }))} className="console-btn-soft">
              <IconPlus className="h-4 w-4" /> Add item
            </button>
          </fieldset>

          {/* Payment */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-accent">Payment</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className={label} htmlFor="slip-discount">Discount (Rs.)</label>
                <input id="slip-discount" inputMode="numeric" className="console-field" value={draft.discount} onChange={(e) => patch({ discount: e.target.value })} />
              </div>
              <div>
                <label className={label} htmlFor="slip-advance">Advance paid (Rs.)</label>
                <input id="slip-advance" inputMode="numeric" className="console-field" value={draft.advance} onChange={(e) => patch({ advance: e.target.value })} />
              </div>
              <div>
                <label className={label} htmlFor="slip-method">Payment method</label>
                <select id="slip-method" className="console-field" value={draft.paymentMethod} onChange={(e) => patch({ paymentMethod: e.target.value as SlipPaymentMethod })}>
                  {(Object.keys(SLIP_PAYMENT_LABELS) as SlipPaymentMethod[]).map((k) => (
                    <option key={k} value={k}>{SLIP_PAYMENT_LABELS[k]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={label} htmlFor="slip-notes">Notes (shown on slip)</label>
              <textarea id="slip-notes" rows={2} className="console-field" value={draft.notes} onChange={(e) => patch({ notes: e.target.value })} />
            </div>
            <p className="rounded-xl border border-line bg-canvas/60 px-4 py-3 text-sm text-ink-soft">
              Total <strong className="text-ink">{formatRs(totals.total)}</strong>
              {totals.advance > 0 ? <> · Advance {formatRs(totals.advance)}</> : null}
              {" · "}Balance <strong className="text-accent">{formatRs(totals.balance)}</strong>
              {" · "}{SLIP_STATUS_LABEL[totals.status]}
            </p>
          </fieldset>

          {notice ? (
            <p role="status" className={`rounded-xl px-4 py-2.5 text-sm ${notice.tone === "ok" ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"}`}>
              {notice.text}
            </p>
          ) : null}

          <div className="space-y-3 border-t border-line pt-5">
            <button type="button" disabled={busy} onClick={() => void onSave()} className="console-btn w-full sm:w-auto">
              {busy ? "Working…" : saved ? "Save changes" : "Save slip"}
            </button>
            <div>
              <p className={label}>Share this slip</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={busy} onClick={() => void shareWhatsApp()} className="console-btn-soft">WhatsApp</button>
                <button type="button" disabled={busy} onClick={() => void printSlip()} className="console-btn-soft">Print / PDF</button>
                <button type="button" disabled={busy} onClick={() => void copyLink()} className="console-btn-soft">Copy link</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <input type="email" aria-label="Send slip to email" placeholder="client@email.com" className="console-field min-w-0 flex-1 basis-48" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} />
                <button type="button" disabled={busy} onClick={() => void shareEmail()} className="console-btn-soft">Email</button>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">
                Sharing saves the slip first. The client gets a private link they can open, print or save as PDF.
              </p>
            </div>
          </div>
        </section>

        {/* ───────────── Preview ───────────── */}
        <section className="min-w-0">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Live preview</p>
          <SlipDocument slip={slipView} site={site} />
        </section>
      </div>

      {/* ───────────── Saved slips ───────────── */}
      <section className="console-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl text-ink">
            Saved slips <span className="text-sm text-muted">({slips.length})</span>
          </h2>
          <div className="relative w-full sm:w-72">
            <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input aria-label="Search slips" placeholder="Search number, name, phone…" className="console-field pl-10" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-line px-4 py-8 text-center text-sm text-muted">
            {slips.length === 0 ? "No slips yet — create the first one above." : "No slips match your search."}
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-line">
            {filtered.map((s) => {
              const t = computeSlipTotals(s);
              return (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                  <div className="min-w-0 flex-1 basis-56">
                    <p className="truncate text-sm font-semibold text-ink">
                      {s.number} · {s.client.name}
                    </p>
                    <p className="text-xs text-muted">
                      {formatSlipDate(s.date)} · {formatRs(t.total)}
                      {t.balance > 0 ? ` · Balance ${formatRs(t.balance)}` : ""}
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${STATUS_CLS[t.status]}`}>
                    {SLIP_STATUS_LABEL[t.status]}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button type="button" className="console-btn-soft" onClick={() => editSlip(s)}>Edit</button>
                    <button type="button" className="console-btn-soft" onClick={() => void shareWhatsApp(s)}>WhatsApp</button>
                    <button type="button" className="console-btn-soft" onClick={() => void printSlip(s)}>Print</button>
                    <button type="button" className="console-btn-soft" onClick={() => void copyLink(s)}>Link</button>
                    {s.client.email ? (
                      <button type="button" className="console-btn-soft" onClick={() => void shareEmail(s)}>Email</button>
                    ) : null}
                    <button type="button" className="console-btn-soft hover:!border-rose-400 hover:!text-rose-400" onClick={() => void remove(s)}>Delete</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
