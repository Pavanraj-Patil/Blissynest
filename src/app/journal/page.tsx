import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopFooter } from "@/components/shop/ShopFooter";

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
    readTime: "5 min read",
  },
  {
    tag: "Occasions",
    title: "How to Write a Gift Note People Actually Keep",
    excerpt:
      "The difference between 'Happy Birthday!' and a note someone tapes to their mirror.",
    readTime: "4 min read",
  },
  {
    tag: "Behind the Scenes",
    title: "Inside Our Packaging: Why We Never Use Plastic Confetti",
    excerpt:
      "A look at how every Blissynest box gets wrapped, and the small decisions behind it.",
    readTime: "6 min read",
  },
  {
    tag: "Gift Guides",
    title: "The Anniversary Gift Ladder: Year 1 Through Year 10",
    excerpt: "A no-stress guide to what to get, and when, as the years add up.",
    readTime: "7 min read",
  },
  {
    tag: "Occasions",
    title: "Corporate Gifting Without the Corporate Feel",
    excerpt:
      "How to send something your team or clients will actually want to open.",
    readTime: "5 min read",
  },
  {
    tag: "Gift Guides",
    title: "Festival Season Gifting, Sorted Early",
    excerpt:
      "A planning-ahead guide so you're not scrambling the week before Diwali.",
    readTime: "4 min read",
  },
];

export default function JournalPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "The Bliss Journal" }]} />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 pb-10 text-center">
          <p className="eyebrow text-terracotta-dark mb-2">The Bliss Journal</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
            Gifting guides &amp; a little inspiration
          </h1>
          <p className="mt-3 text-sm text-ink-muted max-w-xl mx-auto">
            Stories, guides, and ideas for whatever you&rsquo;re celebrating next.
          </p>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article
                key={post.title}
                className="rounded-2xl border border-charcoal/10 bg-white p-6"
              >
                <span className="eyebrow text-[10px] text-terracotta-dark">{post.tag}</span>
                <h2 className="mt-2.5 font-serif text-lg text-charcoal leading-snug">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{post.excerpt}</p>
                <p className="mt-4 text-xs text-charcoal-light">{post.readTime}</p>
              </article>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-ink-muted">
            More stories are on their way — check back soon.
          </p>
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
