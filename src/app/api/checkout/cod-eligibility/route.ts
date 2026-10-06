import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSiteSettings } from "@/lib/site-settings";

// GET /api/checkout/cod-eligibility?slugs=a,b,c — tells the checkout page
// whether Cash on Delivery can be offered for the current cart, combining
// the site-wide switch with each product's own flag. Deliberately public
// (no auth) since it only answers a yes/no about publicly-visible products
// and needs to work for guest checkout too, where the cart never touches
// the server until order placement.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Capped to match the cart's own per-line-item limits (mergeCartSchema
  // etc.) so a crafted query string can't force an unbounded Prisma `IN`.
  const slugs = (searchParams.get("slugs") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 100);

  const settings = await getSiteSettings();
  if (!settings.codEnabled || slugs.length === 0) {
    return NextResponse.json({ codEnabled: settings.codEnabled, ineligibleSlugs: [] });
  }

  const products = await db.product.findMany({
    where: { slug: { in: slugs } },
    select: { slug: true, codAvailable: true },
  });
  const ineligibleSlugs = products.filter((p) => !p.codAvailable).map((p) => p.slug);

  return NextResponse.json({ codEnabled: true, ineligibleSlugs });
}
