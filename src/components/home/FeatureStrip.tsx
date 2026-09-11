import { getPageContent } from "@/lib/content-service";
import { getContentIcon } from "@/lib/content-icons";

type FeatureItem = { icon: string; title: string; subtitle: string };

export async function FeatureStrip() {
  const content = await getPageContent("home");
  const items = content["feature-strip"].items as FeatureItem[];

  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-3 md:py-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 border-t border-b border-charcoal/10 py-8">
        {items.map((f) => {
          const Icon = getContentIcon(f.icon);
          return (
            <div key={f.title} className="flex items-start gap-3">
              {Icon && <Icon size={24} strokeWidth={1.5} className="text-terracotta shrink-0" />}
              <div>
                <h3 className="text-sm font-semibold text-charcoal">
                  {f.title}
                </h3>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  {f.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
