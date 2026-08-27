import { ProductCard } from "@/components/ui/ProductCard";

type RelatedProduct = {
  slug: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  image: string;
};

export function RelatedProducts({ products }: { products: RelatedProduct[] }) {
  if (products.length === 0) return null;

  return (
    <div>
      <h2 className="font-serif text-2xl text-charcoal mb-6">You may also like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard
            key={p.slug}
            name={p.name}
            price={p.price}
            rating={p.rating}
            reviews={p.reviews}
            inStock={p.inStock}
            image={p.image}
            href={`/product/${p.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
