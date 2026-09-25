"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Gift } from "lucide-react";
import { useSiteContent } from "@/lib/site-content-context";

// Shown at the bottom of shop-style pages. Someone who just used the gift
// finder ("Not sure what to gift?") to get here is already being helped, so a
// second identical prompt would be repetitive: the finder tags the URL with
// ?from=finder and the banner steps aside for that visit. Suspense is required
// for reading the URL; the fallback is the banner itself so a normal visit
// never sees it blink in.
export function ShopGiftBanner() {
  return (
    <Suspense fallback={<GiftBanner />}>
      <FinderAwareBanner />
    </Suspense>
  );
}

function FinderAwareBanner() {
  const cameFromFinder = useSearchParams().get("from") === "finder";
  if (cameFromFinder) return null;
  return <GiftBanner />;
}

function GiftBanner() {
  const { shopGiftBannerVisible, shopGiftBannerText } = useSiteContent();
  if (!shopGiftBannerVisible) return null;

  return (
    <div className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-olive-dark px-6 py-6 text-cream sm:flex-row sm:items-center sm:gap-8 sm:px-8">
      <div className="flex items-center gap-4">
        <span aria-hidden className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-light/50 text-gold-light sm:flex">
          <Gift size={18} strokeWidth={1.5} />
        </span>
        <div>
          <h2 className="font-serif text-xl md:text-2xl">{shopGiftBannerText.heading}</h2>
          <p className="mt-1 text-sm text-cream/75">{shopGiftBannerText.body}</p>
        </div>
      </div>
      <Link
        href="/gifting-assistant"
        className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-cream px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-olive-dark transition-colors hover:bg-white"
      >
        {shopGiftBannerText.buttonLabel}
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
