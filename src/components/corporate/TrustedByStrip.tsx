const monogramTones = [
  "bg-olive text-cream",
  "bg-terracotta-dark text-cream",
  "bg-gold text-cream",
  "bg-charcoal text-cream",
  "bg-olive-light text-cream",
  "bg-terracotta-dark text-cream",
];

type Company = { name: string; initials: string };

function CompanyPill({ company, index }: { company: Company; index: number }) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-full border border-charcoal/10 bg-white pl-2 pr-5 py-2 shadow-sm transition-shadow hover:shadow-md">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${monogramTones[index % monogramTones.length]}`}
      >
        {company.initials}
      </span>
      <span className="font-serif text-sm text-charcoal whitespace-nowrap">
        {company.name}
      </span>
    </div>
  );
}

export function TrustedByStrip({ content }: { content: Record<string, unknown> }) {
  const eyebrow = content.eyebrow as string;
  const companies = content.companies as Company[];

  return (
    <section className="bg-cream-dark py-12 md:py-14 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <p className="text-center eyebrow text-terracotta-dark mb-8">
          {eyebrow}
        </p>
      </div>
      <div className="relative">
        <div className="marquee-track flex w-max items-center gap-3 md:gap-4">
          {/* Rendered twice so the track can loop seamlessly on a -50%
              scroll — see the .marquee-track keyframes in globals.css. */}
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center gap-3 md:gap-4" aria-hidden={copy === 1}>
              {companies.map((company, i) => (
                <CompanyPill key={`${copy}-${company.name}`} company={company} index={i} />
              ))}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cream-dark to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-cream-dark to-transparent" />
      </div>
    </section>
  );
}
