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
import type { CartItemCustomization } from "@/lib/product-adapters";

export type { CartItemCustomization };

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customization?: CartItemCustomization;
};

// Two lines are "the same line" (quantities combine) only when their
// customization matches exactly — two differently-personalized instances of
// the same product are genuinely different purchases and must stay separate
// lines, not silently collapse into one (which would drop one of them).
function sameLine(a: { slug: string; customization?: CartItemCustomization }, b: typeof a) {
  return a.slug === b.slug && JSON.stringify(a.customization ?? null) === JSON.stringify(b.customization ?? null);
}

type CartContextValue = {
  items: CartItem[];
  // True while the real cart is still being resolved — the session status
  // hasn't settled yet, or it has settled as authenticated but the server
  // cart hasn't come back yet. Pages must not treat `items.length === 0`
  // as "genuinely empty" while this is true, or a signed-in shopper with
  // real items sees a misleading empty-cart flash on every load.
  loading: boolean;
  addItem: (
    item: Omit<CartItem, "id" | "quantity">,
    quantity?: number
  ) => Promise<void>;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
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
            items: guestItems.map((i) => ({
              slug: i.slug,
              quantity: i.quantity,
              customization: i.customization,
            })),
          }),
        }).then((data) => {
          localStore.setState([]);
          return data;
        })
      : fetchJson("/api/cart");

    sync.then((data) => setServerItems(data.items)).catch(() => setServerItems([]));
  }, [authenticated]);

  const items = authenticated ? (serverItems ?? []) : localItems;
  const loading = status === "loading" || (authenticated && serverItems === null);

  // Resolves once the cart is actually updated (immediately for guests; after
  // the server confirms for signed-in shoppers), so buttons can show "Adding…".
  async function addItem(item: Omit<CartItem, "id" | "quantity">, quantity = 1): Promise<void> {
    if (authenticated) {
      const data = await fetchJson("/api/cart", {
        method: "POST",
        body: JSON.stringify({ slug: item.slug, quantity, customization: item.customization }),
      });
      setServerItems(data.items);
      return;
    }
    const current = localStore.getSnapshot();
    const existing = current.find((i) => sameLine(i, item));
    const next = existing
      ? current.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      : [...current, { ...item, id: crypto.randomUUID(), quantity }];
    localStore.setState(next);
  }

  function removeItem(id: string) {
    if (authenticated) {
      fetchJson(`/api/cart?id=${encodeURIComponent(id)}`, { method: "DELETE" }).then((data) =>
        setServerItems(data.items)
      );
      return;
    }
    localStore.setState(localStore.getSnapshot().filter((i) => i.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    if (authenticated) {
      fetchJson("/api/cart", {
        method: "PATCH",
        body: JSON.stringify({ id, quantity }),
      }).then((data) => setServerItems(data.items));
      return;
    }
    const current = localStore.getSnapshot();
    localStore.setState(
      quantity <= 0
        ? current.filter((i) => i.id !== id)
        : current.map((i) => (i.id === id ? { ...i, quantity } : i))
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
    loading,
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
