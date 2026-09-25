import type { Metadata } from "next";
import Image from "next/image";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { PageHero } from "@/components/pages/PageHero";

export const metadata: Metadata = {
  title: "The Bliss Journal | Blissynest",
  description:
    "Gifting guides, occasion inspiration, and behind-the-scenes stories from Blissynest.",
};

const posts = [
  {
    tag: "Gift Guides",
    title: "12 Housewarming Gifts That Aren't Another Candle",
    excerpt:
      "Candles are lovely, but here's what to get when you want the new place to actually feel like home.",
    image: "/edit-minimalist.png",
  },
  {
    tag: "Occasions",
    title: "How to Write a Gift Note People Actually Keep",
    excerpt:
      "The difference between 'Happy Birthday!' and a note someone tapes to their mirror.",
    image: "/moment-thankyou.png",
  },
  {
    tag: "Behind the Scenes",
    title: "Inside Our Packaging: Why We Never Use Plastic Confetti",
    excerpt:
      "A look at how every Blissynest box gets wrapped, and the small decisions behind it.",
    image: "/edit-luxury.png",
  },
  {
    tag: "Gift Guides",
    title: "The Anniversary Gift Ladder: Year 1 Through Year 10",
    excerpt: "A no-stress guide to what to get, and when, as the years add up.",
    image: "/moment-anniversary.png",
  },
  {
    tag: "Occasions",
    title: "Corporate Gifting Without the Corporate Feel",
    excerpt:
      "How to send something your team or clients will actually want to open.",
    image: "/corporate-hero.png",
  },
  {
    tag: "Gift Guides",
    title: "Festival Season Gifting, Sorted Early",
    excerpt:
      "A planning-ahead guide so you're not scrambling the week before Diwali.",
    image: "/moment-festivals.png",
  },
];

// The stories aren't published yet, so say so rather than dangling a link
// (or a read time) for an article that doesn't exist.
function SoonTag() {
  return (
    <span className="inline-flex items-center rounded-full bg-cream/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-olive-dark backdrop-blur">
      Coming soon
    </span>
  );
}

export default function JournalPage() {
  const [featured, ...rest] = posts;

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "The Bliss Journal" }]}
          eyebrow="The Bliss Journal"
          title="Gifting guides & a little inspiration"
          intro="Stories, guides, and ideas for whatever you're celebrating next."
        />

        <div className="mx-auto max-w-[1200px] px-4 md:px-8 pt-12 pb-16 md:pt-16 md:pb-20">
          {/* The lead story */}
          <article className="grid overflow-hidden rounded-[2rem] bg-olive-dark text-cream md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[380px]">
              <Image
                src={featured.image}
                alt=""
                fill
                sizes="(min-width: 768px) 600px, 100vw"
                className="object-cover"
              />
              <div className="absolute left-4 top-4">
                <SoonTag />
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4 p-7 sm:p-10 md:p-12">
              <p className="eyebrow flex items-center gap-3 text-gold-light">
                <span aria-hidden className="h-px w-8 bg-gold-light" />
                {featured.tag}
              </p>
              <h2 className="font-serif text-2xl leading-snug text-balance md:text-4xl">{featured.title}</h2>
              <p className="text-sm leading-relaxed text-cream/80 md:text-base">{featured.excerpt}</p>
            </div>
          </article>

          {/* The rest */}
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-6">
            {rest.map((post, i) => (
              <article key={post.title} className={i < 3 ? "lg:col-span-2" : "lg:col-span-3"}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-[999px] rounded-b-2xl bg-cream-darker">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                    <SoonTag />
                  </div>
                </div>
                <p className="eyebrow mt-5 text-[11px] text-terracotta-dark">{post.tag}</p>
                <h2 className="mt-2 font-serif text-xl leading-snug text-charcoal">{post.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
              </article>
            ))}
          </div>
        </div>

      </main>
      <ShopFooter />
    </>
  );
}
