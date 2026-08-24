import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getWishlistItemsForUser, addToWishlist } from "@/lib/wishlist-service";
import { wishlistItemSchema } from "@/lib/validations/wishlist";

// GET /api/wishlist — the signed-in user's wishlist. Guests keep using the
// existing localStorage wishlist (src/lib/wishlist-context.tsx).
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ items: await getWishlistItemsForUser(session.user.id) });
}

// POST /api/wishlist — add a product (no-op if already wishlisted).
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = wishlistItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const result = await addToWishlist(session.user.id, parsed.data.slug);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  return NextResponse.json(result);
}

// DELETE /api/wishlist?slug=... — remove one product.
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (slug) {
    const product = await db.product.findUnique({ where: { slug } });
    if (product) {
      await db.wishlist.deleteMany({ where: { userId: session.user.id, productId: product.id } });
    }
  }

  return NextResponse.json({ items: await getWishlistItemsForUser(session.user.id) });
}
