"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";

type Row = {
  id: string;
  title: string;
  tag: string;
  slug: string;
  published: boolean;
  publishedAt: string;
};

export function JournalList({ posts }: { posts: Row[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function importStarters() {
    setBusy("starter");
    setError(null);
    try {
      const res = await fetch("/api/admin/journal/starter", { method: "POST" });
      if (!res.ok) {
        setError("Could not add the starter articles.");
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  async function remove(row: Row) {
    if (!window.confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    setBusy(row.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/journal/${row.id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Could not delete the article.");
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link
          href="/admin/journal/new"
          className="inline-flex items-center gap-2 rounded-lg bg-olive px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-cream hover:bg-olive-dark transition-colors"
        >
          <Plus size={14} />
          New article
        </Link>
      </div>

      {error && <p className="rounded-lg bg-terracotta/10 px-3 py-2 text-xs text-terracotta-dark">{error}</p>}

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-charcoal/10 bg-white p-8 text-center">
          <p className="font-serif text-lg text-charcoal">No articles yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
            Visitors currently see six built-in starter articles. Add them here to edit or remove
            them, or start with a new article of your own. Once you add any article, only your
            articles are shown.
          </p>
          <button
            type="button"
            onClick={importStarters}
            disabled={busy === "starter"}
            className="mt-5 rounded-lg border border-charcoal/20 px-4 py-2.5 text-xs font-semibold text-charcoal hover:bg-cream-dark transition-colors disabled:opacity-60"
          >
            {busy === "starter" ? "Adding…" : "Add the six starter articles"}
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-charcoal/10 overflow-hidden rounded-2xl border border-charcoal/10 bg-white">
          {posts.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-charcoal">{p.title}</p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {p.tag} · {new Date(p.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  p.published ? "bg-olive/10 text-olive-dark" : "bg-charcoal/10 text-charcoal-light"
                }`}
              >
                {p.published ? "Published" : "Draft"}
              </span>
              <div className="flex items-center gap-1">
                {p.published && (
                  <a
                    href={`/journal/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="View on the site"
                    className="rounded-lg p-2 text-charcoal-light hover:bg-cream-dark"
                  >
                    <ExternalLink size={15} />
                  </a>
                )}
                <Link
                  href={`/admin/journal/${p.id}`}
                  aria-label="Edit"
                  className="rounded-lg p-2 text-charcoal-light hover:bg-cream-dark"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  type="button"
                  onClick={() => remove(p)}
                  disabled={busy === p.id}
                  aria-label="Delete"
                  className="rounded-lg p-2 text-charcoal-light hover:bg-terracotta/10 hover:text-terracotta-dark disabled:opacity-50"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
