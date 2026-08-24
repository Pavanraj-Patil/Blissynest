import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getCartItemsForUser, addQuantityToCart } from "@/lib/cart-service";
import { addCartItemSchema, updateCartItemSchema } from "@/lib/validations/cart";

// GET /api/cart — the signed-in user's cart. Guests keep using the existing
// localStorage cart (src/lib/cart-context.tsx); this route only exists for
// authenticated requests.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ items: await getCartItemsForUser(session.user.id) });
}

// POST /api/cart — add `quantity` of a product, incrementing an existing
// line if it's already in the cart.
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = addCartItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const result = await addQuantityToCart(session.user.id, parsed.data.slug, parsed.data.quantity);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  return NextResponse.json(result);
}

// PATCH /api/cart — set a line item to an exact quantity (0 removes it).
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateCartItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }
  const { slug, quantity } = parsed.data;

  const cart = await db.cart.findUnique({ where: { userId: session.user.id } });
  if (cart) {
    const product = await db.product.findUnique({ where: { slug } });
    if (product) {
      const existing = await db.cartItem.findFirst({
        where: { cartId: cart.id, productId: product.id },
      });
      if (existing) {
        if (quantity <= 0) {
          await db.cartItem.delete({ where: { id: existing.id } });
        } else {
          await db.cartItem.update({ where: { id: existing.id }, data: { quantity } });
        }
      }
    }
  }

  return NextResponse.json({ items: await getCartItemsForUser(session.user.id) });
}

// DELETE /api/cart?slug=... — remove one line item entirely.
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const cart = await db.cart.findUnique({ where: { userId: session.user.id } });
    if (cart) {
      const product = await db.product.findUnique({ where: { slug } });
      if (product) {
        await db.cartItem.deleteMany({ where: { cartId: cart.id, productId: product.id } });
      }
    }
  } else {
    // No slug — clear the whole cart (used by checkout completion).
    const cart = await db.cart.findUnique({ where: { userId: session.user.id } });
    if (cart) {
      await db.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
  }

  return NextResponse.json({ items: await getCartItemsForUser(session.user.id) });
}
