import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { getPageContent } from "@/lib/content-service";
import { getContentIcon } from "@/lib/content-icons";

export const metadata: Metadata = {
  title: "Returns | Blissynest",
  description: "Our returns, refunds, and exchange policy for Blissynest orders.",
};

type PolicySection = { icon: string; title: string; body: string };

export default async function ReturnsPage() {
  const content = await getPageContent("returns");
  const hero = content.hero;
  const sections = hero.sections as PolicySection[];

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Returns" }]} />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 pb-10 text-center">
          <p className="eyebrow text-terracotta-dark mb-2">{hero.eyebrow as string}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">{hero.heading as string}</h1>
        </div>

        <div className="mx-auto max-w-3xl px-4 md:px-8 pb-16">
          <div className="space-y-5">
            {sections.map((s) => {
              const Icon = getContentIcon(s.icon);
              return (
                <div
                  key={s.title}
                  className="flex gap-4 rounded-2xl border border-charcoal/10 bg-white p-5 sm:p-6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-dark">
                    <Icon size={20} className="text-terracotta" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg text-charcoal">{s.title}</h2>
                    <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{s.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
