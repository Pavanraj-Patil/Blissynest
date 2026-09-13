import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/ui/ProductCard";
import { db } from "@/lib/db";
import { toListProduct } from "@/lib/product-adapters";
import { getPageContent } from "@/lib/content-service";

export async function LovedByMany() {
  const [rows, content] = await Promise.all([
    db.product.findMany({
      where: { status: "PUBLISHED", corporateOnly: false, featured: true },
      orderBy: { reviewCount: "desc" },
      take: 5,
    }),
    getPageContent("home"),
  ]);
  const products = rows.map(toListProduct);
  const sectionTitle = content["loved-by-many"].sectionTitle as string;
  const eyebrow = content["loved-by-many"].eyebrow as string;

  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-4 md:py-6">
      <SectionHeader
        title={sectionTitle}
        eyebrow={eyebrow}
        linkLabel="View all"
        linkHref="/shop"
        showLinkOnMobile
      />
      <div className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {products.map((p) => (
          <div key={p.id} className="shrink-0 w-[190px]">
            <ProductCard
              name={p.name}
              price={p.price}
              rating={p.rating}
              reviews={p.reviews}
              inStock={p.inStock}
              image={p.image}
              href={`/product/${p.id}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
