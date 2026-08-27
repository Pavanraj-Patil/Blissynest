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
  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  const [orders, addressRows] = await Promise.all([
    getOrdersForUser(session.user.id),
    db.address.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <>
      <TopBar />
      <AccountPageClient
        user={{ name: session.user.name ?? null, email: session.user.email ?? null }}
        orders={orders}
        addresses={addressRows.map(toAddressDTO)}
      />
    </>
  );
}
