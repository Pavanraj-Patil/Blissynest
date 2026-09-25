// The site's public origin, used for canonical URLs, the sitemap, and social
// share cards. Set NEXT_PUBLIC_SITE_URL in production (e.g. https://blissynest.com);
// AUTH_URL is accepted as a fallback since it is already the public origin
// when auth is configured for a hosted site.
// Search engines are only invited once ALLOW_SEARCH_INDEXING=true is set —
// on the live production site. Everywhere else (localhost, the UAT tunnel,
// any preview) stays hidden from Google so a test copy never competes with,
// or leaks ahead of, the real store.
export function isIndexingAllowed(): boolean {
  return process.env.ALLOW_SEARCH_INDEXING === "true";
}

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.AUTH_URL || "https://blissynest.com";
  return raw.replace(/\/+$/, "");
}
