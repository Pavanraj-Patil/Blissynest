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
import { useToast } from "@/lib/toast-context";

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
  // True while the real wishlist is still being resolved — see the
  // matching flag on CartContext (cart-context.tsx) for why pages must not
  // treat `items.length === 0` as "genuinely empty" while this is true.
  loading: boolean;
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
  const data = await res.json().catch(() => null);
  // A non-OK response must reject, not resolve with no `items` — otherwise
  // toggleItem below silently no-ops instead of the heart ever reflecting
  // what actually happened server-side.
  if (!res.ok) {
    throw new Error((data && typeof data.error === "string" && data.error) || "Request failed");
  }
  return data;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const authenticated = status === "authenticated";
  const { showToast } = useToast();

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
  const loading = status === "loading" || (authenticated && serverItems === null);

  function isWishlisted(slug: string) {
    return items.some((i) => i.slug === slug);
  }

  function toggleItem(item: WishlistItem) {
    if (authenticated) {
      // Fire-and-forget by design (the heart icon has no busy state to get
      // stuck). The heart's filled/outline state is read straight from
      // `items` (derived from `serverItems`, only updated on success below),
      // so on failure it simply doesn't flip — already correct, just silent
      // until the toast.
      if (isWishlisted(item.slug)) {
        fetchJson(`/api/wishlist?slug=${encodeURIComponent(item.slug)}`, {
          method: "DELETE",
        })
          .then((data) => setServerItems(data.items))
          .catch(() => showToast("Couldn't remove that from your wishlist. Please try again."));
      } else {
        fetchJson("/api/wishlist", {
          method: "POST",
          body: JSON.stringify({ slug: item.slug }),
        })
          .then((data) => setServerItems(data.items))
          .catch(() => showToast("Couldn't add that to your wishlist. Please try again."));
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
      fetchJson(`/api/wishlist?slug=${encodeURIComponent(slug)}`, { method: "DELETE" })
        .then((data) => setServerItems(data.items))
        .catch(() => showToast("Couldn't remove that from your wishlist. Please try again."));
      return;
    }
    localStore.setState(localStore.getSnapshot().filter((i) => i.slug !== slug));
  }

  const count = items.length;

  const value: WishlistContextValue = {
    items,
    loading,
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
