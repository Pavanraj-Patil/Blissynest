import Link from "next/link";
import Image from "next/image";
import { Star, MessageSquareOff } from "lucide-react";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getReviewsForAdmin } from "@/lib/review-service";
import { ReviewActions } from "./ReviewActions";
import { ReviewProductFilter } from "./ReviewProductFilter";

const statusFilters = [
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "All", value: "" },
] as const;

const statusStyles: Record<string, string> = {
  PENDING: "bg-gold/15 text-charcoal",
  APPROVED: "bg-olive/10 text-olive-dark",
  REJECTED: "bg-terracotta/10 text-terracotta-dark",
};

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} className={i < value ? "fill-gold text-gold" : "fill-charcoal/15 text-charcoal/15"} />
      ))}
    </div>
  );
}

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; product?: string }>;
}) {
  await requireAdmin("reviews");
  const { status, product } = await searchParams;
  const activeStatus = statusFilters.some((f) => f.value === status) ? (status as string) : "PENDING";
  const productQuery = (product ?? "").trim();

  const reviews = await getReviewsForAdmin(
    activeStatus ? (activeStatus as "PENDING" | "APPROVED" | "REJECTED") : undefined,
    productQuery || undefined
  );

  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Reviews</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Customer reviews awaiting moderation before they show on product pages.
        </p>
      </div>

      <ReviewProductFilter defaultValue={productQuery} />

      <div className="flex items-center gap-1.5">
        {statusFilters.map((f) => (
          <Link
            key={f.value}
            href={`/admin/reviews?status=${f.value}${productQuery ? `&product=${encodeURIComponent(productQuery)}` : ""}`}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeStatus === f.value
                ? "bg-olive text-cream"
                : "border border-charcoal/15 text-charcoal-light hover:bg-cream-dark"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-charcoal/10 bg-white px-6 py-16 text-center">
          <MessageSquareOff size={32} className="text-charcoal/20" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-charcoal">Nothing here</p>
          <p className="mt-1 text-xs text-ink-muted">No reviews match this filter right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-charcoal/10 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
                    <Image src={r.productImage} alt={r.productName} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/product/${r.productSlug}`}
                      target="_blank"
                      className="text-sm font-medium text-charcoal hover:text-terracotta-dark"
                    >
                      {r.productName}
                    </Link>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {r.customerName}
                      {r.customerEmail && ` · ${r.customerEmail}`}
                      {r.isAdminAuthored && (
                        <span className="ml-1.5 rounded-full bg-charcoal/10 px-1.5 py-0.5 text-[10px] font-semibold text-charcoal-light">
                          Admin
                        </span>
                      )}
                    </p>
                    <div className="mt-1.5">
                      <Stars value={r.rating} />
                    </div>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold shrink-0 ${statusStyles[r.status]}`}>
                  {r.status}
                </span>
              </div>

              <p className="mt-3 text-sm text-charcoal-light leading-relaxed">{r.comment}</p>

              <div className="mt-3 flex items-center justify-between border-t border-charcoal/10 pt-3">
                <p className="text-xs text-ink-muted">
                  {r.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <ReviewActions reviewId={r.id} showModeration={r.status === "PENDING"} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
