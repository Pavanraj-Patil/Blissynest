"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export function AddedToCartModal({
  open,
  onClose,
  name,
  image,
  price,
  quantity,
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  image: string;
  price: number;
  quantity: number;
}) {
  const router = useRouter();

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

  if (!open) return null;

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
      >
        <div className="flex items-center gap-2 text-olive-dark">
          <CheckCircle2 size={19} />
          <p className="text-sm font-semibold">Added to your cart</p>
        </div>

        <div className="mt-4 flex items-center gap-3.5">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
            <Image src={image} alt={name} fill className="object-cover" sizes="64px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-charcoal">{name}</p>
            <p className="text-xs text-ink-muted mt-0.5">Qty: {quantity}</p>
          </div>
          <p className="text-sm font-semibold text-charcoal shrink-0">
            ₹{(price * quantity).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="flex-1 rounded-xl bg-olive text-cream px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors"
          >
            Buy Now
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-charcoal/20 px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-charcoal hover:bg-cream-dark transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
