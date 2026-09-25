"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag } from "lucide-react";
import { SearchOverlay } from "./SearchOverlay";
import { AccountMenu } from "./AccountMenu";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

function CountBadge({ count, loading }: { count: number; loading: boolean }) {
  // While the real count is still resolving (see CartContext/WishlistContext
  // — same signal the cart/wishlist pages use to avoid a false "empty"
  // message), show a neutral placeholder dot instead of nothing at all, so
  // a shopper with real items doesn't see the badge silently pop in a beat
  // later with no visual continuity.
  if (loading) {
    return (
      <span
        aria-hidden
        className="absolute top-0 right-0 h-4 w-4 rounded-full bg-charcoal/10 animate-pulse"
      />
    );
  }
  if (count <= 0) return null;
  return (
    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta-dark text-[9px] font-semibold text-cream">
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function HeaderActions() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { count: cartCount, loading: cartLoading } = useCart();
  const { count: wishlistCount, loading: wishlistLoading } = useWishlist();

  return (
    <>
      <div className="flex items-center gap-4 min-[380px]:gap-5 text-charcoal shrink-0">
        <button
          type="button"
          aria-label="Search"
          onClick={() => setSearchOpen(true)}
          className="-m-2 p-2 hover:text-terracotta-dark transition-colors"
        >
          <Search size={19} />
        </button>
        <AccountMenu />
        <Link
          href="/wishlist"
          aria-label="Wishlist"
          className="relative -m-2 p-2 hover:text-terracotta-dark transition-colors"
        >
          <Heart size={19} />
          <CountBadge count={wishlistCount} loading={wishlistLoading} />
        </Link>
        <Link href="/cart" aria-label="Cart" className="relative -m-2 p-2 hover:text-terracotta-dark transition-colors">
          <ShoppingBag size={19} />
          <CountBadge count={cartCount} loading={cartLoading} />
        </Link>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
