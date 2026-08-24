import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { WishlistPageClient } from "./WishlistPageClient";

export const metadata: Metadata = {
  title: "My Wishlist | Blissynest",
  description: "Your saved gifts, all in one place.",
};

export default function WishlistPage() {
  return (
    <>
      <TopBar />
      <WishlistPageClient />
    </>
  );
}
