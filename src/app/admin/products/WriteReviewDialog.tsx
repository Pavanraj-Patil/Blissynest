"use client";

import { useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Star, X } from "lucide-react";

export function WriteReviewDialog({
  productId,
  productName,
  open,
  onClose,
}: {
  productId: string;
  productName: string;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, authorName: name, rating, comment }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    setName("");
    setRating(5);
    setComment("");
    router.refresh();
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-serif text-lg text-charcoal">Write a review</h2>
            <p className="mt-1 truncate text-xs text-ink-muted">for {productName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 text-charcoal-light hover:text-terracotta-dark transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-charcoal-light mb-1.5">
              Reviewer name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              placeholder="e.g. Priya Sharma"
              className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-olive"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-light mb-1.5">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`${n} star${n === 1 ? "" : "s"}`}
                  className="p-0.5"
                >
                  <Star
                    size={22}
                    className={n <= rating ? "fill-gold text-gold" : "fill-charcoal/10 text-charcoal/10"}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-light mb-1.5">Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              maxLength={2000}
              rows={4}
              placeholder="What did they love about it?"
              className="w-full resize-none rounded-lg border border-charcoal/15 px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-olive"
            />
          </div>

          {error && <p className="text-xs text-terracotta-dark">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-charcoal/20 px-4 py-2.5 text-xs font-semibold tracking-[0.08em] uppercase text-charcoal hover:bg-cream-dark transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-olive text-cream px-4 py-2.5 text-xs font-semibold tracking-[0.08em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-60"
            >
              {submitting ? "Posting…" : "Post Review"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
