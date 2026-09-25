import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { getSiteUrl } from "@/lib/site-url";
import { audienceSlugs } from "@/lib/shop-mock-data";
import { collectionSlugs } from "@/lib/collection-mock-data";
import { occasionSlugs } from "@/lib/occasion-data";
import { corporateNeedSlugs } from "@/lib/corporate-data";
import { getPublishedPosts } from "@/lib/journal-service";

// Generated on request so new products show up without a rebuild.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const now = new Date();

  const staticPaths: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/shop", priority: 0.9 },
    { path: "/collections", priority: 0.8 },
    { path: "/occasions", priority: 0.8 },
    { path: "/personalised", priority: 0.8 },
    { path: "/gifting-assistant", priority: 0.6 },
    { path: "/corporate", priority: 0.7 },
    { path: "/corporate/quote", priority: 0.5 },
    { path: "/about", priority: 0.5 },
    { path: "/journal", priority: 0.5 },
    { path: "/contact", priority: 0.5 },
    { path: "/faqs", priority: 0.4 },
    { path: "/shipping", priority: 0.4 },
    { path: "/returns", priority: 0.4 },
    { path: "/privacy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
  ];

  const groupPaths = [
    ...audienceSlugs.map((s) => `/shop/${s}`),
    ...collectionSlugs.map((s) => `/collections/${s}`),
    ...occasionSlugs.map((s) => `/occasions/${s}`),
    ...corporateNeedSlugs.map((s) => `/corporate/${s}`),
  ];

  const journal = await getPublishedPosts();
  const products = await db.product.findMany({
    where: { status: "PUBLISHED", corporateOnly: false },
    select: { slug: true, updatedAt: true },
  });

  return [
    ...staticPaths.map((p) => ({
      url: `${site}${p.path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p.priority,
    })),
    ...journal.map((p) => ({
      url: `${site}/journal/${p.slug}`,
      lastModified: new Date(p.published),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...groupPaths.map((path) => ({
      url: `${site}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: `${site}/product/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
