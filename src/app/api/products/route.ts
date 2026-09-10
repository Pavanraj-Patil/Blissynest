import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { productListQuerySchema, audienceSlugToEnum } from "@/lib/validations/product";

// GET /api/products — filter/sort/paginate the real catalogue. Replaces the
// client-side .filter()/.sort()/.slice() every shop/occasion/collection/
// personalised/gifting-assistant page currently does over the full mock
// array (BACKEND_HANDOFF.md Section 9) — this is the server-side version of
// exactly that same filter set.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = productListQuerySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid query" },
      { status: 400 }
    );
  }
  const { audience, category, collection, occasion, recipient, priceMin, priceMax, sort, page, pageSize } =
    parsed.data;

  const where: Prisma.ProductWhereInput = {
    status: "PUBLISHED",
    // MySQL wants a bare string for array_contains on a Json array column
    // (Postgres would need it wrapped in an array — not relevant here,
    // this app is MySQL-only, see prisma/schema.prisma's header).
    ...(audience && { audience: { array_contains: audienceSlugToEnum[audience] } }),
    ...(category && { category: { array_contains: category } }),
    ...(collection && { collectionSlug: collection }),
    ...(occasion && { occasionTags: { array_contains: occasion } }),
    ...(recipient && { recipientTags: { array_contains: recipient } }),
    ...((priceMin !== undefined || priceMax !== undefined) && {
      basePrice: {
        ...(priceMin !== undefined && { gte: priceMin }),
        ...(priceMax !== undefined && { lte: priceMax }),
      },
    }),
  };

  // "best-selling" and "newest" have no real signal to sort by yet — no
  // purchase-count or reliable launch-date field exists on Product beyond
  // createdAt, which only reflects when a row was inserted, not a real
  // "new arrival" curation. Falls back to insertion order, same honest gap
  // documented in BACKEND_HANDOFF.md Section 9 for the frontend's mock
  // version of this same sort option.
  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { basePrice: "asc" }
      : sort === "price-desc"
        ? { basePrice: "desc" }
        : sort === "rating"
          ? { rating: "desc" }
          : sort === "newest"
            ? { createdAt: "desc" }
            : { createdAt: "asc" }; // best-selling fallback

  const [items, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.product.count({ where }),
  ]);

  return NextResponse.json({
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}
