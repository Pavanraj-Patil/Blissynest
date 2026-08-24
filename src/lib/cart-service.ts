import { db } from "@/lib/db";
import { toCartItemDTO, type CartItemDTO } from "@/lib/product-adapters";

// Every mutating cart endpoint returns the full item list afterward (rather
// than just the one line changed) so the client can replace its state in
// one shot instead of reconciling a partial update — same contract as the
// merge endpoint.
export async function getCartItemsForUser(userId: string): Promise<CartItemDTO[]> {
  const cart = await db.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true }, orderBy: { createdAt: "asc" } } },
  });
  return cart ? cart.items.map(toCartItemDTO) : [];
}

async function ensureCart(userId: string) {
  return db.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

// Adds `quantity` on top of whatever's already in the cart for that product
// (creating the line if it doesn't exist yet) — used by both the plain "add
// to cart" endpoint and the guest-cart merge, which is really just N adds.
export async function addQuantityToCart(userId: string, slug: string, quantity: number) {
  const product = await db.product.findUnique({ where: { slug } });
  if (!product || product.status !== "PUBLISHED") {
    return { error: "Product not found" as const };
  }

  const cart = await ensureCart(userId);
  const existing = await db.cartItem.findFirst({
    where: { cartId: cart.id, productId: product.id },
  });

  if (existing) {
    await db.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await db.cartItem.create({
      data: { cartId: cart.id, productId: product.id, quantity },
    });
  }

  return { items: await getCartItemsForUser(userId) };
}
