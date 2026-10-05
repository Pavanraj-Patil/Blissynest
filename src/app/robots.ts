import type { MetadataRoute } from "next";
import { getSiteUrl, isIndexingAllowed } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();
  if (!isIndexingAllowed()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private or pointless-to-index areas: admin, APIs, and per-visitor
        // pages (cart, checkout, account, wishlist).
        disallow: [
          "/admin",
          "/api/",
          "/account",
          "/cart",
          "/checkout",
          "/wishlist",
          "/track-order",
          "/cdn-cgi/",
          "/maintenance",
        ],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
