"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
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
const store = createLocalStore<CartItem[]>("blissynest-cart", []);

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );

  function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
    const existing = items.find((i) => i.slug === item.slug);
    const next = existing
      ? items.map((i) =>
          i.slug === item.slug ? { ...i, quantity: i.quantity + quantity } : i
        )
      : [...items, { ...item, quantity }];
    store.setState(next);
  }

  function removeItem(slug: string) {
    store.setState(items.filter((i) => i.slug !== slug));
  }

  function updateQuantity(slug: string, quantity: number) {
    store.setState(
      quantity <= 0
        ? items.filter((i) => i.slug !== slug)
        : items.map((i) => (i.slug === slug ? { ...i, quantity } : i))
    );
  }

  function clearCart() {
    store.setState([]);
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
