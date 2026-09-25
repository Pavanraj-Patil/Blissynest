import { getContentIcon } from "@/lib/content-icons";

export type PolicySection = { icon: string; title: string; body: string };

// Shipping and Returns copy, set as an editorial ledger rather than a stack of
// boxes: the topic on the left, the detail on the right, thin rules between
// them.
export function PolicyRows({ sections }: { sections: PolicySection[] }) {
  return (
    <div className="mx-auto max-w-[1000px] px-4 md:px-8 py-12 md:py-16">
      <ul className="border-b border-charcoal/25">
        {sections.map((s) => {
          const Icon = getContentIcon(s.icon);
          return (
            <li
              key={s.title}
              className="grid gap-3 border-t border-charcoal/25 py-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)] md:gap-12 md:py-10"
            >
              <div className="flex items-center gap-4 md:items-start">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/60 bg-white text-terracotta">
                  {Icon && <Icon size={18} strokeWidth={1.5} />}
                </span>
                <h2 className="font-serif text-xl leading-snug text-charcoal md:pt-1.5 md:text-2xl">{s.title}</h2>
              </div>
              <p className="text-[15px] leading-[1.85] text-charcoal-light md:text-base md:pt-1.5">{s.body}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
