// The three full-detail PDP products from src/lib/product-mock-data.ts —
// split into its own file purely so seed.ts doesn't grow enormous; imported
// and appended to the main product list there.
import { flagshipProducts as source } from "../src/lib/product-mock-data";

// Duplicated from seed.ts rather than imported, to avoid a circular import
// (seed.ts imports flagshipProducts from this file).
function stockFor(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) % 1000;
  return 5 + (hash % 145);
}

function toRow(p: (typeof source)[number]) {
  const base = {
    slug: p.slug,
    name: p.name,
    tagline: p.tagline ?? null,
    audience: [],
    category: [
      p.breadcrumbCategory
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    ],
    breadcrumbCategory: p.breadcrumbCategory,
    occasionTags: [],
    recipientTags: [],
    basePrice: p.price * 100,
    images: p.images,
    rating: 0,
    reviewCount: 0,
    stockQuantity: stockFor(p.slug),
    benefits: p.benefits,
    productDetails: p.productDetails,
    relatedSlugs: p.relatedSlugs ?? [],
    featured: true,
    corporateNeeds: [],
  };

  switch (p.pdpType) {
    case "hamper":
      return {
        ...base,
        pdpType: "HAMPER" as const,
        whatsInside: p.whatsInside,
        personalNoteLabel: null,
        personalNotePrice: null,
      };
    case "customisable":
      return {
        ...base,
        pdpType: "CUSTOMISABLE" as const,
        customizationSchema: {
          textLines: p.textLines,
          fonts: p.fonts,
          colors: p.colors,
          variantLabel: p.variantLabel ?? null,
          variantOptions: p.variantOptions ?? null,
          specs: p.specs ?? null,
        },
      };
    case "standalone":
      return {
        ...base,
        pdpType: "STANDALONE" as const,
        ...(p.variants ? { variants: p.variants } : {}),
      };
  }
}

export const flagshipProducts = source.map(toRow);
