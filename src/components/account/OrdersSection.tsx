"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PackageSearch, Star, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AccountOrderDTO, AccountOrderItemDTO } from "@/lib/order-service";

const statusStyles: Record<AccountOrderDTO["status"], string> = {
  Delivered: "bg-olive/10 text-olive-dark",
  Shipped: "bg-terracotta/10 text-terracotta-dark",
  Processing: "bg-gold/15 text-charcoal",
};

function itemsSummary(order: AccountOrderDTO): string {
  const totalQty = order.items.reduce((sum, i) => sum + i.qty, 0);
  if (order.items.length === 1) {
    return order.items[0].qty > 1
      ? `${order.items[0].name} × ${order.items[0].qty}`
      : order.items[0].name;
  }
  return `${order.items[0].name} + ${totalQty - order.items[0].qty} more`;
}

function ReviewForm({
  onSubmit,
  onCancel,
  submitting,
  error,
}: {
  onSubmit: (rating: number, comment: string) => void;
  onCancel: () => void;
  submitting: boolean;
  error: string | null;
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div className="mt-3 rounded-xl border border-charcoal/10 bg-cream-dark/50 p-4">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              size={20}
              className={
                star <= (hoverRating || rating) ? "fill-gold text-gold" : "fill-charcoal/15 text-charcoal/15"
              }
            />
          </button>
        ))}
      </div>
      <textarea
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What did you think of this product?"
        className="mt-3 w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive resize-none"
      />
      {error && <p className="mt-2 text-xs text-terracotta-dark">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={submitting || !comment.trim()}
          onClick={() => onSubmit(rating, comment)}
          className="rounded-lg bg-olive text-cream px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit Review"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-charcoal/20 px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase text-charcoal hover:bg-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function OrderItemRow({
  orderId,
  item,
  onReviewed,
}: {
  orderId: string;
  item: AccountOrderItemDTO;
  onReviewed: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justReviewed, setJustReviewed] = useState(false);

  async function handleSubmit(rating: number, comment: string) {
    if (!item.productId) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, productId: item.productId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't submit your review.");
        return;
      }
      setOpen(false);
      setJustReviewed(true);
      onReviewed();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const reviewed = item.reviewed || justReviewed;

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-charcoal">{item.name}</p>
          <p className="text-xs text-ink-muted">Qty: {item.qty}</p>
        </div>
        {item.productId &&
          (reviewed ? (
            <span className="flex items-center gap-1 text-xs font-medium text-olive-dark shrink-0">
              <Check size={13} />
              Reviewed
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="text-xs font-medium text-terracotta-dark hover:text-terracotta transition-colors shrink-0"
            >
              Write a Review
            </button>
          ))}
      </div>
      {/* A separate block below the row, not a flex sibling of the
          thumbnail/button above — inside that flex row, `w-full` only
          filled whatever horizontal space was left over next to the
          thumbnail instead of wrapping onto its own row, squeezing the
          form into a thin cropped sliver, worst on mobile. */}
      {open && !reviewed && (
        <ReviewForm
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          submitting={submitting}
          error={error}
        />
      )}
    </div>
  );
}

export function OrdersSection({ orders, email }: { orders: AccountOrderDTO[]; email: string }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-charcoal/10 bg-white px-6 py-16 text-center">
        <PackageSearch size={32} className="text-charcoal/20" strokeWidth={1.5} />
        <p className="mt-3 text-sm text-charcoal">No orders yet</p>
        <p className="mt-1 text-xs text-ink-muted">
          When you place an order, it&rsquo;ll show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div
          key={order.orderNumber}
          className="rounded-2xl border border-charcoal/10 bg-white p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex gap-3">
              <div className="flex shrink-0 -space-x-3">
                {order.items.slice(0, 3).map((item, i) => (
                  <div
                    key={item.name}
                    className="relative h-14 w-14 overflow-hidden rounded-xl border-2 border-white bg-cream-dark"
                    style={{ zIndex: order.items.length - i }}
                  >
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                  </div>
                ))}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-charcoal">{order.orderNumber}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{order.date}</p>
                <p className="mt-1 text-xs text-charcoal-light truncate max-w-[16rem]">
                  {itemsSummary(order)}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-semibold",
                  statusStyles[order.status]
                )}
              >
                {order.status}
              </span>
              <p className="text-sm font-semibold text-charcoal">
                ₹{order.total.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3 border-t border-charcoal/10 pt-4">
            {order.items.map((item) => (
              <OrderItemRow
                key={item.productId ?? item.name}
                orderId={order.id}
                item={item}
                onReviewed={() => {}}
              />
            ))}
          </div>

          {order.status !== "Delivered" && (
            <div className="mt-3 flex justify-end border-t border-charcoal/10 pt-3">
              <Link
                href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(email)}`}
                className="text-xs font-medium text-terracotta-dark hover:text-terracotta transition-colors"
              >
                Track this order
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
