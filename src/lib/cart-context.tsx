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

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const localStore = createLocalStore<CartItem[]>("blissynest-cart", []);

async function fetchJson(url: string, init?: RequestInit): Promise<{ items: CartItem[] }> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  return res.json();
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const authenticated = status === "authenticated";

  const localItems = useSyncExternalStore(
    localStore.subscribe,
    localStore.getSnapshot,
    localStore.getServerSnapshot
  );
  const [serverItems, setServerItems] = useState<CartItem[] | null>(null);
  const mergedForSession = useRef(false);

  // Once per sign-in: fold the guest cart (if any) into the server cart,
  // then treat the server as the source of truth for the rest of the
  // session. Resets if the user signs out and back in.
  useEffect(() => {
    if (!authenticated) {
      mergedForSession.current = false;
      return;
    }
    if (mergedForSession.current) return;
    mergedForSession.current = true;

    const guestItems = localStore.getSnapshot();
    const sync = guestItems.length > 0
      ? fetchJson("/api/cart/merge", {
          method: "POST",
          body: JSON.stringify({
            items: guestItems.map((i) => ({ slug: i.slug, quantity: i.quantity })),
          }),
        }).then((data) => {
          localStore.setState([]);
          return data;
        })
      : fetchJson("/api/cart");

    sync.then((data) => setServerItems(data.items)).catch(() => setServerItems([]));
  }, [authenticated]);

  const items = authenticated ? (serverItems ?? []) : localItems;

  function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
    if (authenticated) {
      fetchJson("/api/cart", {
        method: "POST",
        body: JSON.stringify({ slug: item.slug, quantity }),
      }).then((data) => setServerItems(data.items));
      return;
    }
    const current = localStore.getSnapshot();
    const existing = current.find((i) => i.slug === item.slug);
    const next = existing
      ? current.map((i) =>
          i.slug === item.slug ? { ...i, quantity: i.quantity + quantity } : i
        )
      : [...current, { ...item, quantity }];
    localStore.setState(next);
  }

  function removeItem(slug: string) {
    if (authenticated) {
      fetchJson(`/api/cart?slug=${encodeURIComponent(slug)}`, { method: "DELETE" }).then((data) =>
        setServerItems(data.items)
      );
      return;
    }
    localStore.setState(localStore.getSnapshot().filter((i) => i.slug !== slug));
  }

  function updateQuantity(slug: string, quantity: number) {
    if (authenticated) {
      fetchJson("/api/cart", {
        method: "PATCH",
        body: JSON.stringify({ slug, quantity }),
      }).then((data) => setServerItems(data.items));
      return;
    }
    const current = localStore.getSnapshot();
    localStore.setState(
      quantity <= 0
        ? current.filter((i) => i.slug !== slug)
        : current.map((i) => (i.slug === slug ? { ...i, quantity } : i))
    );
  }

  function clearCart() {
    if (authenticated) {
      fetchJson("/api/cart", { method: "DELETE" }).then((data) => setServerItems(data.items));
      return;
    }
    localStore.setState([]);
  }

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    count,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
