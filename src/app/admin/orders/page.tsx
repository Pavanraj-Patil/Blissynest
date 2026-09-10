import Link from "next/link";
import { Search, PackageX } from "lucide-react";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getOrdersForAdmin } from "@/lib/admin/order-service";
import { orderStatusStyles as statusStyles } from "@/lib/admin/order-status-styles";
import { OrderRow } from "./OrderRow";

const PAGE_SIZE = 20;

const paymentStatusStyles: Record<string, string> = {
  PAID: "bg-olive/10 text-olive-dark",
  PENDING: "bg-gold/15 text-charcoal",
  FAILED: "bg-terracotta/10 text-terracotta-dark",
  REFUNDED: "bg-charcoal/10 text-charcoal-light",
};

const statusFilters = ["", "PLACED", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requireAdmin("orders");
  const { q, status, page: pageParam } = await searchParams;
  const query = (q ?? "").trim();
  const page = Math.max(1, Number(pageParam) || 1);
  const activeStatus = statusFilters.includes(status ?? "") ? (status ?? "") : "";

  const { orders, total } = await getOrdersForAdmin({
    q: query || undefined,
    status: activeStatus || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (activeStatus) params.set("status", activeStatus);
    params.set("page", String(targetPage));
    return `/admin/orders?${params.toString()}`;
  }

  function filterHref(statusValue: string) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (statusValue) params.set("status", statusValue);
    return `/admin/orders?${params.toString()}`;
  }

  return (
    <div className="max-w-[1300px] mx-auto space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Orders</h1>
        <p className="mt-1 text-sm text-ink-muted">{total} order{total === 1 ? "" : "s"}</p>
      </div>

      <div className="rounded-2xl border border-charcoal/10 bg-white p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <form className="flex-1 max-w-sm">
            <label className="relative block">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/35" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search order #, name, email…"
                className="w-full rounded-lg border border-charcoal/15 py-2 pl-9 pr-3 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
              />
              {activeStatus && <input type="hidden" name="status" value={activeStatus} />}
            </label>
          </form>

          <div className="flex flex-wrap items-center gap-1.5">
            {statusFilters.map((s) => (
              <Link
                key={s}
                href={filterHref(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeStatus === s
                    ? "bg-olive text-cream"
                    : "border border-charcoal/15 text-charcoal-light hover:bg-cream-dark"
                }`}
              >
                {s || "All"}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-charcoal/10 bg-white overflow-hidden">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <PackageX size={32} className="text-charcoal/20" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-charcoal">No orders match this search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-muted border-b border-charcoal/10 bg-cream-dark/50">
                  <th className="py-3 pl-5 pr-3 font-medium">Order</th>
                  <th className="py-3 px-3 font-medium">Customer</th>
                  <th className="py-3 px-3 font-medium">Date</th>
                  <th className="py-3 px-3 font-medium">Items</th>
                  <th className="py-3 px-3 font-medium">Payment</th>
                  <th className="py-3 px-3 font-medium">Status</th>
                  <th className="py-3 pr-5 pl-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <OrderRow key={o.id} orderId={o.id}>
                    <td className="py-2.5 pl-5 pr-3">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="font-medium text-charcoal hover:text-terracotta-dark"
                      >
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="text-charcoal-light">{o.buyerName}</p>
                      <p className="text-xs text-ink-muted">{o.buyerEmail}</p>
                    </td>
                    <td className="py-2.5 px-3 text-ink-muted">
                      {o.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-2.5 px-3 text-charcoal-light">{o.itemCount}</td>
                    <td className="py-2.5 px-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${paymentStatusStyles[o.paymentStatus] ?? ""}`}>
                        {o.paymentMethod} · {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[o.status] ?? ""}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-2.5 pr-5 pl-3 text-right font-medium text-charcoal">
                      ₹{o.total.toLocaleString("en-IN")}
                    </td>
                  </OrderRow>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={pageHref(i + 1)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                page === i + 1 ? "bg-olive text-cream" : "text-charcoal-light hover:bg-cream-dark"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
