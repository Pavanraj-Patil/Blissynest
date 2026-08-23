import type { Metadata } from "next";
import { AccountPageClient } from "./AccountPageClient";

export const metadata: Metadata = {
  title: "Sign In | Blissynest",
  description: "Sign in or create a Blissynest account to track orders and save your favourites.",
};

export default function AccountPage() {
  return <AccountPageClient />;
}
