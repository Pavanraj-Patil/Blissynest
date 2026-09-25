import type { Metadata } from "next";
import Image from "next/image";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { PageHero } from "@/components/pages/PageHero";
import { PageCta } from "@/components/pages/PageCta";
import { getPageContent } from "@/lib/content-service";

export const metadata: Metadata = {
  title: "About Us | Blissynest",
  description:
    "Blissynest is a gifting studio for the people who make life beautiful, with thoughtfully curated gifts for every feeling worth celebrating.",
};

const beliefs = [
  {
    title: "Chosen, not just collected",
    body: "Every product has to earn its place on the shelf. If we wouldn't give it to someone we love, it doesn't make the cut.",
  },
  {
    title: "The box is part of the gift",
    body: "Ribbon, paper, a handwritten-feeling note. The unwrapping is half of the moment, so we design it that way.",
  },
  {
    title: "Delivered like it matters",
    body: "Your gift travels a long way to make someone smile. We pack it to arrive looking exactly as it left us.",
  },
  {
    title: "Made right, always",
    body: "If something isn't perfect, tell us. We'd much rather fix it quickly than have you wonder.",
  },
];

export default async function AboutPage() {
  const content = await getPageContent("about");
  const hero = content.hero;
  const paragraph1 = hero.paragraph1 as string;

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <PageHero
          tone="olive"
          crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
          eyebrow={hero.eyebrow as string}
          title={hero.heading as string}
          intro="A gifting studio for the people who make life beautiful."
          image="/moment-thankyou.png"
          imageAlt="A thank-you card, a kraft-wrapped gift and a small succulent on an olive backdrop"
        />

        {/* The story */}
        <section className="mx-auto grid max-w-[1200px] gap-10 px-4 md:px-8 py-14 md:grid-cols-[0.6fr_1.4fr] md:gap-16 md:py-24">
          <div>
            <p className="eyebrow flex items-center gap-3 text-terracotta-dark">
              <span aria-hidden className="h-px w-8 bg-terracotta-dark/60" />
              How it began
            </p>
            <p className="mt-6 font-serif text-2xl italic leading-snug text-olive-dark md:sticky md:top-28 md:text-[1.75rem]">
              &ldquo;Gifting should feel like the moment it&rsquo;s marking.&rdquo;
            </p>
          </div>
          <div className="space-y-6 text-[15px] leading-[1.9] text-charcoal-light md:text-[17px]">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.85] first-letter:text-terracotta">
              {paragraph1}
            </p>
            <p>{hero.paragraph2 as string}</p>
          </div>
        </section>

        {/* A quiet strip of the studio's world */}
        <section aria-hidden className="mx-auto grid max-w-[1200px] grid-cols-3 gap-3 px-4 md:gap-6 md:px-8">
          {[
            { src: "/edit-luxury.png", cls: "rounded-t-[999px] rounded-b-2xl" },
            { src: "/moment-birthday.png", cls: "rounded-2xl md:mt-10" },
            { src: "/edit-hampers.png", cls: "rounded-t-[999px] rounded-b-2xl" },
          ].map((img) => (
            <div key={img.src} className={`relative aspect-[3/4] overflow-hidden bg-cream-darker ${img.cls}`}>
              <Image src={img.src} alt="" fill sizes="(min-width: 1200px) 380px, 33vw" className="object-cover" />
            </div>
          ))}
        </section>

        {/* What we hold on to */}
        <section className="mx-auto max-w-[1200px] px-4 md:px-8 py-16 md:py-24">
          <div className="max-w-xl">
            <p className="eyebrow flex items-center gap-3 text-terracotta-dark">
              <span aria-hidden className="h-px w-8 bg-terracotta-dark/60" />
              What we hold on to
            </p>
            <h2 className="mt-4 font-serif text-3xl text-balance text-charcoal md:text-4xl">
              Four small promises behind every box.
            </h2>
          </div>
          <dl className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {beliefs.map((b) => (
              <div key={b.title} className="border-t border-charcoal/25 pt-5">
                <dt className="font-serif text-xl text-charcoal">{b.title}</dt>
                <dd className="mt-2 max-w-md text-sm leading-relaxed text-charcoal-light md:text-[15px]">{b.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <PageCta
          title="Let's find the right gift."
          body="Tell us who it's for and what you're celebrating and we'll point you to something they'll keep."
          primary={{ label: "Start gifting", href: "/shop" }}
          secondary={{ label: "Gifting for a team", href: "/corporate" }}
        />
      </main>
      <ShopFooter />
    </>
  );
}
