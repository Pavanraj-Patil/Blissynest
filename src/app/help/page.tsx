import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { getPageContent } from "@/lib/content-service";
import { getContentIcon } from "@/lib/content-icons";

export const metadata: Metadata = {
  title: "Help Centre | Blissynest",
  description: "Everything you need — order tracking, shipping, returns, and answers to common questions.",
};

type HelpLink = { icon: string; title: string; body: string; href: string };

export default async function HelpPage() {
  const content = await getPageContent("help");
  const hero = content.hero;
  const helpLinks = hero.links as HelpLink[];

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Help" }]} />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 pb-10 text-center">
          <p className="eyebrow text-terracotta-dark mb-2">{hero.eyebrow as string}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">{hero.heading as string}</h1>
        </div>

        <div className="mx-auto max-w-3xl px-4 md:px-8 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {helpLinks.map((link) => {
              const Icon = getContentIcon(link.icon);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-start gap-4 rounded-2xl border border-charcoal/10 bg-white p-5 hover:border-olive/40 transition-colors"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-dark">
                    {Icon && <Icon size={18} className="text-terracotta" strokeWidth={1.5} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold text-charcoal">{link.title}</h2>
                    <p className="mt-1 text-xs text-ink-muted leading-relaxed">{link.body}</p>
                  </div>
                  <ArrowRight
                    size={15}
                    className="mt-1 shrink-0 text-charcoal/30 group-hover:text-terracotta-dark group-hover:translate-x-0.5 transition-all"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
