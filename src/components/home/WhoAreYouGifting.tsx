import { SectionHeader } from "@/components/ui/SectionHeader";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { audienceCategories } from "@/lib/mock-data";

export function WhoAreYouGifting() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-6 md:py-8">
      <SectionHeader title="Who are you making smile?" />
      <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {audienceCategories.map((cat) => (
          <CategoryCard
            key={cat.label}
            label={cat.label}
            image={cat.image}
            href={cat.href}
          />
        ))}
      </div>
    </section>
  );
}
