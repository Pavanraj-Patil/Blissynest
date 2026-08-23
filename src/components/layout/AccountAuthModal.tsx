"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ArrowLeft, X, Mail, Info } from "lucide-react";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.5-.4-3.5Z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 16.3 3 9.7 7.3 6.3 14.7Z"
      />
      <path
        fill="#4CAF50"
        d="M24 45c5.4 0 10.3-2.1 14-5.5l-6.5-5.5C29.4 35.9 26.8 37 24 37c-5.2 0-9.6-3.4-11.2-8l-6.6 5.1C9.6 40.6 16.3 45 24 45Z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.5 5.5C40.9 36.6 45 30.9 45 24c0-1.4-.1-2.5-.4-3.5Z"
      />
    </svg>
  );
}

export function AccountAuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleClose() {
    setSubmitted(false);
    onClose();
  }

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-white sm:bg-transparent">
      <div
        className="hidden sm:block absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative h-full sm:h-auto sm:mx-auto sm:mt-20 sm:max-w-sm sm:px-4">
        <div className="flex h-full sm:h-auto flex-col overflow-hidden bg-white sm:rounded-3xl sm:shadow-2xl">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Back"
            className="absolute left-3 top-3 z-10 flex h-9 w-9 sm:hidden items-center justify-center rounded-full bg-white/90 text-charcoal shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-charcoal/60 hover:text-charcoal transition-colors shrink-0"
          >
            <X size={18} />
          </button>

          <div className="relative h-28 shrink-0 overflow-hidden bg-gradient-to-br from-olive-dark to-terracotta-dark">
            <span className="absolute -right-4 -top-6 text-[7rem] leading-none text-cream/10 select-none">
              ✦
            </span>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
              <Image src="/icon.png" alt="" width={40} height={40} className="h-10 w-10" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-8 pt-12 text-center sm:pt-11">
            <h2 className="font-serif text-xl text-charcoal">
              Sign Up / Login to Blissynest!
            </h2>
            <p className="mt-1.5 text-sm text-ink-muted">
              For a personalised experience &amp; faster checkout.
            </p>

            {submitted ? (
              <div className="mt-6 text-left">
                <div className="flex gap-2.5 rounded-xl bg-cream-dark px-4 py-3.5 text-xs text-charcoal-light leading-relaxed">
                  <Info size={15} className="text-terracotta shrink-0 mt-0.5" />
                  <p>
                    Accounts aren&rsquo;t live in this demo yet — but Blissynest
                    is fully guest-friendly, so your cart and wishlist work
                    without one.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-4 w-full rounded-xl bg-olive text-cream px-6 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors"
                >
                  Continue as Guest
                </button>
              </div>
            ) : (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="mt-6 space-y-3 text-left"
                >
                  <label className="relative block">
                    <Mail
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/35"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Enter email address"
                      className="w-full rounded-lg border border-charcoal/15 py-3 pl-10 pr-3.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
                    />
                  </label>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-olive text-cream px-6 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors"
                  >
                    Continue
                  </button>
                </form>

                <div className="mt-5 flex items-center gap-3 text-xs text-ink-muted">
                  <span className="h-px flex-1 bg-charcoal/10" />
                  or continue with
                  <span className="h-px flex-1 bg-charcoal/10" />
                </div>

                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl border border-charcoal/15 px-6 py-3 text-sm font-medium text-charcoal hover:bg-cream-dark transition-colors"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                <p className="mt-6 text-[11px] text-ink-muted leading-relaxed">
                  By continuing, you agree to Blissynest&rsquo;s Terms of Use
                  and Privacy Policy.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
