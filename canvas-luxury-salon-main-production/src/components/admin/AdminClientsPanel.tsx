"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClientAvatar } from "@/components/admin/console-ui";
import {
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconDownload,
  IconIdCard,
  IconMail,
  IconMapPin,
  IconMoreVertical,
  IconNote,
  IconPhone,
  IconPlus,
  IconSearch,
  IconUsers,
} from "@/components/admin/icons";
import type { SalonClient } from "@/lib/clients-types";

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  idCard: "",
  address: "",
  notes: "",
};

const fieldLabel =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted";

const ROW_ACCENTS = [
  "from-accent to-accent-strong",
  "from-gilt to-amber-600",
  "from-emerald-400 to-teal-700",
] as const;

const AVATAR_BG = [
  "bg-accent-soft text-accent",
  "bg-gilt/15 text-gilt",
  "bg-emerald-50 text-emerald-700",
] as const;

const GRID =
  "grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,1.1fr)_minmax(0,1fr)_2.5rem] items-center gap-3";

function clientsToCsv(list: SalonClient[]): string {
  const headers = ["Name", "Phone", "Email", "ID Card", "Address", "Note"];
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = list.map((c) =>
    [
      c.name,
      c.phone,
      c.email ?? "",
      c.idCard ?? "",
      c.address ?? "",
      c.notes ?? "",
    ]
      .map((v) => esc(String(v)))
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function Cell({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted lg:hidden">
        {label}
      </p>
      {children}
    </div>
  );
}

function ClientActionsMenu({
  client,
  open,
  onToggle,
  onEdit,
  onDelete,
  busy,
}: {
  client: SalonClient;
  open: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  busy: boolean;
}) {
  return (
    <div className="relative" data-client-menu-root>
      <button
        type="button"
        aria-label={`Actions for ${client.name}`}
        aria-expanded={open}
        aria-haspopup="menu"
        disabled={busy}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
          open
            ? "bg-accent-soft text-accent"
            : "text-accent hover:bg-accent-soft"
        }`}
      >
        <IconMoreVertical className="h-4 w-4" />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-[100] mt-1.5 min-w-[9.5rem] overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-lift-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-ink-soft transition hover:bg-canvas hover:text-accent"
          >
            Edit
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rose-600 transition hover:bg-rose-50"
          >
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function AdminClientsPanel() {
  const [clients, setClients] = useState<SalonClient[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/clients", { cache: "no-store" });
      if (!res.ok) throw new Error("Could not load clients");
      const data = (await res.json()) as SalonClient[];
      setClients(Array.isArray(data) ? data : []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [query, pageSize]);

  useEffect(() => {
    if (!menuId) return;
    function onPointerDown(e: PointerEvent) {
      const el = e.target as HTMLElement;
      if (el.closest("[data-client-menu-root]")) return;
      setMenuId(null);
    }
    const t = window.setTimeout(() => {
      document.addEventListener("pointerdown", onPointerDown);
    }, 0);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) =>
      [
        c.name,
        c.phone,
        c.email ?? "",
        c.idCard ?? "",
        c.address ?? "",
        c.notes ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [clients, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pageRows = filtered.slice(pageStart, pageStart + pageSize);
  const pageEnd = Math.min(pageStart + pageRows.length, filtered.length);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setFormOpen(true);
  }

  function startEdit(c: SalonClient) {
    setEditingId(c.id);
    setForm({
      name: c.name,
      phone: c.phone,
      email: c.email ?? "",
      idCard: c.idCard ?? "",
      address: c.address ?? "",
      notes: c.notes ?? "",
    });
    setError("");
    setMenuId(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Client name required.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/clients", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      });
      const data = (await res.json()) as SalonClient & { error?: string };
      if (!res.ok) throw new Error(data.error || "Save failed");
      if (editingId) {
        setClients((list) =>
          list.map((c) => (c.id === editingId ? data : c))
        );
      } else {
        setClients((list) => [data, ...list]);
      }
      closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string, name: string) {
    if (
      !window.confirm(
        `"${name}" delete karna hai? Ye client card hamesha ke liye hat jayega.`
      )
    ) {
      return;
    }
    setBusy(true);
    setMenuId(null);
    try {
      const res = await fetch("/api/admin/clients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setClients((list) => list.filter((c) => c.id !== id));
      if (editingId === id) closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  function exportClients() {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`ha-clients-${stamp}.csv`, clientsToCsv(filtered));
  }

  return (
    <div className="mt-7">
      <section className="console-card relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-accent/5 blur-2xl" />
          <div className="absolute -left-6 top-24 h-28 w-28 rounded-full bg-gilt/10 blur-2xl" />
        </div>

        {/* Header */}
        <div className="relative border-b border-line px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent-soft text-accent">
                <IconUsers className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-xl text-ink sm:text-2xl">
                  Saved Clients
                </h2>
                <p className="mt-1 flex items-center gap-2 text-xs text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {clients.length} saved client{clients.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative min-w-0 flex-1 sm:w-72 lg:w-80">
                <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, phone, email…"
                  className="console-field rounded-full pl-10"
                />
              </label>
              <button type="button" onClick={openAdd} className="console-btn shrink-0">
                <IconPlus className="h-4 w-4" />
                Add Client
              </button>
            </div>
          </div>
        </div>

        {/* Column headers — desktop */}
        <div
          className={`${GRID} hidden border-b border-line bg-canvas/80 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted lg:grid lg:px-6`}
        >
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-accent-soft/80 px-2 py-1 text-accent">
            <IconUsers className="h-3.5 w-3.5" />
            Name
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconPhone className="h-3.5 w-3.5" />
            Phone
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconMail className="h-3.5 w-3.5" />
            Email
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconIdCard className="h-3.5 w-3.5" />
            ID Card
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconMapPin className="h-3.5 w-3.5" />
            Address
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconNote className="h-3.5 w-3.5" />
            Note
          </span>
          <span aria-hidden />
        </div>

        {/* Rows */}
        <ul className="relative divide-y divide-line/80 overflow-visible">
          {!loaded ? (
            <li className="px-6 py-14 text-center text-sm text-muted">
              Loading clients…
            </li>
          ) : pageRows.length === 0 ? (
            <li className="mx-5 my-6 rounded-2xl border border-dashed border-line bg-canvas/50 px-4 py-14 text-center sm:mx-6">
              <p className="font-display text-lg text-ink">No clients yet</p>
              <p className="mt-2 text-sm text-muted">
                {clients.length === 0
                  ? "Add Client se pehla record save karein."
                  : "Search se koi match nahi."}
              </p>
              {clients.length === 0 ? (
                <button
                  type="button"
                  onClick={openAdd}
                  className="console-btn mt-5"
                >
                  <IconPlus className="h-4 w-4" />
                  Add Client
                </button>
              ) : null}
            </li>
          ) : (
            pageRows.map((c, i) => {
              const accent = ROW_ACCENTS[i % ROW_ACCENTS.length];
              const avatarBg = AVATAR_BG[i % AVATAR_BG.length];
              return (
                <li
                  key={c.id}
                  className={`group relative overflow-visible transition hover:bg-canvas/50 ${
                    editingId === c.id ? "bg-accent-soft/25" : ""
                  } ${menuId === c.id ? "z-20" : ""}`}
                >
                  <div
                    className={`absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-gradient-to-b ${accent}`}
                    aria-hidden
                  />

                  {/* Desktop row */}
                  <div className={`${GRID} hidden px-6 py-4 lg:grid`}>
                    <div className="flex min-w-0 items-center gap-3 pl-2">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold uppercase ${avatarBg}`}
                      >
                        {c.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">
                          {c.name}
                        </p>
                      </div>
                    </div>
                    <p className="truncate text-sm text-ink-soft">
                      {c.phone || "—"}
                    </p>
                    <p className="truncate text-sm text-ink-soft">
                      {c.email || "—"}
                    </p>
                    <p className="truncate font-mono text-xs text-ink-soft">
                      {c.idCard || "—"}
                    </p>
                    <p className="truncate text-sm text-ink-soft">
                      {c.address || "—"}
                    </p>
                    <p className="truncate text-sm text-muted">
                      {c.notes || "—"}
                    </p>
                    <ClientActionsMenu
                      client={c}
                      open={menuId === c.id}
                      busy={busy}
                      onToggle={() =>
                        setMenuId((cur) => (cur === c.id ? null : c.id))
                      }
                      onEdit={() => startEdit(c)}
                      onDelete={() => void remove(c.id, c.name)}
                    />
                  </div>

                  {/* Mobile card */}
                  <div className="space-y-3 overflow-visible px-5 py-4 pl-6 lg:hidden">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <ClientAvatar name={c.name} className="h-10 w-10 text-xs" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-ink">
                            {c.name}
                          </p>
                        </div>
                      </div>
                      <ClientActionsMenu
                        client={c}
                        open={menuId === c.id}
                        busy={busy}
                        onToggle={() =>
                          setMenuId((cur) => (cur === c.id ? null : c.id))
                        }
                        onEdit={() => startEdit(c)}
                        onDelete={() => void remove(c.id, c.name)}
                      />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Cell label="Email">
                        <p className="truncate text-sm text-ink-soft">
                          {c.email || "—"}
                        </p>
                      </Cell>
                      <Cell label="ID Card">
                        <p className="truncate font-mono text-xs text-ink-soft">
                          {c.idCard || "—"}
                        </p>
                      </Cell>
                      <Cell label="Address" className="sm:col-span-2">
                        <p className="text-sm text-ink-soft">
                          {c.address || "—"}
                        </p>
                      </Cell>
                      {c.notes ? (
                        <Cell label="Note" className="sm:col-span-2">
                          <p className="text-sm text-muted">{c.notes}</p>
                        </Cell>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>

        {/* Footer */}
        {loaded && filtered.length > 0 ? (
          <div className="flex flex-col gap-4 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
              <label className="inline-flex items-center gap-2">
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="console-field w-auto cursor-pointer py-1.5 pr-8 text-xs"
                >
                  {[10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <span>
                Showing {pageStart + 1} to {pageEnd} of {filtered.length}{" "}
                client{filtered.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-accent/45 hover:text-accent disabled:opacity-40"
                >
                  <IconChevronLeft className="h-4 w-4" />
                </button>
                <span className="flex h-8 min-w-[2rem] items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent-strong px-2 text-xs font-semibold text-accent-fg">
                  {safePage}
                </span>
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Next page"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-accent/45 hover:text-accent disabled:opacity-40"
                >
                  <IconChevronRight className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={exportClients}
                className="console-btn-soft"
              >
                <IconDownload className="h-4 w-4 text-accent" />
                Export
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {/* Add / edit modal */}
      <AnimatePresence>
        {formOpen ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close form"
              onClick={closeForm}
              className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={editingId ? "Edit client" : "Add client"}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-surface shadow-lift-lg"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-accent to-accent-strong" />
              <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                    Client book
                  </p>
                  <h3 className="mt-1 font-display text-xl text-ink">
                    {editingId ? "Edit client" : "Add client"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeForm}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:text-accent"
                >
                  <IconClose className="h-4 w-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => void save(e)}
                className="space-y-4 px-5 py-5 sm:px-6"
              >
                <label className="block">
                  <span className={fieldLabel}>Name *</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="console-field"
                    placeholder="Full name"
                    disabled={busy}
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={fieldLabel}>Phone</span>
                    <input
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      className="console-field"
                      placeholder="03xx…"
                      disabled={busy}
                    />
                  </label>
                  <label className="block">
                    <span className={fieldLabel}>Email</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="console-field"
                      placeholder="name@email.com"
                      disabled={busy}
                    />
                  </label>
                </div>
                <label className="block">
                  <span className={fieldLabel}>ID card number</span>
                  <input
                    value={form.idCard}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, idCard: e.target.value }))
                    }
                    className="console-field"
                    placeholder="xxxxx-xxxxxxx-x"
                    disabled={busy}
                  />
                </label>
                <label className="block">
                  <span className={fieldLabel}>Address</span>
                  <input
                    value={form.address}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, address: e.target.value }))
                    }
                    className="console-field"
                    placeholder="Home / venue"
                    disabled={busy}
                  />
                </label>
                <label className="block">
                  <span className={fieldLabel}>Note</span>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, notes: e.target.value }))
                    }
                    className="console-field resize-none"
                    placeholder="Package, preferences…"
                    disabled={busy}
                  />
                </label>

                {error ? (
                  <p className="text-sm text-rose-600" role="status">
                    {error}
                  </p>
                ) : null}

                <div className="flex flex-wrap gap-2 pt-1">
                  <button type="submit" disabled={busy} className="console-btn">
                    {busy
                      ? "Saving…"
                      : editingId
                        ? "Save changes"
                        : "Save client"}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={busy}
                    className="console-btn-soft"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
