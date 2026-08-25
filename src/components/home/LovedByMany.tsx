import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/ui/ProductCard";
import { db } from "@/lib/db";
import { toListProduct } from "@/lib/product-adapters";

export async function LovedByMany() {
  const rows = await db.product.findMany({
    where: { status: "PUBLISHED", featured: true },
    orderBy: { reviewCount: "desc" },
    take: 5,
  });
  const products = rows.map(toListProduct);

  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-4 md:py-6">
      <SectionHeader title="Loved by many" eyebrow="Bestsellers" linkLabel="View all" linkHref="/shop" />
      <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {products.map((p) => (
          <div key={p.id} className="shrink-0 w-[190px] sm:w-auto">
            <ProductCard
              name={p.name}
              price={p.price}
              rating={p.rating}
              reviews={p.reviews}
              image={p.image}
              href={`/product/${p.id}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
