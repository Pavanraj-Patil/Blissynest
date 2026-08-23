"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingBag } from "lucide-react";
import { SearchOverlay } from "./SearchOverlay";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[9px] font-semibold text-cream">
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function HeaderActions() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  return (
    <>
      <div className="flex items-center gap-4 md:gap-5 text-charcoal shrink-0">
        <button
          type="button"
          aria-label="Search"
          onClick={() => setSearchOpen(true)}
          className="hover:text-terracotta-dark transition-colors"
        >
          <Search size={19} />
        </button>
        <button aria-label="Account" className="hidden sm:block hover:text-terracotta-dark transition-colors">
          <User size={19} />
        </button>
        <Link
          href="/wishlist"
          aria-label="Wishlist"
          className="relative hover:text-terracotta-dark transition-colors"
        >
          <Heart size={19} />
          <CountBadge count={wishlistCount} />
        </Link>
        <Link href="/cart" aria-label="Cart" className="relative hover:text-terracotta-dark transition-colors">
          <ShoppingBag size={19} />
          <CountBadge count={cartCount} />
        </Link>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
