import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/ui/ProductCard";
import { bestsellers } from "@/lib/mock-data";

export function LovedByMany() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-8 md:py-12">
      <SectionHeader title="Loved by many" eyebrow="Bestsellers" linkLabel="View all" />
      <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {bestsellers.map((p) => (
          <ProductCard
            key={p.name}
            name={p.name}
            price={p.price}
            rating={p.rating}
            reviews={p.reviews}
            image={p.image}
          />
        ))}
      </div>
    </section>
  );
}
