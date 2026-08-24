"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
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
const localStore = createLocalStore<WishlistItem[]>("blissynest-wishlist", []);

async function fetchJson(url: string, init?: RequestInit): Promise<{ items: WishlistItem[] }> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  return res.json();
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const authenticated = status === "authenticated";

  const localItems = useSyncExternalStore(
    localStore.subscribe,
    localStore.getSnapshot,
    localStore.getServerSnapshot
  );
  const [serverItems, setServerItems] = useState<WishlistItem[] | null>(null);
  const mergedForSession = useRef(false);

  useEffect(() => {
    if (!authenticated) {
      mergedForSession.current = false;
      return;
    }
    if (mergedForSession.current) return;
    mergedForSession.current = true;

    const guestItems = localStore.getSnapshot();
    const sync = guestItems.length > 0
      ? fetchJson("/api/wishlist/merge", {
          method: "POST",
          body: JSON.stringify({ slugs: guestItems.map((i) => i.slug) }),
        }).then((data) => {
          localStore.setState([]);
          return data;
        })
      : fetchJson("/api/wishlist");

    sync.then((data) => setServerItems(data.items)).catch(() => setServerItems([]));
  }, [authenticated]);

  const items = authenticated ? (serverItems ?? []) : localItems;

  function isWishlisted(slug: string) {
    return items.some((i) => i.slug === slug);
  }

  function toggleItem(item: WishlistItem) {
    if (authenticated) {
      if (isWishlisted(item.slug)) {
        fetchJson(`/api/wishlist?slug=${encodeURIComponent(item.slug)}`, {
          method: "DELETE",
        }).then((data) => setServerItems(data.items));
      } else {
        fetchJson("/api/wishlist", {
          method: "POST",
          body: JSON.stringify({ slug: item.slug }),
        }).then((data) => setServerItems(data.items));
      }
      return;
    }
    const current = localStore.getSnapshot();
    const next = current.some((i) => i.slug === item.slug)
      ? current.filter((i) => i.slug !== item.slug)
      : [...current, item];
    localStore.setState(next);
  }

  function removeItem(slug: string) {
    if (authenticated) {
      fetchJson(`/api/wishlist?slug=${encodeURIComponent(slug)}`, { method: "DELETE" }).then(
        (data) => setServerItems(data.items)
      );
      return;
    }
    localStore.setState(localStore.getSnapshot().filter((i) => i.slug !== slug));
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
