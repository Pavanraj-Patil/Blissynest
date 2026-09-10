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

  const result = await addQuantityToCart(
    session.user.id,
    parsed.data.slug,
    parsed.data.quantity,
    parsed.data.customization
  );
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  return NextResponse.json(result);
}

// PATCH /api/cart — set a line item to an exact quantity (0 removes it).
// Identified by cart-item id (not slug) so two differently-personalized
// lines of the same product can be edited independently.
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
  const { id, quantity } = parsed.data;

  // Scoped by cart.userId so a request can't touch another user's cart item.
  if (quantity <= 0) {
    await db.cartItem.deleteMany({ where: { id, cart: { userId: session.user.id } } });
  } else {
    await db.cartItem.updateMany({
      where: { id, cart: { userId: session.user.id } },
      data: { quantity },
    });
  }

  return NextResponse.json({ items: await getCartItemsForUser(session.user.id) });
}

// DELETE /api/cart?id=... — remove one line item entirely. No id clears the
// whole cart (used by checkout completion).
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const cart = await db.cart.findUnique({ where: { userId: session.user.id } });
  if (cart) {
    if (id) {
      await db.cartItem.deleteMany({ where: { id, cartId: cart.id } });
    } else {
      await db.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
  }

  return NextResponse.json({ items: await getCartItemsForUser(session.user.id) });
}
