import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { PageHero } from "@/components/pages/PageHero";
import { PageCta } from "@/components/pages/PageCta";
import { getSiteUrl } from "@/lib/site-url";
import { formatPublished, readMinutes, type JournalBlock } from "@/lib/journal-posts";
import { getPublishedPost, getPublishedPosts } from "@/lib/journal-service";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "The Bliss Journal | Blissynest" };
  return {
    title: `${post.title} | The Bliss Journal`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article", images: [post.image] },
  };
}

function Block({ block }: { block: JournalBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="mt-12 font-serif text-2xl text-charcoal md:text-3xl">{block.text}</h2>;
    case "ul":
      return (
        <ul className="mt-5 list-disc space-y-3 pl-5 marker:text-terracotta">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mt-5 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-terracotta">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote className="my-10 border-y border-charcoal/15 py-8 text-center font-serif text-2xl italic leading-snug text-olive-dark md:text-3xl">
          {block.text}
        </blockquote>
      );
    default:
      return <p className="mt-5">{block.text}</p>;
  }
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const minutes = readMinutes(post);
  const more = (await getPublishedPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published,
    image: `${getSiteUrl()}${post.image}`,
    publisher: { "@type": "Organization", name: "Blissynest" },
  };

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <PageHero
          crumbs={[
            { label: "Home", href: "/" },
            { label: "The Bliss Journal", href: "/journal" },
            { label: post.tag },
          ]}
          eyebrow={post.tag}
          title={post.title}
          intro={post.excerpt}
          image={post.image}
          imageAlt={post.imageAlt}
        >
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
            {formatPublished(post.published)}
            <span aria-hidden className="mx-3 inline-block h-1 w-1 rounded-full bg-gold align-middle" />
            {minutes} min read
          </p>
        </PageHero>

        <article className="mx-auto max-w-[680px] px-4 md:px-8 pb-12 pt-12 text-[16px] leading-[1.9] text-charcoal-light md:pt-16 md:text-[17px]">
          {post.body.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </article>

        {post.cta.title && post.cta.label && post.cta.href && (
          <PageCta title={post.cta.title} body={post.cta.body} primary={{ label: post.cta.label, href: post.cta.href }} />
        )}

        {more.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-4 md:px-8 pb-16 md:pb-20">
          <h2 className="font-serif text-2xl text-charcoal md:text-3xl">More from the Journal</h2>
          <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <Link key={p.slug} href={`/journal/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-[999px] rounded-b-2xl bg-cream-darker">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="eyebrow mt-5 text-[11px] text-terracotta-dark">{p.tag}</p>
                <h3 className="mt-2 font-serif text-xl leading-snug text-charcoal transition-colors group-hover:text-terracotta-dark">
                  {p.title}
                </h3>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-olive-dark">
                  Read <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
        )}
      </main>
      <ShopFooter />
    </>
  );
}
