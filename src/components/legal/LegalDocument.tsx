import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { PageHero } from "@/components/pages/PageHero";
import { ShopFooter } from "@/components/shop/ShopFooter";
import type { BusinessDetails } from "@/lib/content-service";

export type LegalBlock = { type: "p"; text: string } | { type: "ul"; items: string[] };
export type LegalSection = { heading: string; blocks: LegalBlock[] };

const anchor = (heading: string) =>
  heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Shared layout for the Privacy Policy and Terms pages: heading, "last
// updated" line, readable long-form sections, and a contact panel built from
// the business details in Site Content (blank fields are simply skipped).
export function LegalDocument({
  title,
  intro,
  sections,
  business,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
  business: BusinessDetails;
}) {
  const contactLines = [
    business.legalName && { label: "Business name", value: business.legalName },
    business.address && { label: "Registered address", value: business.address },
    business.gstin && { label: "GSTIN", value: business.gstin },
    business.contactEmail && { label: "Email", value: business.contactEmail },
    business.contactPhone && { label: "Phone", value: business.contactPhone },
  ].filter(Boolean) as { label: string; value: string }[];

  const grievanceLines = [
    business.grievanceName && { label: "Name", value: business.grievanceName },
    business.grievanceEmail && { label: "Email", value: business.grievanceEmail },
    business.grievancePhone && { label: "Phone", value: business.grievancePhone },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: title }]}
          eyebrow="Legal"
          title={title}
          intro={business.policiesUpdated ? `Last updated: ${business.policiesUpdated}` : undefined}
        />

        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 md:px-8 py-12 md:py-16 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-28">
              <p className="eyebrow mb-3 text-ink-muted">On this page</p>
              <ul className="space-y-2.5 border-l border-charcoal/25 pl-4">
                {sections.map((section) => (
                  <li key={section.heading}>
                    <a
                      href={`#${anchor(section.heading)}`}
                      className="text-sm leading-snug text-charcoal-light transition-colors hover:text-terracotta-dark"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="max-w-3xl">
            <p className="font-serif text-xl leading-relaxed text-charcoal md:text-2xl">{intro}</p>

            <div className="mt-10 space-y-10">
              {sections.map((section) => (
                <section key={section.heading} id={anchor(section.heading)} className="scroll-mt-28">
                  <h2 className="border-t border-charcoal/25 pt-6 font-serif text-2xl text-charcoal">
                    {section.heading}
                  </h2>
                  <div className="mt-3 space-y-3 text-sm leading-[1.85] text-charcoal-light md:text-[15px]">
                    {section.blocks.map((block, i) =>
                      block.type === "p" ? (
                        <p key={i}>{block.text}</p>
                      ) : (
                        <ul key={i} className="list-disc space-y-1.5 pl-5 marker:text-terracotta">
                          {block.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )
                    )}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-14 rounded-[2rem] bg-cream-dark p-6 sm:p-8">
              <h2 className="font-serif text-2xl text-charcoal">Contact us</h2>
              <dl className="mt-4 space-y-2 text-sm">
                {contactLines.map((l) => (
                  <div key={l.label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                    <dt className="w-40 shrink-0 text-ink-muted">{l.label}</dt>
                    <dd className="text-charcoal">{l.value}</dd>
                  </div>
                ))}
              </dl>
              {grievanceLines.length > 0 && (
                <>
                  <h3 className="mt-6 border-t border-charcoal/25 pt-5 text-sm font-semibold text-charcoal">
                    Grievance Officer
                  </h3>
                  <dl className="mt-3 space-y-2 text-sm">
                    {grievanceLines.map((l) => (
                      <div key={l.label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                        <dt className="w-40 shrink-0 text-ink-muted">{l.label}</dt>
                        <dd className="text-charcoal">{l.value}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
