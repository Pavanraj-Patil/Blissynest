"use client";

import { useEffect } from "react";
import "./globals.css";

// Last-resort screen for a crash in the root layout itself, which replaces
// the whole document — so it brings its own <html>/<body> and can't rely on
// providers, fonts, or the router (hence plain <a> links and a plain <img>).
export default function GlobalError({
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
    <html lang="en">
      <body className="bg-cream text-charcoal">
        <main className="flex min-h-screen items-center justify-center px-6 py-16 text-center">
          <div className="w-full max-w-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/blissynest-logo.png" alt="Blissynest" className="mx-auto mb-10 h-8 w-auto" />
            <h1 className="mb-4 text-3xl font-bold" style={{ fontFamily: "Georgia, serif" }}>
              We hit a small snag.
            </h1>
            <p className="mb-8 text-sm text-ink-muted sm:text-base">
              The site didn&apos;t load the way it should. It isn&apos;t anything you did — please
              try again in a moment.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={reset}
                className="rounded-full bg-olive-dark px-7 py-3.5 text-sm font-semibold text-cream hover:bg-olive"
              >
                Try again
              </button>
              {/* Full page load on purpose: the router may be what crashed. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/"
                className="rounded-full border border-charcoal/20 px-7 py-3.5 text-sm font-semibold text-charcoal hover:bg-cream-dark"
              >
                Back to Home
              </a>
            </div>
            {error.digest && (
              <p className="mt-8 text-xs text-ink-muted">
                Reference: <span className="font-mono">{error.digest}</span>
              </p>
            )}
          </div>
        </main>
      </body>
    </html>
  );
}
