"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createLocalStore } from "@/lib/local-store";

export type WishlistItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
};

type WishlistContextValue = {
  items: WishlistItem[];
  isWishlisted: (slug: string) => boolean;
  toggleItem: (item: WishlistItem) => void;
  removeItem: (slug: string) => void;
  count: number;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);
const store = createLocalStore<WishlistItem[]>("blissynest-wishlist", []);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );

  function isWishlisted(slug: string) {
    return items.some((i) => i.slug === slug);
  }

  function toggleItem(item: WishlistItem) {
    const next = items.some((i) => i.slug === item.slug)
      ? items.filter((i) => i.slug !== item.slug)
      : [...items, item];
    store.setState(next);
  }

  function removeItem(slug: string) {
    store.setState(items.filter((i) => i.slug !== slug));
  }

  const count = items.length;

  const value: WishlistContextValue = {
    items,
    isWishlisted,
    toggleItem,
    removeItem,
    count,
  };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
