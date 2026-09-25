import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { PageHero } from "@/components/pages/PageHero";
import { readMinutes } from "@/lib/journal-posts";
import { getPublishedPosts } from "@/lib/journal-service";
import { getPageContent } from "@/lib/content-service";

export const metadata: Metadata = {
  title: "The Bliss Journal | Blissynest",
  description:
    "Gifting guides, occasion inspiration, and practical ideas from Blissynest.",
};

export default async function JournalPage() {
  const [posts, content] = await Promise.all([getPublishedPosts(), getPageContent("journal")]);
  const hero = content.hero;
  const [featured, ...rest] = posts;

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "The Bliss Journal" }]}
          eyebrow={hero.eyebrow as string}
          title={hero.heading as string}
          intro={hero.intro as string}
        />

        <div className="mx-auto max-w-[1200px] px-4 md:px-8 pt-12 pb-16 md:pt-16 md:pb-20">
          {!featured && (
            <p className="rounded-2xl bg-cream-dark px-6 py-12 text-center text-sm text-charcoal-light">
              New stories are on their way. Please check back soon.
            </p>
          )}

          {/* The lead story */}
          {featured && (
          <Link
            href={`/journal/${featured.slug}`}
            className="group grid overflow-hidden rounded-[2rem] bg-olive-dark text-cream md:grid-cols-2"
          >
            <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[380px]">
              <Image
                src={featured.image}
                alt={featured.imageAlt}
                fill
                sizes="(min-width: 768px) 600px, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center gap-4 p-7 sm:p-10 md:p-12">
              <p className="eyebrow flex items-center gap-3 text-gold-light">
                <span aria-hidden className="h-px w-8 bg-gold-light" />
                {featured.tag}
              </p>
              <h2 className="font-serif text-2xl leading-snug text-balance md:text-4xl">{featured.title}</h2>
              <p className="text-sm leading-relaxed text-cream/80 md:text-base">{featured.excerpt}</p>
              <span className="mt-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
                Read the guide, {readMinutes(featured)} min
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
          )}

          {/* The rest */}
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-6">
            {rest.map((post, i) => (
              <Link
                key={post.slug}
                href={`/journal/${post.slug}`}
                className={`group block ${i < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-[999px] rounded-b-2xl bg-cream-darker">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="eyebrow mt-5 text-[11px] text-terracotta-dark">{post.tag}</p>
                <h2 className="mt-2 font-serif text-xl leading-snug text-charcoal transition-colors group-hover:text-terracotta-dark">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
                <p className="mt-3 text-xs text-charcoal-light">{readMinutes(post)} min read</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
