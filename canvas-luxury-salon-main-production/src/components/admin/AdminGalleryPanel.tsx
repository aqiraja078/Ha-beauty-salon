"use client";

import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconGallery, IconPlus } from "@/components/admin/icons";
import {
  parseVideoEmbed,
  type GalleryItem,
  type GalleryMediaType,
} from "@/lib/gallery-types";

const fieldLabel =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted";

const ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime,video/ogg";

type Mode = "upload" | "url";
type Filter = "all" | "image" | "video" | "hidden";

type Progress = { name: string; pct: number };

function fmtSize(n: number) {
  return n > 1024 * 1024
    ? `${(n / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(n / 1024))} KB`;
}

function Preview({ item }: { item: GalleryItem }) {
  if (item.type === "image") {
    // eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary hosts
    return <img src={item.src} alt="" className="h-full w-full object-cover" />;
  }
  const embed = parseVideoEmbed(item.src);
  const poster =
    item.poster ||
    (embed.kind === "youtube"
      ? `https://img.youtube.com/vi/${embed.id}/hqdefault.jpg`
      : "");
  if (poster) {
    // eslint-disable-next-line @next/next/no-img-element -- admin preview
    return <img src={poster} alt="" className="h-full w-full object-cover" />;
  }
  if (embed.kind === "file") {
    return (
      <video
        src={`${item.src}#t=0.1`}
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
    );
  }
  return <div className="h-full w-full bg-canvas-2" />;
}

export function AdminGalleryPanel() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  const [mode, setMode] = useState<Mode>("upload");
  const [category, setCategory] = useState("");
  const [published, setPublished] = useState(true);

  // upload tab
  const [files, setFiles] = useState<File[]>([]);
  const [uploadTitle, setUploadTitle] = useState("");
  const [progress, setProgress] = useState<Progress | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // url tab
  const [urlForm, setUrlForm] = useState({
    src: "",
    type: "auto" as GalleryMediaType | "auto",
    poster: "",
    title: "",
    caption: "",
  });

  // edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    caption: "",
    category: "",
    poster: "",
    src: "",
    published: true,
  });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/gallery", { cache: "no-store" });
      if (!res.ok) throw new Error("Could not load gallery");
      const data = (await res.json()) as GalleryItem[];
      setItems(Array.isArray(data) ? data : []);
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

  const categories = useMemo(
    () =>
      Array.from(new Set(items.map((i) => i.category).filter(Boolean))).sort(),
    [items]
  );

  const counts = useMemo(
    () => ({
      all: items.length,
      image: items.filter((i) => i.type === "image").length,
      video: items.filter((i) => i.type === "video").length,
      hidden: items.filter((i) => !i.published).length,
    }),
    [items]
  );

  const visible = useMemo(
    () =>
      items
        .map((item, idx) => ({ item, idx }))
        .filter(({ item }) =>
          filter === "all"
            ? true
            : filter === "hidden"
              ? !item.published
              : item.type === filter
        ),
    [items, filter]
  );

  function addFiles(list: FileList | File[]) {
    const next = Array.from(list);
    setFiles((cur) => [...cur, ...next]);
    setError("");
  }

  function uploadFiles() {
    if (files.length === 0) {
      setError("Choose at least one photo or video.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    fd.set("category", category);
    fd.set("title", uploadTitle);
    fd.set("published", String(published));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/gallery/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress({
          name: files.length === 1 ? files[0].name : `${files.length} files`,
          pct: Math.round((e.loaded / e.total) * 100),
        });
      }
    };
    xhr.onload = () => {
      setBusy(false);
      setProgress(null);
      let data: { items?: GalleryItem[]; errors?: string[]; error?: string } = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        /* non-JSON error page (e.g. request too large) */
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.items) {
        setItems((cur) => [...data.items!, ...cur]);
        setFiles([]);
        setUploadTitle("");
        if (fileInput.current) fileInput.current.value = "";
        setNotice(
          `${data.items.length} uploaded${
            data.errors?.length ? ` · ${data.errors.length} skipped` : ""
          }.`
        );
        if (data.errors?.length) setError(data.errors.join(" "));
      } else {
        setError(
          data.errors?.join(" ") ||
            data.error ||
            (xhr.status === 413
              ? "File is too large for the server. Use a link (YouTube / direct URL) for big videos."
              : "Upload failed.")
        );
      }
    };
    xhr.onerror = () => {
      setBusy(false);
      setProgress(null);
      setError("Upload failed — check your connection or file size.");
    };
    xhr.send(fd);
  }

  async function addUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!urlForm.src.trim()) {
      setError("Paste a photo or video link.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...urlForm, category, published }),
      });
      const data = (await res.json()) as GalleryItem & { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not add");
      setItems((cur) => [data, ...cur]);
      setUrlForm({ src: "", type: "auto", poster: "", title: "", caption: "" });
      setNotice("Added from link.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(i: GalleryItem) {
    setEditingId(i.id);
    setEditForm({
      title: i.title,
      caption: i.caption,
      category: i.category,
      poster: i.poster ?? "",
      src: i.src,
      published: i.published,
    });
    setError("");
  }

  async function saveEdit(item: GalleryItem) {
    setBusy(true);
    setError("");
    try {
      const body: Record<string, unknown> = { id: item.id, ...editForm };
      if (item.source === "upload") delete body.src;
      const res = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as GalleryItem & { error?: string };
      if (!res.ok) throw new Error(data.error || "Save failed");
      setItems((cur) => cur.map((x) => (x.id === item.id ? data : x)));
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function togglePublished(item: GalleryItem) {
    const res = await fetch("/api/admin/gallery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, published: !item.published }),
    });
    if (res.ok) {
      const data = (await res.json()) as GalleryItem;
      setItems((cur) => cur.map((x) => (x.id === item.id ? data : x)));
    }
  }

  async function remove(item: GalleryItem) {
    const label = item.type === "video" ? "video" : "photo";
    if (
      !window.confirm(
        `Permanently delete this ${label}${item.title ? ` "${item.title}"` : ""}?\n\nIt is removed from the gallery and the website${
          item.source === "upload" ? ", and the uploaded file is erased" : ""
        }. This cannot be undone.`
      )
    )
      return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      if (!res.ok && res.status !== 404) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Delete failed");
      }
      setItems((cur) => cur.filter((x) => x.id !== item.id));
      if (editingId === item.id) setEditingId(null);
      setNotice(`${label === "video" ? "Video" : "Photo"} deleted permanently.`);
      // Re-read from the server so the screen always shows what is really stored.
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const to = index + dir;
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    [next[index], next[to]] = [next[to], next[index]];
    setItems(next);
    const res = await fetch("/api/admin/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((i) => i.id) }),
    });
    if (!res.ok) {
      setError("Could not save order.");
      void load();
    }
  }

  return (
    <div className="mt-7 space-y-6">
      {/* ── Add media ── */}
      <section className="console-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
              <IconPlus className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-xl text-ink">Add photos & videos</h2>
              <p className="mt-1 text-xs text-muted">
                Upload from your device, or paste a link — saved to the gallery JSON.
              </p>
            </div>
          </div>
          <div className="inline-flex rounded-full border border-line bg-canvas/60 p-1">
            {(
              [
                ["upload", "Upload files"],
                ["url", "From link"],
              ] as const
            ).map(([m, label]) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError("");
                }}
                className={`min-h-[34px] rounded-full px-4 text-xs font-semibold transition ${
                  mode === m
                    ? "bg-accent text-accent-fg"
                    : "text-ink-soft hover:text-accent"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className={fieldLabel}>Category (optional)</span>
              <input
                className="console-field"
                list="gallery-categories"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Bridal, Hair, Skin"
              />
              <datalist id="gallery-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>
            <label className="flex items-end gap-2 pb-2.5 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 accent-[rgb(var(--accent))]"
              />
              Show on the public gallery right away
            </label>
          </div>

          {mode === "upload" ? (
            <>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
                }}
                className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${
                  dragging
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-canvas/40"
                }`}
              >
                <IconGallery className="h-8 w-8 text-accent" />
                <p className="text-sm text-ink">
                  Drag &amp; drop photos / videos here
                </p>
                <p className="text-xs text-muted">
                  JPG, PNG, WebP, GIF, AVIF · MP4, WebM, MOV
                </p>
                <button
                  type="button"
                  className="console-btn-soft mt-1"
                  onClick={() => fileInput.current?.click()}
                >
                  Choose files
                </button>
                <input
                  ref={fileInput}
                  type="file"
                  multiple
                  accept={ACCEPT}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>

              {files.length > 0 ? (
                <ul className="divide-y divide-line rounded-xl border border-line bg-canvas/40">
                  {files.map((f, i) => (
                    <li
                      key={`${f.name}-${i}`}
                      className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                    >
                      <span className="min-w-0 truncate text-ink">
                        {f.type.startsWith("video/") ? "🎬" : "🖼️"} {f.name}
                      </span>
                      <span className="flex shrink-0 items-center gap-3 text-xs text-muted">
                        {fmtSize(f.size)}
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            setFiles((cur) => cur.filter((_, j) => j !== i))
                          }
                          className="text-ink-soft hover:text-accent"
                          aria-label={`Remove ${f.name}`}
                        >
                          ✕
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {files.length === 1 ? (
                <label className="block">
                  <span className={fieldLabel}>Title (optional)</span>
                  <input
                    className="console-field"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                  />
                </label>
              ) : null}

              {progress ? (
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted">
                    <span className="truncate">Uploading {progress.name}…</span>
                    <span>{progress.pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-canvas">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent-strong to-accent transition-all"
                      style={{ width: `${progress.pct}%` }}
                    />
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={uploadFiles}
                  disabled={busy || files.length === 0}
                  className="console-btn"
                >
                  {busy ? "Uploading…" : `Upload ${files.length || ""} file${files.length === 1 ? "" : "s"}`}
                </button>
                <p className="text-xs text-muted">
                  Live site note: very large videos can exceed the host&apos;s
                  upload limit — for those, use “From link”.
                </p>
              </div>
            </>
          ) : (
            <form onSubmit={addUrl} className="grid gap-3 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className={fieldLabel}>Photo or video link</span>
                <input
                  className="console-field"
                  value={urlForm.src}
                  onChange={(e) => setUrlForm({ ...urlForm, src: e.target.value })}
                  placeholder="https://… (image, MP4, YouTube or Vimeo link)"
                />
              </label>
              <label className="block">
                <span className={fieldLabel}>Type</span>
                <select
                  className="console-field"
                  value={urlForm.type}
                  onChange={(e) =>
                    setUrlForm({
                      ...urlForm,
                      type: e.target.value as GalleryMediaType | "auto",
                    })
                  }
                >
                  <option value="auto">Auto-detect</option>
                  <option value="image">Photo</option>
                  <option value="video">Video</option>
                </select>
              </label>
              <ImageUploadField
                label="Video cover image (optional)"
                value={urlForm.poster}
                onChange={(v) => setUrlForm({ ...urlForm, poster: v })}
              />
              <label className="block">
                <span className={fieldLabel}>Title (optional)</span>
                <input
                  className="console-field"
                  value={urlForm.title}
                  onChange={(e) =>
                    setUrlForm({ ...urlForm, title: e.target.value })
                  }
                />
              </label>
              <label className="block">
                <span className={fieldLabel}>Caption (optional)</span>
                <input
                  className="console-field"
                  value={urlForm.caption}
                  onChange={(e) =>
                    setUrlForm({ ...urlForm, caption: e.target.value })
                  }
                />
              </label>
              <div className="sm:col-span-2">
                <button type="submit" disabled={busy} className="console-btn">
                  {busy ? "Adding…" : "Add from link"}
                </button>
              </div>
            </form>
          )}

          {error ? (
            <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent">
              {notice}
            </p>
          ) : null}
        </div>
      </section>

      {/* ── Library ── */}
      <section className="console-card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-line px-5 py-5 sm:px-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
            <IconGallery className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-xl text-ink">Gallery library</h2>
            <p className="mt-1 text-xs text-muted">
              {items.length} item{items.length === 1 ? "" : "s"} ({counts.image} photo
              {counts.image === 1 ? "" : "s"}, {counts.video} video
              {counts.video === 1 ? "" : "s"}) ·{" "}
              {items.filter((i) => i.published).length} published · order here =
              order on the site
            </p>
          </div>
        </div>

        {loaded && items.length > 0 ? (
          <div className="flex flex-wrap gap-2 border-b border-line px-5 py-3 sm:px-6">
            {(
              [
                ["all", "All"],
                ["image", "Photos"],
                ["video", "Videos"],
                ["hidden", "Hidden"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                aria-pressed={filter === key}
                className={`min-h-[34px] rounded-full px-4 text-xs font-medium transition ${
                  filter === key
                    ? "bg-gradient-to-r from-accent to-accent-strong text-accent-fg shadow-lift"
                    : "border border-line bg-surface text-ink-soft hover:border-accent/45 hover:text-accent"
                }`}
              >
                {label} ({counts[key]})
              </button>
            ))}
          </div>
        ) : null}

        {!loaded ? (
          <p className="px-6 py-10 text-sm text-muted">Loading…</p>
        ) : items.length === 0 ? (
          <p className="px-6 py-10 text-sm text-muted">
            Nothing here yet — upload or add a link above.
          </p>
        ) : visible.length === 0 ? (
          <p className="px-6 py-10 text-sm text-muted">Nothing in this view.</p>
        ) : (
          <ul className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
            {visible.map(({ item, idx }) => (
              <li
                key={item.id}
                className={`overflow-hidden rounded-2xl border bg-canvas/40 ${
                  item.published ? "border-line" : "border-line opacity-70"
                }`}
              >
                <div className="relative aspect-[4/3] bg-canvas-2">
                  <Preview item={item} />
                  <span className="absolute left-2 top-2 rounded-full bg-canvas/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent backdrop-blur">
                    {item.type === "video" ? "Video" : "Photo"} ·{" "}
                    {item.source === "upload" ? "Uploaded" : "Link"}
                  </span>
                  {!item.published ? (
                    <span className="absolute right-2 top-2 rounded-full bg-canvas/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted backdrop-blur">
                      Hidden
                    </span>
                  ) : null}
                </div>

                {editingId === item.id ? (
                  <div className="space-y-3 p-4">
                    <label className="block">
                      <span className={fieldLabel}>Title</span>
                      <input
                        className="console-field"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                      />
                    </label>
                    <label className="block">
                      <span className={fieldLabel}>Caption</span>
                      <textarea
                        className="console-field min-h-[64px]"
                        value={editForm.caption}
                        onChange={(e) =>
                          setEditForm({ ...editForm, caption: e.target.value })
                        }
                      />
                    </label>
                    <label className="block">
                      <span className={fieldLabel}>Category</span>
                      <input
                        className="console-field"
                        list="gallery-categories"
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm({ ...editForm, category: e.target.value })
                        }
                      />
                    </label>
                    {item.source === "url" ? (
                      <label className="block">
                        <span className={fieldLabel}>Link</span>
                        <input
                          className="console-field font-mono text-xs"
                          value={editForm.src}
                          onChange={(e) =>
                            setEditForm({ ...editForm, src: e.target.value })
                          }
                        />
                      </label>
                    ) : null}
                    {item.type === "video" ? (
                      <ImageUploadField
                        label="Cover image"
                        value={editForm.poster}
                        onChange={(v) => setEditForm({ ...editForm, poster: v })}
                      />
                    ) : null}
                    <label className="flex items-center gap-2 text-sm text-ink-soft">
                      <input
                        type="checkbox"
                        checked={editForm.published}
                        onChange={(e) =>
                          setEditForm({ ...editForm, published: e.target.checked })
                        }
                        className="h-4 w-4 accent-[rgb(var(--accent))]"
                      />
                      Published
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="console-btn"
                        disabled={busy}
                        onClick={() => void saveEdit(item)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="console-btn-soft"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="truncate font-medium text-ink">
                      {item.title || <span className="text-muted">Untitled</span>}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {item.category || "No category"}
                      {item.caption ? ` · ${item.caption}` : ""}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="console-btn-soft"
                        disabled={idx === 0}
                        onClick={() => void move(idx, -1)}
                        aria-label="Move earlier"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="console-btn-soft"
                        disabled={idx === items.length - 1}
                        onClick={() => void move(idx, 1)}
                        aria-label="Move later"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="console-btn-soft"
                        onClick={() => startEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="console-btn-soft"
                        onClick={() => void togglePublished(item)}
                      >
                        {item.published ? "Hide" : "Publish"}
                      </button>
                      <button
                        type="button"
                        className="console-btn-soft text-red-300 hover:border-red-400/50 hover:text-red-300"
                        disabled={busy}
                        onClick={() => void remove(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
