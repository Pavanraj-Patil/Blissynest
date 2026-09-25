import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { PageHero } from "@/components/pages/PageHero";
import { PageCta } from "@/components/pages/PageCta";
import { getPageContent } from "@/lib/content-service";
import { getContentIcon } from "@/lib/content-icons";

export const metadata: Metadata = {
  title: "Help Centre | Blissynest",
  description: "Everything you need: order tracking, shipping, returns, and answers to common questions.",
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
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Help" }]}
          eyebrow={hero.eyebrow as string}
          title={hero.heading as string}
          intro="Pick where you'd like to start, most answers are a click away."
        />

        <div className="mx-auto max-w-[1000px] px-4 md:px-8 py-12 md:py-16">
          <ul className="border-b border-charcoal/25">
            {helpLinks.map((link) => {
              const Icon = getContentIcon(link.icon);
              return (
                <li key={link.href} className="border-t border-charcoal/25">
                  <Link href={link.href} className="group flex items-center gap-5 py-6 md:gap-7 md:py-7">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/60 bg-white text-terracotta transition-colors group-hover:bg-terracotta group-hover:text-cream">
                      {Icon && <Icon size={20} strokeWidth={1.5} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-xl text-charcoal transition-colors group-hover:text-terracotta-dark md:text-2xl">
                        {link.title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-ink-muted">{link.body}</span>
                    </span>
                    <ArrowUpRight
                      size={20}
                      className="shrink-0 text-charcoal/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-terracotta-dark"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <PageCta
          title="Still need a hand?"
          body="Write to us and a real person will get back to you, usually within a day."
          primary={{ label: "Contact us", href: "/contact" }}
        />
      </main>
      <ShopFooter />
    </>
  );
}
