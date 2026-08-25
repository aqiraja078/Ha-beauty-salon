"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  IconBlog,
  IconClose,
  IconPlus,
  IconSearch,
  IconXCircle,
} from "@/components/admin/icons";
import type { BlogPost } from "@/lib/blog-types";

const EMPTY = {
  title: "",
  slug: "",
  coverImage: "",
  excerpt: "",
  body: "",
  published: true,
};

const fieldLabel =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted";

export function AdminBlogPanel() {
  const [rows, setRows] = useState<BlogPost[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blog", { cache: "no-store" });
      if (!res.ok) throw new Error("Could not load posts");
      const data = (await res.json()) as BlogPost[];
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
    return rows.filter((p) =>
      [p.title, p.slug, p.excerpt ?? "", p.body]
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

  function startEdit(p: BlogPost) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      slug: p.slug,
      coverImage: p.coverImage ?? "",
      excerpt: p.excerpt ?? "",
      body: p.body,
      published: p.published,
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
      const res = await fetch("/api/admin/blog", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingId ? { id: editingId, ...form } : form
        ),
      });
      const data = (await res.json()) as BlogPost & { error?: string };
      if (!res.ok) throw new Error(data.error || "Save failed");
      if (editingId) {
        setRows((list) => list.map((p) => (p.id === editingId ? data : p)));
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
      const res = await fetch("/api/admin/blog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setRows((list) => list.filter((p) => p.id !== id));
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
              <IconBlog className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-xl text-ink">Blog posts</h2>
              <p className="mt-1 text-xs text-muted">{rows.length} posts</p>
            </div>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <label className="relative min-w-[180px] flex-1 sm:w-56">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts…"
                className="console-field pl-9"
              />
            </label>
            <button type="button" onClick={openAdd} className="console-btn">
              <IconPlus className="h-4 w-4" />
              Add post
            </button>
          </div>
        </div>

        <ul className="divide-y divide-line">
          {!loaded ? (
            <li className="px-6 py-10 text-sm text-muted">Loading…</li>
          ) : filtered.length === 0 ? (
            <li className="px-6 py-10 text-sm text-muted">
              {rows.length === 0
                ? "No posts yet — add the first one."
                : "No match."}
            </li>
          ) : (
            filtered.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 sm:px-6"
              >
                <button
                  type="button"
                  onClick={() => startEdit(p)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="font-medium text-ink">{p.title}</p>
                  <p className="mt-1 text-xs text-muted">
                    /blog/{p.slug}
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        p.published
                          ? "bg-accent-soft text-accent"
                          : "bg-canvas text-muted"
                      }`}
                    >
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </p>
                  {p.excerpt ? (
                    <p className="mt-1 line-clamp-2 text-xs text-ink-soft">
                      {p.excerpt}
                    </p>
                  ) : null}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void remove(p.id, p.title)}
                  aria-label={`Delete ${p.title}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft hover:border-rose-300 hover:text-rose-600"
                >
                  <IconXCircle className="h-4 w-4" />
                </button>
              </li>
            ))
          )}
        </ul>
        {error && !formOpen ? (
          <p className="border-t border-line px-6 py-3 text-sm text-rose-600">
            {error}
          </p>
        ) : null}
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
                  {editingId ? "Edit post" : "Add post"}
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
                    placeholder="auto from title"
                    disabled={busy}
                  />
                </label>
                <label className="block">
                  <span className={fieldLabel}>Cover image URL</span>
                  <input
                    value={form.coverImage}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, coverImage: e.target.value }))
                    }
                    className="console-field"
                    disabled={busy}
                  />
                </label>
                <label className="block">
                  <span className={fieldLabel}>Excerpt</span>
                  <input
                    value={form.excerpt}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, excerpt: e.target.value }))
                    }
                    className="console-field"
                    disabled={busy}
                  />
                </label>
                <label className="block">
                  <span className={fieldLabel}>Body</span>
                  <textarea
                    rows={6}
                    value={form.body}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, body: e.target.value }))
                    }
                    className="console-field resize-none"
                    disabled={busy}
                  />
                </label>
                <label className="flex items-center gap-2 text-sm text-ink-soft">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, published: e.target.checked }))
                    }
                    disabled={busy}
                  />
                  Published (visible on site)
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
