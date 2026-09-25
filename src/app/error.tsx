"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";

// Shown when something crashes while rendering a page (Next replaces just
// that page, keeping the site shell). Visitors never see the technical
// message: it goes to the console for us, and the short `digest` reference
// (an id Next also logs on the server) is all a visitor needs to quote if
// they contact support. In `next dev` the developer overlay still appears on
// top of this, which is expected — build for production to see what visitors do.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-terracotta-light/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-olive-light/25 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-lg px-6 py-16 text-center">
        {/* Plain <img>: an error screen shouldn't depend on the image optimizer. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/blissynest-logo.png" alt="Blissynest" className="mx-auto mb-10 h-8 w-auto" />

        <div className="mb-5 flex items-center justify-center gap-3">
          <span className="h-px w-9 bg-charcoal/25" />
          <p className="eyebrow text-charcoal/60">Something Went Wrong</p>
          <span className="h-px w-9 bg-charcoal/25" />
        </div>

        <h1 className="mb-4 font-serif text-3xl font-bold text-charcoal sm:text-4xl">
          We hit a small snag.
        </h1>
        <p className="mb-8 text-sm text-ink-muted sm:text-base">
          This page didn&apos;t load the way it should. It isn&apos;t anything you did. Please try
          again in a moment.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-olive-dark px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-olive"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-7 py-3.5 text-sm font-semibold text-charcoal transition-colors hover:bg-cream-dark"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <p className="mt-8 text-xs text-ink-muted">
          Still stuck?{" "}
          <Link href="/contact" className="font-medium text-terracotta-dark underline">
            Contact us
          </Link>
          {error.digest && (
            <>
              {" "}
              and mention reference{" "}
              <span className="font-mono text-charcoal-light">{error.digest}</span>
            </>
          )}
          .
        </p>
      </div>
    </main>
  );
}
