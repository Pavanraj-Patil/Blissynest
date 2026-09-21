"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Search, X } from "lucide-react";

export type RelatedProductOption = {
  slug: string;
  name: string;
  image: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export const MAX_RELATED_PRODUCTS = 8;

function Thumb({ src }: { src: string }) {
  return (
    <span className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-cream-dark">
      {/* Plain <img>, not next/image — small unoptimized admin preview, and
          the source can be any host the admin pasted. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src && <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />}
    </span>
  );
}

// Ordered multi-select of other products, stored as their slugs. Order is
// the display order on the product page, so selected items can be reordered.
// Options are passed in whole (the catalogue is small) and searched
// client-side; a selected slug missing from `options` (its product was
// deleted) still renders, flagged, so it can be removed.
export function RelatedProductsPicker({
  value,
  onChange,
  options,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  options: RelatedProductOption[];
}) {
  const [query, setQuery] = useState("");
  const bySlug = new Map(options.map((o) => [o.slug, o]));
  const atMax = value.length >= MAX_RELATED_PRODUCTS;

  const q = query.trim().toLowerCase();
  const matches = q
    ? options
        .filter(
          (o) =>
            o.status !== "ARCHIVED" &&
            !value.includes(o.slug) &&
            (o.name.toLowerCase().includes(q) || o.slug.toLowerCase().includes(q))
        )
        .slice(0, 8)
    : [];

  function move(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((slug, i) => {
            const opt = bySlug.get(slug);
            const unavailable = !opt || opt.status === "ARCHIVED";
            return (
              <li
                key={slug}
                className="flex items-center gap-3 rounded-lg border border-charcoal/10 bg-white px-3 py-2"
              >
                <Thumb src={opt?.image ?? ""} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-charcoal">{opt?.name ?? slug}</span>
                  {unavailable ? (
                    <span className="block text-[11px] text-terracotta-dark">
                      {opt ? "Archived" : "No longer exists"} — won&rsquo;t show on the product page
                    </span>
                  ) : opt.status === "DRAFT" ? (
                    <span className="block text-[11px] text-ink-muted">
                      Draft — shows once published
                    </span>
                  ) : null}
                </span>
                <span className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Move up"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-charcoal-light hover:bg-cream-dark disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === value.length - 1}
                    aria-label="Move down"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-charcoal-light hover:bg-cream-dark disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowDown size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange(value.filter((s) => s !== slug))}
                    aria-label="Remove"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-charcoal-light hover:bg-cream-dark hover:text-terracotta-dark"
                  >
                    <X size={13} />
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <div>
        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={atMax}
            placeholder={
              atMax
                ? `Maximum of ${MAX_RELATED_PRODUCTS} reached`
                : "Search products by name to add…"
            }
            className="w-full rounded-lg border border-charcoal/15 py-2.5 pl-9 pr-3.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive disabled:bg-cream-dark/50"
          />
        </div>

        {q && !atMax && (
          <ul className="mt-2 divide-y divide-charcoal/5 overflow-hidden rounded-lg border border-charcoal/10 bg-white">
            {matches.length === 0 ? (
              <li className="px-3 py-3 text-xs text-ink-muted">No matching products.</li>
            ) : (
              matches.map((o) => (
                <li key={o.slug}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange([...value, o.slug]);
                      setQuery("");
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-cream-dark/60 transition-colors"
                  >
                    <Thumb src={o.image} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-charcoal">{o.name}</span>
                      <span className="block truncate text-[11px] text-ink-muted">
                        {o.slug}
                        {o.status === "DRAFT" ? " · Draft" : ""}
                      </span>
                    </span>
                    <Plus size={14} className="shrink-0 text-olive" />
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
