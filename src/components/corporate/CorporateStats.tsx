import { stats } from "@/lib/corporate-data";

export function CorporateStats() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 pb-10 md:pb-14">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-charcoal/10 rounded-3xl border border-charcoal/10 bg-white overflow-hidden">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center gap-2 px-6 py-8 text-center"
          >
            <stat.icon size={22} strokeWidth={1.5} className="text-terracotta" />
            <p className="font-serif text-2xl md:text-3xl text-charcoal">
              {stat.value}
            </p>
            <p className="text-xs text-ink-muted uppercase tracking-wide">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
