/**
 * Browser-side photo prep for admin uploads. Phone photos are often 4–12 MB; Netlify
 * functions reject request bodies over ~6 MB, so we shrink every photo before sending
 * (max 2000 px, WebP/JPEG) — it also makes the live site load faster.
 */
const MAX_SIDE = 2000;
export const UPLOAD_LIMIT_BYTES = 4 * 1024 * 1024;

function loadBitmap(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode"));
    };
    img.src = url;
  });
}

function toBlob(canvas: HTMLCanvasElement, type: string, q: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, q));
}

export async function prepareImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose a photo (JPG, PNG, WebP).");
  }
  // Animated GIFs would lose their animation; send them as-is when small enough.
  if (file.type === "image/gif") {
    if (file.size > UPLOAD_LIMIT_BYTES) throw new Error("GIF is too large (max 4 MB).");
    return file;
  }
  let img: HTMLImageElement;
  try {
    img = await loadBitmap(file);
  } catch {
    if (file.size <= UPLOAD_LIMIT_BYTES && /^image\/(jpeg|png|webp|avif)$/.test(file.type)) {
      return file;
    }
    throw new Error("This photo format is not supported. Please use JPG or PNG.");
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, w, h);

  // WebP keeps transparency (logos) and is small; fall back to whatever the browser gives.
  for (const q of [0.88, 0.78, 0.65]) {
    const blob = await toBlob(canvas, "image/webp", q);
    if (blob && blob.size <= UPLOAD_LIMIT_BYTES) {
      const type = blob.type || "image/webp";
      const ext = type === "image/png" ? "png" : type === "image/jpeg" ? "jpg" : "webp";
      return new File([blob], `photo.${ext}`, { type });
    }
  }
  throw new Error("Photo is still too large after shrinking. Please pick a smaller one.");
}

export async function uploadAdminImage(file: File): Promise<string> {
  const prepared = await prepareImageForUpload(file);
  const fd = new FormData();
  fd.set("file", prepared);
  const res = await fetch("/api/admin/media", { method: "POST", body: fd });
  const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
  if (!res.ok || !data?.url) {
    throw new Error(
      data?.error ||
        (res.status === 401 ? "Session expired — please log in again." : "Upload failed. Try again.")
    );
  }
  return data.url;
}
