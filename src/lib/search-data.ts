import { allShopProducts } from "@/lib/shop-mock-data";
import { collectionContent, collectionSlugs } from "@/lib/collection-mock-data";
import { bestsellers } from "@/lib/mock-data";
import { slugify } from "@/lib/slugify";

export type SearchableProduct = {
  slug: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
};

const fromShop: SearchableProduct[] = allShopProducts.map((p) => ({
  slug: p.id,
  name: p.name,
  price: p.price,
  image: p.image,
  rating: p.rating,
  reviews: p.reviews,
}));

const fromCollections: SearchableProduct[] = collectionSlugs.flatMap((slug) =>
  collectionContent[slug].products.map((p) => ({
    slug: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    rating: p.rating,
    reviews: p.reviews,
  }))
);

const fromBestsellers: SearchableProduct[] = bestsellers.map((p) => ({
  slug: slugify(p.name),
  name: p.name,
  price: p.price,
  image: p.image,
  rating: p.rating,
  reviews: p.reviews,
}));

const seen = new Set<string>();
export const searchIndex: SearchableProduct[] = [
  ...fromBestsellers,
  ...fromCollections,
  ...fromShop,
].filter((p) => {
  if (seen.has(p.slug)) return false;
  seen.add(p.slug);
  return true;
});

export function searchProducts(query: string, limit?: number): SearchableProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const matches = searchIndex.filter((p) => p.name.toLowerCase().includes(q));
  return typeof limit === "number" ? matches.slice(0, limit) : matches;
}
