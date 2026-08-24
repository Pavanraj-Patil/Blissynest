import { db } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import type { AdminProductInput } from "@/lib/validations/admin-product";
import type { Prisma } from "@/generated/prisma/client";

type ErrorResult = { error: string; status: number };

// The form collects prices in plain rupees (what an admin naturally
// types); this is the one place that gets converted to paise before
// touching the database, matching every other paise-boundary in this app.
function toPaise(rupees: number | undefined): number | undefined {
  return rupees === undefined ? undefined : Math.round(rupees * 100);
}

function buildData(input: AdminProductInput): Prisma.ProductUncheckedCreateInput {
  return {
    slug: "", // set by caller — create derives it from name, update keeps the existing one
    name: input.name,
    tagline: input.tagline || null,
    pdpType: input.pdpType,
    audience: input.audience || null,
    category: input.category,
    collectionSlug: input.collectionSlug || null,
    breadcrumbCategory: input.breadcrumbCategory || null,
    occasionTags: input.occasionTags,
    recipientTags: input.recipientTags,
    attribute: input.attribute || null,
    badge: input.badge || null,
    basePrice: toPaise(input.basePrice)!,
    compareAtPrice: toPaise(input.compareAtPrice) ?? null,
    images: input.images,
    stockQuantity: input.stockQuantity,
    inStock: input.stockQuantity > 0,
    featured: input.featured,
    status: input.status,
    productDetails: {
      description: input.description,
      ...(input.materials && { materials: input.materials }),
      ...(input.dimensions && { dimensions: input.dimensions }),
      ...(input.howToUse && { howToUse: input.howToUse }),
      ...(input.care && { care: input.care }),
      delivery: input.delivery,
    },
    ...(input.pdpType === "HAMPER"
      ? {
          whatsInside: (input.whatsInside ?? []).map((item) => ({
            icon: "Gift",
            name: item.name,
            subtitle: item.subtitle,
            qty: item.qty,
          })),
          personalNoteLabel: input.personalNoteLabel || null,
          personalNotePrice: toPaise(input.personalNotePrice) ?? null,
        }
      : {}),
    ...(input.pdpType === "STANDALONE"
      ? {
          variants: (input.variants ?? []).length > 0 ? input.variants : undefined,
        }
      : {}),
  };
}

export async function createProduct(
  input: AdminProductInput
): Promise<ErrorResult | { id: string; slug: string }> {
  const slug = slugify(input.name);
  const existing = await db.product.findUnique({ where: { slug } });
  if (existing) {
    return {
      error: `A product with slug "${slug}" already exists — try a slightly different name.`,
      status: 409,
    };
  }

  const product = await db.product.create({ data: { ...buildData(input), slug } });
  return { id: product.id, slug: product.slug };
}

export async function updateProduct(
  id: string,
  input: AdminProductInput
): Promise<ErrorResult | { id: string; slug: string }> {
  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) return { error: "Product not found.", status: 404 };

  // Slug and pdpType are locked after creation — see AdminProductForm's
  // comments. Whatever pdpType-specific fields (whatsInside/variants) don't
  // apply to this product's actual pdpType are simply not touched.
  const data = buildData({ ...input, pdpType: existing.pdpType as AdminProductInput["pdpType"] });
  const { slug: _slug, ...updateData } = data;
  void _slug;

  await db.product.update({ where: { id }, data: updateData });
  return { id, slug: existing.slug };
}

export async function deleteProduct(id: string): Promise<ErrorResult | { success: true }> {
  try {
    await db.product.delete({ where: { id } });
    return { success: true };
  } catch {
    // Prisma throws on the FK constraint if this product is referenced by
    // a real Order/CartItem/Wishlist/RestockRequest row — which is exactly
    // the case a hard delete should refuse (never break order history).
    // Archiving (status = ARCHIVED, via the edit form) is the real answer
    // once a product has any real activity against it.
    return {
      error:
        "Can't delete this product — it's referenced by real orders, carts, or wishlists. Archive it instead (edit → Status → Archived).",
      status: 409,
    };
  }
}
