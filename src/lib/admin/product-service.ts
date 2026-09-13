import { db } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import { rupeesToPaise } from "@/lib/currency";
import type { AdminProductInput } from "@/lib/validations/admin-product";
import { Prisma } from "@/generated/prisma/client";

type ErrorResult = { error: string; status: number };

function toPaise(rupees: number | undefined): number | undefined {
  return rupees === undefined ? undefined : rupeesToPaise(rupees);
}

function buildData(input: AdminProductInput): Prisma.ProductUncheckedCreateInput {
  return {
    slug: "", // set by caller — create derives it from name, update keeps the existing one
    name: input.name,
    tagline: input.tagline || null,
    pdpType: input.pdpType,
    audience: input.audience,
    category: input.category,
    collectionSlug: input.collectionSlug || null,
    breadcrumbCategory: input.breadcrumbCategory || null,
    occasionTags: input.occasionTags,
    recipientTags: input.recipientTags,
    relatedSlugs: [],
    attribute: input.attribute || null,
    badge: input.badge || null,
    basePrice: toPaise(input.basePrice)!,
    compareAtPrice: toPaise(input.compareAtPrice) ?? null,
    images: input.images,
    stockQuantity: input.stockQuantity,
    inStock: input.stockQuantity > 0,
    codAvailable: input.codAvailable,
    featured: input.featured,
    corporateOnly: input.corporateOnly,
    corporateNeeds: input.corporateNeeds,
    sortRank: input.sortRank ?? null,
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
          // Optional personalisation (name/message/color) on an otherwise
          // fixed hamper — reuses the same JSON shape CUSTOMISABLE writes
          // below, scoped to text/font/color only. Written as an explicit
          // null (not omitted) when there are no text lines, so turning
          // this off on an edit actually clears any previously saved
          // schema rather than leaving it stale — buildData() is called on
          // every update, and whatever it returns is persisted verbatim.
          customizationSchema:
            (input.textLines ?? []).length > 0
              ? {
                  textLines: input.textLines ?? [],
                  fonts: input.fonts ?? [],
                  colors: input.colors ?? [],
                  variantLabel: null,
                  variantOptions: null,
                  specs: null,
                }
              : Prisma.DbNull,
        }
      : {}),
    ...(input.pdpType === "STANDALONE"
      ? {
          variants: (input.variants ?? []).length > 0 ? input.variants : undefined,
          variantImages:
            input.variantImages && Object.keys(input.variantImages).length > 0
              ? input.variantImages
              : undefined,
        }
      : {}),
    ...(input.pdpType === "CUSTOMISABLE"
      ? {
          customizationSchema: {
            textLines: input.textLines ?? [],
            fonts: input.fonts ?? [],
            colors: input.colors ?? [],
            variantLabel: input.variantLabel || null,
            variantOptions: (input.variantOptions ?? []).length > 0 ? input.variantOptions : null,
            specs: (input.specs ?? []).length > 0 ? input.specs : null,
          },
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
  } catch (err) {
    // P2003 is Prisma's FK-constraint-violation code — the specific,
    // expected case where this product is referenced by a real
    // Order/CartItem/Wishlist/RestockRequest row (a hard delete should
    // refuse that; archiving is the real answer once a product has any
    // real activity against it). Anything else (a dropped connection, an
    // unrelated bug) is a real failure and shouldn't be reported as this.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
      return {
        error:
          "Can't delete this product — it's referenced by real orders, carts, or wishlists. Archive it instead (edit → Status → Archived).",
        status: 409,
      };
    }
    return { error: "Something went wrong deleting this product. Please try again.", status: 500 };
  }
}
