import { trustedByCompanies } from "@/lib/corporate-data";

const monogramTones = [
  "bg-olive text-cream",
  "bg-terracotta text-cream",
  "bg-gold text-cream",
  "bg-charcoal text-cream",
  "bg-olive-light text-cream",
  "bg-terracotta-dark text-cream",
];

export function TrustedByStrip() {
  return (
    <section className="bg-cream-dark py-12 md:py-14">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <p className="text-center eyebrow text-terracotta-dark mb-8">
          Trusted by teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {trustedByCompanies.map((company, i) => (
            <div
              key={company.name}
              className="flex items-center gap-3 rounded-full border border-charcoal/10 bg-white pl-2 pr-5 py-2 shadow-sm transition-shadow hover:shadow-md"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${monogramTones[i % monogramTones.length]}`}
              >
                {company.initials}
              </span>
              <span className="font-serif text-sm text-charcoal whitespace-nowrap">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
