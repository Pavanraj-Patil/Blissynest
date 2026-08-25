"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

// Wraps the row so clicking anywhere (not just the order number) opens
// the order — the order number stays a real <Link> too, for keyboard/
// screen-reader navigation and open-in-new-tab.
export function OrderRow({ orderId, children }: { orderId: string; children: ReactNode }) {
  const router = useRouter();

  return (
    <tr
      onClick={() => router.push(`/admin/orders/${orderId}`)}
      className="cursor-pointer border-b border-charcoal/5 last:border-0 hover:bg-cream/40"
    >
      {children}
    </tr>
  );
}
