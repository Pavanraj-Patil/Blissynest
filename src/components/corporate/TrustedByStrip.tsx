import { trustedByCompanies } from "@/lib/corporate-data";

export function TrustedByStrip() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-10">
      <p className="text-center eyebrow text-terracotta-dark mb-7">
        Trusted by teams at
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {trustedByCompanies.map((name) => (
          <span
            key={name}
            className="font-serif text-lg md:text-xl text-charcoal-light"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
