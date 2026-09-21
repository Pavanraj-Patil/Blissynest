// Converts a real Prisma `Product` row into the exact shapes the frontend's
// pre-existing components already expect (ShopProduct/CollectionProduct-like
// list cards, and the ProductDetail union from product-mock-data.ts consumed
// by HamperPDP/CustomisablePDP/StandalonePDP/ReviewsSection). Keeping the
// target shapes identical means none of those presentational components
// needed to change when catalogue pages moved off static mock data — only
// the page-level components that fetch data changed.
import type { CartItem as PrismaCartItem, Product } from "@/generated/prisma/client";
import type { AudienceSlug } from "@/lib/shop-mock-data";
import type { ProductDetail } from "@/lib/product-mock-data";
import { audienceEnumToSlug } from "@/lib/validations/product";

// Shape of CartItem.customization / OrderItem.customization (see
// prisma/schema.prisma). Two unrelated shapes share this one optional
// object rather than two separate cart-item fields: CustomisablePDP
// populates textLines/font/colorHex/variant for a personalized product;
// StandalonePDP populates `variants` (variant-group label -> selected
// option) for a plain product with color/size-style choices. A single
// cart line only ever has one shape populated, never both.
export type CartItemCustomization = {
  // Customer-uploaded photos (public R2 URLs) for products that let shoppers
  // send their own images — see CustomerImageUploader.
  imageUrls?: string[];
  textLines?: string[];
  font?: string;
  colorHex?: string;
  variant?: string;
  variants?: Record<string, string>;
};

// Every amount in the DB is paise (see prisma/schema.prisma header); the
// frontend's mock data — and everything built on top of it (cart, PDP,
// product cards) — works in plain rupees. This is the one place that
// conversion happens for data flowing out of the database.
function toRupees(paise: number): number {
  return Math.round(paise / 100);
}

export type ListProduct = {
  id: string; // slug — every existing component builds hrefs as `/product/${id}`
  name: string;
  price: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  image: string;
  category: string[];
  audience: AudienceSlug[];
  collectionSlug: string | null;
  occasions: string[];
  recipients: string[];
  attribute?: string;
  badge?: "Bestseller" | "New";
};

export function toListProduct(p: Product): ListProduct {
  return {
    id: p.slug,
    name: p.name,
    price: toRupees(p.basePrice),
    rating: p.rating,
    reviews: p.reviewCount,
    inStock: p.inStock,
    image: (p.images as string[])[0],
    category: p.category as string[],
    audience: (p.audience as string[]).map((a) => audienceEnumToSlug[a as keyof typeof audienceEnumToSlug]),
    collectionSlug: p.collectionSlug,
    occasions: p.occasionTags as string[],
    recipients: p.recipientTags as string[],
    attribute: p.attribute ?? undefined,
    badge: p.badge === "BESTSELLER" ? "Bestseller" : p.badge === "NEW" ? "New" : undefined,
  };
}

type ProductDetailsJson = {
  description: string;
  materials?: string;
  dimensions?: string;
  howToUse?: string;
  care?: string;
  delivery: string;
};

type CustomizationSchemaJson = {
  textLines: { label: string; required: boolean; maxLength: number; placeholder: string }[];
  fonts: string[];
  colors: { name: string; hex: string }[];
  variantLabel?: string | null;
  variantOptions?: string[] | null;
  specs?: { icon: string; label: string; value: string }[] | null;
  imageUpload?: { maxImages: number; required: boolean } | null;
};

// Matches the real product's pdpType exactly, so HamperPDP/CustomisablePDP/
// StandalonePDP (which switch on `product.pdpType`) render unchanged.
export function toProductDetail(p: Product): ProductDetail {
  const base = {
    slug: p.slug,
    name: p.name,
    tagline: p.tagline ?? undefined,
    rating: p.rating,
    reviews: p.reviewCount,
    inStock: p.inStock,
    price: toRupees(p.basePrice),
    images: p.images as string[],
    breadcrumbCategory: p.breadcrumbCategory ?? (p.category as string[])[0],
    benefits: (p.benefits as { icon: string; label: string }[] | null) ?? [],
    productDetails: p.productDetails as ProductDetailsJson,
    relatedSlugs: (p.relatedSlugs as string[]).length ? (p.relatedSlugs as string[]) : undefined,
  };

  if (p.pdpType === "HAMPER") {
    // Personalisation is optional on a hamper — only present once the admin
    // has configured at least one text line (see product-service.ts's
    // buildData, which writes customizationSchema: null otherwise).
    const cs = p.customizationSchema as CustomizationSchemaJson | null;
    return {
      ...base,
      pdpType: "hamper",
      whatsInside: (p.whatsInside as { icon: string; name: string; subtitle: string; qty: string }[]) ?? [],
      ...(cs && {
        textLines: cs.textLines,
        fonts: cs.fonts,
        colors: cs.colors,
        imageUpload: cs.imageUpload ?? undefined,
      }),
    };
  }

  if (p.pdpType === "CUSTOMISABLE") {
    const cs = p.customizationSchema as CustomizationSchemaJson;
    return {
      ...base,
      pdpType: "customisable",
      textLines: cs.textLines,
      fonts: cs.fonts,
      colors: cs.colors,
      imageUpload: cs.imageUpload ?? undefined,
      variantLabel: cs.variantLabel ?? undefined,
      variantOptions: cs.variantOptions ?? undefined,
      specs: cs.specs ?? undefined,
    };
  }

  return {
    ...base,
    pdpType: "standalone",
    variants:
      (p.variants as { label: string; options: string[] }[] | null) ?? undefined,
    variantImages: (p.variantImages as Record<string, string[]> | null) ?? undefined,
  };
}

export type RelatedProduct = {
  slug: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  image: string;
};

export function toRelatedProduct(p: Product): RelatedProduct {
  return {
    slug: p.slug,
    name: p.name,
    price: toRupees(p.basePrice),
    rating: p.rating,
    reviews: p.reviewCount,
    inStock: p.inStock,
    image: (p.images as string[])[0],
  };
}

export type CartItemDTO = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customization?: CartItemCustomization;
};

// Denormalizes name/price/image from the live Product row rather than
// trusting anything client-submitted — same principle as order pricing
// (BACKEND_HANDOFF.md's server-computed-pricing rule), just applied to the
// cart too: a cart line always reflects the product's current price.
export function toCartItemDTO(item: PrismaCartItem & { product: Product }): CartItemDTO {
  return {
    id: item.id,
    slug: item.product.slug,
    name: item.product.name,
    price: toRupees(item.product.basePrice),
    image: (item.product.images as string[])[0],
    quantity: item.quantity,
    customization: (item.customization as CartItemCustomization | null) ?? undefined,
  };
}

export type WishlistItemDTO = {
  slug: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
};

export function toWishlistItemDTO(product: Product): WishlistItemDTO {
  return {
    slug: product.slug,
    name: product.name,
    price: toRupees(product.basePrice),
    image: (product.images as string[])[0],
    rating: product.rating,
    reviews: product.reviewCount,
  };
}
