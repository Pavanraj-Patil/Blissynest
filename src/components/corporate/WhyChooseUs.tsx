import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { TestimonialCarousel } from "./TestimonialCarousel";

type ChecklistItem = { text: string };
type Testimonial = { quote: string; name: string; title: string; company: string };

export function WhyChooseUs({
  content,
  testimonials,
}: {
  content: Record<string, unknown>;
  testimonials: Record<string, unknown>;
}) {
  const heading = content.heading as string;
  const checklist = content.checklist as ChecklistItem[];
  const image = content.image as string;
  const items = testimonials.items as Testimonial[];

  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-10 md:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        <div className="rounded-3xl bg-olive-dark text-cream px-6 py-10 md:px-10 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-[1.1fr_1fr] gap-8 items-center">
            <div>
              <h2 className="font-serif text-2xl md:text-[1.75rem] leading-tight">
                {heading}
              </h2>
              <ul className="mt-7 space-y-4">
                {checklist.map((item) => (
                  <li key={item.text} className="flex items-start gap-2.5 text-sm text-cream/85">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-gold-light" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative aspect-square w-full max-w-xs mx-auto overflow-hidden rounded-2xl">
              <Image
                src={image}
                alt="A gift box branded with a company logo"
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
          </div>
        </div>

        <TestimonialCarousel testimonials={items} />
      </div>
    </section>
  );
}
