// Illustrated icons for the category pills, kept in public/pills. A picture
// uploaded in Site Content for a pill always wins; these are the defaults.
//
// Keyed by pill slug. Where the same slug means something different on
// different pages (jewellery for her is earrings, for him a bracelet), an
// entry keyed "<audience>:<slug>" takes priority on that audience's page.
const P = "/pills/";
// Images are served with a one-year immutable cache, so a re-cut picture must
// get a new filename or browsers (and any CDN) keep showing the old one.
// Bump this whenever the files in public/pills change.
const VERSION = "v2";

const bySlug: Record<string, string> = {
  all: "all",
  // Shop and audience categories
  personalised: "personalised",
  "personalised-gifts": "personalised",
  "personalised-memories": "personalised",
  "personalised-couple-gifts": "personalised",
  "personalized-cute-kids-gifts": "personalised",
  "luxury-edit": "luxury",
  "luxury-gifts": "luxury",
  "luxury-couple-gifts": "luxury",
  "home-living": "home",
  "home-lifestyle": "home",
  "home-desk": "desk",
  jewellery: "earrings",
  "jewellery-accessories": "earrings",
  "couple-jewellery": "earrings",
  hamper: "hamper",
  "cute-trending-gifts": "trending",
  "flowers-floral-gifts": "floral",
  "perfumes-fragrance": "perfume",
  "wallets-accessories": "cufflinks",
  "gadgets-tech": "gadgets",
  "for-mom": "mom",
  "for-dad": "dad",
  "for-both-parents": "parents",
  "anniversary-gifts": "anniversary",
  "date-night": "date-night",
  "creative-diy-kits": "diy",
  "educational-interactive-toys": "toy",
  // Occasion page pills ("<type>:<value>")
  "audience:her": "her",
  "audience:him": "him",
  "audience:couples": "couple",
  "audience:parents": "parents",
  "recipient:kids": "kids",
  "category:luxury-edit": "luxury",
  "category:personalised": "personalised",
  "occasion:Diwali": "diwali",
  "occasion:Ganesh Chaturthi": "ganesh",
  "occasion:Navratri": "navratri",
  "occasion:Christmas": "christmas",
  "occasion:New Year": "new-year",
  "occasion:Holi": "holi",
  "occasion:Raksha Bandhan": "rakhi",
  "occasion:Eid": "eid",
};

const byScope: Record<string, string> = {
  "him:jewellery-accessories": "bracelet",
};

export function getPillImage(slug: string, scope?: string): string | null {
  const name = (scope && byScope[`${scope}:${slug}`]) || bySlug[slug];
  return name ? `${P}${name}-${VERSION}.png` : null;
}
