import { db } from "@/lib/db";
import { toWishlistItemDTO, type WishlistItemDTO } from "@/lib/product-adapters";

export async function getWishlistItemsForUser(userId: string): Promise<WishlistItemDTO[]> {
  const rows = await db.wishlist.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((r) => toWishlistItemDTO(r.product));
}

export async function addToWishlist(userId: string, slug: string) {
  const product = await db.product.findUnique({ where: { slug } });
  if (!product || product.status !== "PUBLISHED") {
    return { error: "Product not found" as const };
  }
  await db.wishlist.upsert({
    where: { userId_productId: { userId, productId: product.id } },
    create: { userId, productId: product.id },
    update: {},
  });
  return { items: await getWishlistItemsForUser(userId) };
}
