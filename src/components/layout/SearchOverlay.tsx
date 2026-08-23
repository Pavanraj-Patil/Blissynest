"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight, SearchX } from "lucide-react";
import { searchProducts } from "@/lib/search-data";

const quickLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Occasions", href: "/occasions" },
  { label: "Collections", href: "/collections" },
  { label: "Corporate Gifting", href: "/corporate" },
];

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchProducts(query, 6), [query]);
  const hasMore = query.trim() && searchProducts(query).length > results.length;

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setQuery("");
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  function handleClose() {
    setQuery("");
    onClose();
  }

  function goToResults() {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    handleClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative mx-auto mt-0 sm:mt-24 max-w-2xl px-0 sm:px-4">
        <div className="flex h-dvh sm:h-auto sm:max-h-[75vh] flex-col overflow-hidden bg-white sm:rounded-3xl shadow-2xl">
          <div className="flex items-center gap-3 border-b border-charcoal/10 px-5 py-4">
            <Search size={19} className="text-charcoal/40 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") goToResults();
              }}
              placeholder="Search for gifts, occasions, collections..."
              className="flex-1 bg-transparent text-base text-charcoal placeholder:text-ink-muted focus:outline-none"
            />
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close search"
              className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal/50 hover:bg-cream-dark hover:text-charcoal transition-colors shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            {!query.trim() && (
              <div className="p-5">
                <p className="eyebrow text-ink-muted mb-3">Quick Links</p>
                <div className="flex flex-wrap gap-2">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={handleClose}
                      className="rounded-full border border-charcoal/15 px-4 py-2 text-sm text-charcoal hover:border-olive/40 hover:bg-cream-dark transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {query.trim() && results.length === 0 && (
              <div className="flex flex-col items-center text-center px-6 py-14">
                <SearchX size={32} className="text-charcoal/20" strokeWidth={1.5} />
                <p className="mt-3 text-sm text-charcoal">
                  No results for &ldquo;{query}&rdquo;
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  Try a different search, or browse our shop instead.
                </p>
                <Link
                  href="/shop"
                  onClick={handleClose}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-terracotta-dark hover:text-terracotta transition-colors"
                >
                  Browse all gifts
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {results.length > 0 && (
              <div className="p-2.5">
                {results.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/product/${p.slug}`}
                    onClick={handleClose}
                    className="flex items-center gap-3.5 rounded-xl p-2.5 hover:bg-cream-dark transition-colors"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                      <Image src={p.image} alt={p.name} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-charcoal">{p.name}</p>
                      <p className="text-sm text-ink-muted">₹{p.price.toLocaleString("en-IN")}</p>
                    </div>
                  </Link>
                ))}

                {hasMore && (
                  <button
                    type="button"
                    onClick={goToResults}
                    className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-sm font-medium text-terracotta-dark hover:bg-cream-dark transition-colors"
                  >
                    View all results for &ldquo;{query}&rdquo;
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
