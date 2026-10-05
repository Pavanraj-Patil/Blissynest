"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Loader2, Star } from "lucide-react";

export function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload-image-r2", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Upload failed.");
          return;
        }
        uploaded.push(data.url);
      }
      onChange([...images, ...uploaded]);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function makeThumbnail(index: number) {
    if (index === 0) return;
    const next = [...images];
    const [picked] = next.splice(index, 1);
    next.unshift(picked);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((src, i) => (
            <div
              key={`${i}-${src}`}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-charcoal/10 bg-cream-dark"
            >
              {/* Plain <img>, not next/image: admin can paste/upload from any
                  host (Cloudinary, placehold.co, a local /public path), and
                  next/image would refuse to render an unlisted remote host —
                  this is just a small unoptimized admin preview. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              {i === 0 ? (
                <span className="absolute left-0.5 top-0.5 rounded bg-charcoal/70 px-1 text-[9px] font-semibold text-cream">
                  Thumb
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => makeThumbnail(i)}
                  aria-label="Make thumbnail"
                  title="Make thumbnail"
                  className="absolute left-0.5 bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-charcoal/70 text-cream hover:bg-olive transition-colors"
                >
                  <Star size={9} />
                </button>
              )}
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label="Remove image"
                className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-charcoal/70 text-cream hover:bg-terracotta-dark transition-colors"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-charcoal/25 px-3.5 py-2.5 text-xs font-medium text-charcoal-light hover:border-olive hover:text-olive-dark transition-colors">
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
        {uploading ? "Uploading…" : "Upload images"}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {error && <p className="text-[11px] text-terracotta-dark">{error}</p>}
    </div>
  );
}
