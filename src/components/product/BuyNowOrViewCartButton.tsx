"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag, Zap } from "lucide-react";
import { useCart } from "@/lib/cart-context";

type BuyNowOrViewCartButtonProps = {
  productSlug: string;
  onBuyNow: () => void;
  buyNowLabel?: string;
  disabled?: boolean;
  className?: string;
  iconSize?: number;
};

// Once THIS product is sitting in the cart, "Buy Now" is no longer an
// honest label for this slot — the shopper isn't buying it fresh from zero
// anymore. Swap it for a "View Cart" shortcut instead, badge and all (same
// pattern FNP uses) — Add to Cart elsewhere on the page still never
// redirects. Keyed to this product specifically (not "is the cart
// non-empty") so browsing to a different product still shows "Buy Now".
export function BuyNowOrViewCartButton({
  productSlug,
  onBuyNow,
  buyNowLabel = "Buy Now",
  disabled = false,
  className = "",
  iconSize = 15,
}: BuyNowOrViewCartButtonProps) {
  const router = useRouter();
  const { items, count } = useCart();
  const inCart = items.some((i) => i.slug === productSlug);

  if (inCart) {
    return (
      <button
        type="button"
        onClick={() => router.push("/cart")}
        className={`relative ${className}`}
      >
        <ShoppingBag size={iconSize} />
        View Cart
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta-dark text-[10px] font-semibold text-cream">
          {count > 9 ? "9+" : count}
        </span>
      </button>
    );
  }

  return (
    <button type="button" onClick={onBuyNow} disabled={disabled} className={className}>
      <Zap size={iconSize} />
      {buyNowLabel}
    </button>
  );
}
