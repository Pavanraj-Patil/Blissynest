"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { SiteContentProvider } from "@/lib/site-content-context";
import type { ResponsiveImageValue } from "@/lib/content-schema";

export function AppProviders({
  children,
  session,
  shopGiftBannerImage,
  categoryPillImages,
}: {
  children: ReactNode;
  session: Session | null;
  shopGiftBannerImage: ResponsiveImageValue;
  categoryPillImages: Record<string, string>;
}) {
  return (
    <SessionProvider session={session}>
      <SiteContentProvider value={{ shopGiftBannerImage, categoryPillImages }}>
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </SiteContentProvider>
    </SessionProvider>
  );
}
