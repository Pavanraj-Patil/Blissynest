"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Heart, Trash2 } from "lucide-react";

export function RemoveFromCartDialog({
  open,
  item,
  onClose,
  onRemove,
  onMoveToWishlist,
}: {
  open: boolean;
  item: { name: string; image: string; price: number } | null;
  onClose: () => void;
  onRemove: () => void;
  onMoveToWishlist: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !item) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-charcoal/40 backdrop-blur-sm px-4 pb-4 sm:pb-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="remove-from-cart-title"
        aria-describedby="remove-from-cart-description"
      >
        <div className="flex items-center gap-3.5">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
          </div>
          <div className="min-w-0 flex-1">
            <p id="remove-from-cart-title" className="truncate text-sm font-medium text-charcoal">
              {item.name}
            </p>
            <p className="text-xs text-ink-muted mt-0.5">
              ₹{item.price.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <p id="remove-from-cart-description" className="mt-4 text-sm text-charcoal-light">
          Remove this from your cart, or save it to your wishlist for later?
        </p>

        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onMoveToWishlist}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-olive text-cream px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors"
          >
            <Heart size={14} />
            Move to Wishlist
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-charcoal/20 px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-charcoal hover:bg-cream-dark transition-colors"
          >
            <Trash2 size={14} />
            Remove from Cart
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-1 text-xs font-medium text-ink-muted hover:text-charcoal transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
