import { processSteps } from "@/lib/corporate-data";

const cardBg = ["bg-cream-dark", "bg-terracotta-light/25", "bg-olive/10", "bg-gold-light/25"];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-10 md:py-14">
      <div className="text-center mb-10">
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal">
          How does it work?
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Book your corporate gifts in 4 simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {processSteps.map((step, i) => (
          <div key={step.number} className={`rounded-2xl ${cardBg[i]} p-6`}>
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-terracotta">
                <step.icon size={20} strokeWidth={1.5} />
              </span>
              <span className="font-serif text-3xl text-charcoal/15">
                {step.number}
              </span>
            </div>
            <h3 className="mt-5 font-semibold text-charcoal">{step.title}</h3>
            <p className="mt-2 text-sm text-ink-muted leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
