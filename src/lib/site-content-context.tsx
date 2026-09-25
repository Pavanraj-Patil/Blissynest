"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ResponsiveImageValue } from "@/lib/content-schema";

// A handful of pieces of content that are genuinely global (shown
// identically across many routes, e.g. ShopGiftBanner on /shop, /occasions,
// /occasions/[occasion], /collections, /collections/[collection]) are
// fetched once server-side in the root layout and handed down via context,
// rather than prop-drilling through every page/*Client.tsx pair that
// happens to render them.
type SiteContent = {
  shopGiftBannerImage: ResponsiveImageValue;
  // Admin can switch the banner off site-wide (Site Content → Shop Gift Banner).
  shopGiftBannerVisible: boolean;
  shopGiftBannerText: { heading: string; body: string; buttonLabel: string };
  // Optional admin-uploaded photo per category pill slug (see
  // CategoryPillRow.tsx) — falls back to a Lucide icon wherever a slug has
  // no value here.
  categoryPillImages: Record<string, string>;
  // Footer bits that inner pages' ShopFooter (a client component) shows, so
  // they follow Site Content → Footer instead of being hardcoded there.
  footer: {
    newsletterHeading: string;
    newsletterSubcopy: string;
    instagramUrl: string;
    facebookUrl: string;
    linkedinUrl: string;
    pinterestUrl: string;
    youtubeUrl: string;
  };
};

const SiteContentContext = createContext<SiteContent | null>(null);

export function SiteContentProvider({
  value,
  children,
}: {
  value: SiteContent;
  children: ReactNode;
}) {
  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent(): SiteContent {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error("useSiteContent must be used within SiteContentProvider");
  return ctx;
}
