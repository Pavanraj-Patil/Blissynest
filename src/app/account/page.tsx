import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getOrdersForUser } from "@/lib/order-service";
import { toAddressDTO } from "@/lib/address-adapters";
import { TopBar } from "@/components/layout/TopBar";
import { AccountPageClient } from "./AccountPageClient";

export const metadata: Metadata = {
  title: "My Account | Blissynest",
  description: "Manage your profile, orders, addresses, and wishlist.",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }
  if (session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") {
    redirect("/admin");
  }

  const [orders, addressRows, userRow] = await Promise.all([
    getOrdersForUser(session.user.id),
    db.address.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "asc" } }),
    db.user.findUnique({
      where: { id: session.user.id },
      select: {
        phone: true,
        passwordHash: true,
        notifyOrders: true,
        notifyPromos: true,
        notifyRecs: true,
      },
    }),
  ]);

  return (
    <>
      <TopBar />
      <AccountPageClient
        user={{
          name: session.user.name ?? null,
          email: session.user.email ?? null,
          phone: userRow?.phone ?? null,
        }}
        // The hash itself never leaves the server — only whether one
        // exists, which is what decides whether Settings shows a real
        // change-password form or a "signed in with Google" notice.
        hasPassword={Boolean(userRow?.passwordHash)}
        notifications={{
          orders: userRow?.notifyOrders ?? true,
          promos: userRow?.notifyPromos ?? true,
          recs: userRow?.notifyRecs ?? false,
        }}
        orders={orders}
        addresses={addressRows.map(toAddressDTO)}
      />
    </>
  );
}
