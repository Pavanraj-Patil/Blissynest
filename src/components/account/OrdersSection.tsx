import Image from "next/image";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AccountOrder, OrderStatus } from "@/lib/account-data";

const statusStyles: Record<OrderStatus, string> = {
  Delivered: "bg-olive/10 text-olive-dark",
  Shipped: "bg-terracotta/10 text-terracotta-dark",
  Processing: "bg-gold/15 text-charcoal",
};

function itemsSummary(order: AccountOrder): string {
  const totalQty = order.items.reduce((sum, i) => sum + i.qty, 0);
  if (order.items.length === 1) {
    return order.items[0].qty > 1
      ? `${order.items[0].name} × ${order.items[0].qty}`
      : order.items[0].name;
  }
  return `${order.items[0].name} + ${totalQty - order.items[0].qty} more`;
}

export function OrdersSection({ orders }: { orders: AccountOrder[] }) {
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

          <div className="mt-3 flex justify-end border-t border-charcoal/10 pt-3">
            <Link
              href="/track-order"
              className="text-xs font-medium text-terracotta-dark hover:text-terracotta transition-colors"
            >
              Track this order
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
