"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

// Shopper-facing photo upload for products that take the customer's own
// images as part of the customisation. Uploads go to
// /api/upload-customer-image one file at a time; the returned URLs are held
// in the PDP's state and travel with the cart line's customization.
export function CustomerImageUploader({
  value,
  onChange,
  maxImages,
  required,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages: number;
  required: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const remaining = maxImages - value.length;

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    const picked = Array.from(files).slice(0, remaining);
    const skipped = files.length - picked.length;
    setUploading(true);

    const uploaded: string[] = [];
    let failed = false;
    for (const file of picked) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload-customer-image", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Upload failed. Please try again.");
          failed = true;
          break;
        }
        uploaded.push(data.url);
      } catch {
        setError("Upload failed. Check your connection and try again.");
        failed = true;
        break;
      }
    }

    if (uploaded.length > 0) onChange([...value, ...uploaded]);
    if (skipped > 0 && !failed) {
      setError(`Only ${maxImages} photo${maxImages === 1 ? "" : "s"} allowed.`);
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="font-semibold text-charcoal text-sm">
          Your {maxImages === 1 ? "Photo" : "Photos"}{" "}
          {required ? (
            <span className="text-xs font-normal text-terracotta">(Required)</span>
          ) : (
            <span className="text-xs font-normal text-ink-muted">(Optional)</span>
          )}
        </span>
        <span className="text-ink-muted">
          {value.length}/{maxImages}
        </span>
      </div>
      <p className="text-xs text-ink-muted mb-3">
        JPG, PNG, WebP or GIF, up to 8MB each. Use a clear, high-resolution photo for the best result.
      </p>

      <div className="flex flex-wrap gap-3">
        {value.map((src, i) => (
          <div
            key={src}
            className="relative h-20 w-20 overflow-hidden rounded-xl border border-charcoal/10 bg-cream-dark"
          >
            {/* Plain <img>: a shopper-uploaded file on the R2 host, shown as a
                small preview — no need to route it through the optimizer. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`Your photo ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((u) => u !== src))}
              aria-label="Remove photo"
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal/70 text-cream hover:bg-terracotta-dark transition-colors"
            >
              <X size={11} />
            </button>
          </div>
        ))}

        {remaining > 0 && (
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-charcoal/30 text-charcoal-light hover:border-olive hover:text-olive-dark transition-colors">
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
            <span className="text-[11px] font-medium">{uploading ? "Uploading" : "Add photo"}</span>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple={remaining > 1}
              onChange={(e) => handleFiles(e.target.files)}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-terracotta-dark">{error}</p>}
    </div>
  );
}
