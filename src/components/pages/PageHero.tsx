import Image from "next/image";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { cn } from "@/lib/cn";

type Crumb = { label: string; href?: string };

// The masthead shared by every info page (About, Shipping, FAQs, …): the page
// name set large in the serif, a short intro, and, where a page has a photo,
// an arch-cropped picture, like a doorway or a gift-tag window. Without a
// photo it falls back to a ribbon flourish, so text-only pages still read as
// part of the same family.
export function PageHero({
  crumbs,
  eyebrow,
  title,
  intro,
  image,
  imageAlt = "",
  tone = "cream",
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  intro?: string;
  image?: string;
  imageAlt?: string;
  tone?: "cream" | "olive";
  children?: React.ReactNode;
}) {
  const dark = tone === "olive";
  return (
    <section className={cn("relative overflow-hidden", dark ? "bg-olive-dark text-cream" : "bg-cream-dark")}>
      <div className="mx-auto max-w-[1200px] px-4 md:px-8 pt-5">
        <div className={dark ? "[&_*]:!text-cream/70 [&_span:last-child_span]:!text-cream" : ""}>
          <Breadcrumb items={crumbs} />
        </div>
      </div>

      <div
        className={cn(
          "mx-auto grid max-w-[1200px] items-center gap-8 px-4 md:px-8 pb-12 pt-8 md:pb-16 md:pt-10",
          image ? "md:grid-cols-[1.15fr_0.85fr] md:gap-14" : "md:grid-cols-[1.4fr_0.6fr]"
        )}
      >
        <div>
          {eyebrow && (
            <p
              className={cn(
                "eyebrow mb-4 flex items-center gap-3",
                dark ? "text-gold-light" : "text-terracotta-dark"
              )}
            >
              <span aria-hidden className={cn("h-px w-8", dark ? "bg-gold-light" : "bg-terracotta-dark/60")} />
              {eyebrow}
            </p>
          )}
          <h1 className="font-serif text-[2.5rem] leading-[1.06] text-balance sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {intro && (
            <p
              className={cn(
                "mt-5 max-w-lg text-[15px] leading-relaxed md:text-base",
                dark ? "text-cream/80" : "text-charcoal-light"
              )}
            >
              {intro}
            </p>
          )}
          {children && <div className="mt-7">{children}</div>}
        </div>

        {image ? (
          <div className="relative mx-auto w-full max-w-[300px] md:max-w-none md:justify-self-end md:w-[min(100%,340px)]">
            {/* A thin gold arch sits offset behind the photo. */}
            <div
              aria-hidden
              className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-[999px] rounded-b-[1.75rem] border border-gold/70"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[1.75rem] bg-cream-darker">
              <Image src={image} alt={imageAlt} fill priority sizes="(min-width: 768px) 340px, 300px" className="object-cover" />
            </div>
          </div>
        ) : (
          <Flourish dark={dark} />
        )}
      </div>
    </section>
  );
}

// A loose ribbon curl, drawn once and tinted per tone.
function Flourish({ dark }: { dark: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 220 160"
      fill="none"
      className={cn("hidden h-40 w-full max-w-[220px] justify-self-end md:block", dark ? "text-gold-light" : "text-gold")}
    >
      <path
        d="M8 128c40-8 46-70 86-70 34 0 24 46 2 46-26 0-22-70 36-76 44-5 68 26 80 54"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M150 34c14-14 34-16 46-6-10 14-30 20-46 6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M150 34c-12-16-32-16-42-4 10 14 28 18 42 4Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
