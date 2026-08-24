"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";

export function AppProviders({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </CartProvider>
    </SessionProvider>
  );
}
