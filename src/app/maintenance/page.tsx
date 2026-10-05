import type { Metadata } from "next";
import { getBusinessDetails } from "@/lib/content-service";
import { getMaintenanceStatus } from "@/lib/site-settings";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { GiftBoxLoader } from "@/components/ui/GiftBoxLoader";
import { Countdown } from "./Countdown";

// Never meant to be found or indexed on its own — it's only ever shown by
// proxy.ts rewriting a real page here while maintenance mode is on. Visiting
// it directly always works too (handy for previewing it from the admin).
export const metadata: Metadata = {
  title: "We'll Be Right Back | Blissynest",
  robots: { index: false, follow: false },
};

const DEFAULT_MESSAGE =
  "We're making a few changes behind the scenes to make your gifting experience even better. We'll be back shortly — thank you for your patience.";

export default async function MaintenancePage() {
  const [{ maintenanceMessage, maintenanceReturnAt }, business] = await Promise.all([
    getMaintenanceStatus(),
    getBusinessDetails(),
  ]);

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-terracotta-light/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-0 h-64 w-64 rounded-full bg-olive-light/25 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-lg px-6 py-16 text-center">
        {/* Plain <img>: this page should render even if the image optimizer is part of what's down. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/blissynest-logo.png" alt="Blissynest" className="mx-auto mb-10 h-8 w-auto" />

        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="h-px w-9 bg-charcoal/25" />
          <p className="eyebrow text-charcoal/60">Back Soon</p>
          <span className="h-px w-9 bg-charcoal/25" />
        </div>

        <h1 className="mb-8 text-balance font-serif text-3xl font-bold text-charcoal sm:text-4xl">
          We&rsquo;re wrapping something special.
        </h1>

        <GiftBoxLoader label="Hang tight…" size={128} />

        <p className="mx-auto mt-7 max-w-sm text-sm leading-relaxed text-ink-muted sm:text-base">
          {maintenanceMessage || DEFAULT_MESSAGE}
        </p>

        {maintenanceReturnAt && <Countdown target={maintenanceReturnAt} />}

        <div className="mx-auto mt-10 max-w-xs border-t border-charcoal/10 pt-8">
          <p className="text-sm font-medium text-charcoal">Want to know the moment we&rsquo;re back?</p>
          <NewsletterForm className="mt-3" />
        </div>

        {(business.contactEmail || business.contactPhone) && (
          <p className="mt-8 text-xs text-ink-muted">
            Need help right now?{" "}
            {business.contactEmail && (
              <a
                href={`mailto:${business.contactEmail}`}
                className="font-medium text-terracotta-dark underline"
              >
                {business.contactEmail}
              </a>
            )}
            {business.contactEmail && business.contactPhone && " or "}
            {business.contactPhone && (
              <a href={`tel:${business.contactPhone}`} className="font-medium text-terracotta-dark underline">
                {business.contactPhone}
              </a>
            )}
            .
          </p>
        )}
      </div>
    </main>
  );
}
