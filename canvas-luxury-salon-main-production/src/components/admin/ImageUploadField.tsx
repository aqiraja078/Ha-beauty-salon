"use client";

import { useRef, useState } from "react";
import { uploadAdminImage } from "@/lib/client-image";

const labelCls =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted";

/** Upload button (+ optional preview) that hands back the new photo URL. */
export function ImageUploadButton({
  onUploaded,
  label = "Upload photo",
  className = "console-btn-soft",
}: {
  onUploaded: (url: string) => void;
  label?: string;
  className?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onUploaded(await uploadAdminImage(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void pick(e.target.files?.[0])}
      />
      <button
        type="button"
        className={className}
        disabled={busy}
        onClick={() => input.current?.click()}
      >
        {busy ? "Uploading…" : label}
      </button>
      {error ? <span className="text-xs text-rose-500">{error}</span> : null}
    </span>
  );
}

/** Photo field: preview + upload from device + (optional) paste a link. */
export function ImageUploadField({
  label,
  value,
  onChange,
  hint,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  disabled?: boolean;
}) {
  return (
    <div className="block">
      <span className={labelCls}>{label}</span>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-canvas-2">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of any host
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[10px] text-muted">No photo</span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-start">
          <input
            className="console-field min-w-0 flex-1 font-mono text-xs"
            value={value}
            disabled={disabled}
            placeholder="Upload a photo, or paste a link (https://…)"
            onChange={(e) => onChange(e.target.value.trim())}
          />
          <div className="flex items-center gap-2">
            <ImageUploadButton onUploaded={onChange} />
            {value ? (
              <button
                type="button"
                className="console-btn-soft text-rose-600"
                disabled={disabled}
                onClick={() => onChange("")}
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
