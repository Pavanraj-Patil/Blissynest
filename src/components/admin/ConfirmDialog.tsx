"use client";

import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  submitting = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  submitting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta/10">
          <AlertTriangle size={20} className="text-terracotta-dark" />
        </div>
        <h2 className="mt-4 font-serif text-lg text-charcoal">{title}</h2>
        <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{description}</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-charcoal/20 px-4 py-2.5 text-xs font-semibold tracking-[0.08em] uppercase text-charcoal hover:bg-cream-dark transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="flex-1 rounded-xl bg-terracotta-dark text-cream px-4 py-2.5 text-xs font-semibold tracking-[0.08em] uppercase hover:bg-terracotta transition-colors disabled:opacity-60"
          >
            {submitting ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
