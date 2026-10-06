"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { SiteContentProvider } from "@/lib/site-content-context";
import { ToastProvider } from "@/lib/toast-context";
import type { ResponsiveImageValue } from "@/lib/content-schema";

type SiteContentValue = Parameters<typeof SiteContentProvider>[0]["value"];

export function AppProviders({
  children,
  session,
  shopGiftBannerImage,
  categoryPillImages,
  shopGiftBannerVisible,
  shopGiftBannerText,
  footer,
}: {
  children: ReactNode;
  session: Session | null;
  shopGiftBannerImage: ResponsiveImageValue;
  categoryPillImages: Record<string, string>;
  shopGiftBannerVisible: boolean;
  shopGiftBannerText: { heading: string; body: string; buttonLabel: string };
  footer: SiteContentValue["footer"];
}) {
  return (
    <SessionProvider session={session}>
      <SiteContentProvider value={{ shopGiftBannerImage, categoryPillImages, shopGiftBannerVisible, shopGiftBannerText, footer }}>
        {/* Above Cart/Wishlist so both can surface a toast on a failed
            background action (see toast-context.tsx). */}
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </SiteContentProvider>
    </SessionProvider>
  );
}
