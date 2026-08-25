"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  IconBriefcase,
  IconClose,
  IconPlus,
  IconSearch,
  IconXCircle,
} from "@/components/admin/icons";
import type { JobPost, JobType } from "@/lib/jobs-types";
import { JOB_TYPES } from "@/lib/jobs-types";

const EMPTY = {
  title: "",
  slug: "",
  location: "",
  type: "Full-time" as JobType,
  salaryText: "",
  description: "",
  applyWhatsApp: "",
  applyEmail: "",
  active: true,
};

const fieldLabel =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted";

export function AdminJobsPanel() {
  const [rows, setRows] = useState<JobPost[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/jobs", { cache: "no-store" });
      if (!res.ok) throw new Error("Could not load jobs");
      const data = (await res.json()) as JobPost[];
      setRows(Array.isArray(data) ? data : []);
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((j) =>
      [j.title, j.slug, j.location ?? "", j.type, j.description]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, query]);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY);
    setError("");
    setFormOpen(true);
  }

  function startEdit(j: JobPost) {
    setEditingId(j.id);
    setForm({
      title: j.title,
      slug: j.slug,
      location: j.location ?? "",
      type: j.type,
      salaryText: j.salaryText ?? "",
      description: j.description,
      applyWhatsApp: j.applyWhatsApp ?? "",
      applyEmail: j.applyEmail ?? "",
      active: j.active,
    });
    setError("");
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY);
    setError("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title required.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/jobs", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingId ? { id: editingId, ...form } : form
        ),
      });
      const data = (await res.json()) as JobPost & { error?: string };
      if (!res.ok) throw new Error(data.error || "Save failed");
      if (editingId) {
        setRows((list) => list.map((j) => (j.id === editingId ? data : j)));
      } else {
        setRows((list) => [data, ...list]);
      }
      closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"?`)) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setRows((list) => list.filter((j) => j.id !== id));
      if (editingId === id) closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-7">
      <section className="console-card relative overflow-hidden">
        <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
              <IconBriefcase className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-xl text-ink">Jobs</h2>
              <p className="mt-1 text-xs text-muted">{rows.length} listings</p>
            </div>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <label className="relative min-w-[180px] flex-1 sm:w-56">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jobs…"
                className="console-field pl-9"
              />
            </label>
            <button type="button" onClick={openAdd} className="console-btn">
              <IconPlus className="h-4 w-4" />
              Add job
            </button>
          </div>
        </div>

        <ul className="divide-y divide-line">
          {!loaded ? (
            <li className="px-6 py-10 text-sm text-muted">Loading…</li>
          ) : filtered.length === 0 ? (
            <li className="px-6 py-10 text-sm text-muted">
              {rows.length === 0
                ? "No jobs yet — add the first one."
                : "No match."}
            </li>
          ) : (
            filtered.map((j) => (
              <li
                key={j.id}
                className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 sm:px-6"
              >
                <button
                  type="button"
                  onClick={() => startEdit(j)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="font-medium text-ink">{j.title}</p>
                  <p className="mt-1 text-xs text-muted">
                    {j.type}
                    {j.location ? ` · ${j.location}` : ""}
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        j.active
                          ? "bg-accent-soft text-accent"
                          : "bg-canvas text-muted"
                      }`}
                    >
                      {j.active ? "Active" : "Closed"}
                    </span>
                  </p>
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void remove(j.id, j.title)}
                  aria-label={`Delete ${j.title}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft hover:border-rose-300 hover:text-rose-600"
                >
                  <IconXCircle className="h-4 w-4" />
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

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
              aria-label="Close"
              onClick={closeForm}
              className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-surface shadow-lift-lg"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h3 className="font-display text-lg text-ink">
                  {editingId ? "Edit job" : "Add job"}
                </h3>
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line"
                >
                  <IconClose className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={(e) => void save(e)} className="space-y-3 p-5">
                <label className="block">
                  <span className={fieldLabel}>Title *</span>
                  <input
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className="console-field"
                    disabled={busy}
                  />
                </label>
                <label className="block">
                  <span className={fieldLabel}>Slug (optional)</span>
                  <input
                    value={form.slug}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, slug: e.target.value }))
                    }
                    className="console-field"
                    disabled={busy}
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className={fieldLabel}>Type</span>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          type: e.target.value as JobType,
                        }))
                      }
                      className="console-field cursor-pointer"
                      disabled={busy}
                    >
                      {JOB_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className={fieldLabel}>Location</span>
                    <input
                      value={form.location}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, location: e.target.value }))
                      }
                      className="console-field"
                      disabled={busy}
                    />
                  </label>
                </div>
                <label className="block">
                  <span className={fieldLabel}>Salary text</span>
                  <input
                    value={form.salaryText}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, salaryText: e.target.value }))
                    }
                    className="console-field"
                    disabled={busy}
                  />
                </label>
                <label className="block">
                  <span className={fieldLabel}>Description</span>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    className="console-field resize-none"
                    disabled={busy}
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className={fieldLabel}>Apply WhatsApp</span>
                    <input
                      value={form.applyWhatsApp}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          applyWhatsApp: e.target.value,
                        }))
                      }
                      className="console-field"
                      placeholder="9233…"
                      disabled={busy}
                    />
                  </label>
                  <label className="block">
                    <span className={fieldLabel}>Apply email</span>
                    <input
                      type="email"
                      value={form.applyEmail}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, applyEmail: e.target.value }))
                      }
                      className="console-field"
                      disabled={busy}
                    />
                  </label>
                </div>
                <label className="flex items-center gap-2 text-sm text-ink-soft">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, active: e.target.checked }))
                    }
                    disabled={busy}
                  />
                  Active (visible on site)
                </label>
                {error ? (
                  <p className="text-sm text-rose-600">{error}</p>
                ) : null}
                <div className="flex gap-2 pt-1">
                  <button type="submit" disabled={busy} className="console-btn">
                    {busy ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
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
