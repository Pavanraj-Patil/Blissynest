import type { Metadata } from "next";
import { AccountPageClient } from "./AccountPageClient";

export const metadata: Metadata = {
  title: "My Account | Blissynest",
  description: "Manage your profile, orders, addresses, and wishlist.",
};

export default function AccountPage() {
  return <AccountPageClient />;
}
