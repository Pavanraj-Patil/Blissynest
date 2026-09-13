import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { toRelatedProduct } from "@/lib/product-adapters";
import { searchQuerySchema } from "@/lib/validations/search";
import { checkRateLimit, getClientIp, tooManyRequestsResponse } from "@/lib/rate-limit";

// GET /api/search — backs both the header's live-typing search overlay and
// the full /search results page. A plain `contains` filter (no `mode`
// option — MySQL has no query-time case-insensitivity flag like Postgres;
// it's already case-insensitive under the default collation) is enough at
// this catalogue size; swap for real full-text search once it isn't.
export async function GET(request: Request) {
  // Generous window — this backs live-typing search, which fires on every
  // keystroke — sized to stop scripted scraping/DoS, not real typing.
  const rateLimit = checkRateLimit(`search:${getClientIp(request)}`, 60, 60 * 1000);
  if (!rateLimit.allowed) return tooManyRequestsResponse(rateLimit.retryAfterSeconds!);

  const { searchParams } = new URL(request.url);
  const parsed = searchQuerySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid query" },
      { status: 400 }
    );
  }
  const { q, limit } = parsed.data;

  if (!q) {
    return NextResponse.json({ items: [], total: 0 });
  }

  const where = { status: "PUBLISHED" as const, corporateOnly: false, name: { contains: q } };

  const [rows, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: { reviewCount: "desc" },
      ...(limit ? { take: limit } : {}),
    }),
    db.product.count({ where }),
  ]);

  return NextResponse.json({ items: rows.map(toRelatedProduct), total });
}
