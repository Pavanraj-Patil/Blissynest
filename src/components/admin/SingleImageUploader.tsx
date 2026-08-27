"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";

export function SingleImageUploader({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload-image", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";

    if (!res.ok) {
      setError(data.error ?? "Upload failed.");
      return;
    }
    onChange(data.url);
  }

  return (
    <div className="space-y-2">
      {label && <span className="block text-xs font-medium text-charcoal">{label}</span>}
      <div className="flex items-start gap-3">
        {value && (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-charcoal/10 bg-cream-dark">
            {/* Plain <img>, not next/image — admin can paste/upload from any
                host, and next/image would refuse an unlisted remote host. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Remove image"
              className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-charcoal/70 text-cream hover:bg-terracotta-dark transition-colors"
            >
              <X size={10} />
            </button>
          </div>
        )}
        <div className="flex-1 space-y-1.5">
          <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-charcoal/25 px-3.5 py-2.5 text-xs font-medium text-charcoal-light hover:border-olive hover:text-olive-dark transition-colors">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
            {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0])}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="or paste a URL / local path"
            className="w-full rounded-lg border border-charcoal/15 px-3 py-1.5 text-xs text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
          />
        </div>
      </div>
      {error && <p className="text-[11px] text-terracotta-dark">{error}</p>}
    </div>
  );
}
