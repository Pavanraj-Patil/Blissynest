"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";

type Toast = { id: string; message: string };

type ToastContextValue = {
  // Surfaces a brief, dismissible notice for an action that happened
  // outside any visible busy/error state — the wishlist heart and the cart
  // row's quantity stepper/remove button, which update optimistically with
  // nothing else on screen to show a failure. Not for form submissions:
  // those already have their own inline "Something went wrong" text next to
  // the button that triggered them, which stays legible after the user's
  // attention has moved on; a toast that auto-dismisses would be worse there.
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 5000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  // Keyed by toast id so a fast run of failures (e.g. removing several cart
  // rows while offline) doesn't leave earlier timers dismissing the wrong,
  // later-added toast.
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (message: string) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
      );
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        // bottom-20 clears the sticky "Add to Cart" bar that several pages
        // show below md (MobileStickyCTA and similar) — below md a toast at
        // true bottom-0 would sit on top of it and block its buttons for
        // however long the toast is up. From md there's no such bar, so it
        // drops back to the viewport edge (plus the safe-area inset either way).
        className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex flex-col items-center gap-2 px-4 pb-[env(safe-area-inset-bottom)] sm:items-end sm:px-6 md:bottom-0 md:pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-xl bg-charcoal px-4 py-3 text-sm text-cream shadow-lg animate-[toast-in_0.2s_ease-out]"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-terracotta-light" />
            <p className="flex-1 leading-snug">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="shrink-0 text-cream/60 hover:text-cream transition-colors"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
