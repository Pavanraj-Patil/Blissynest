import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopFooter } from "@/components/shop/ShopFooter";
import type { BusinessDetails } from "@/lib/content-service";

export type LegalBlock = { type: "p"; text: string } | { type: "ul"; items: string[] };
export type LegalSection = { heading: string; blocks: LegalBlock[] };

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
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: title }]} />
        </div>

        <div className="mx-auto max-w-3xl px-4 md:px-8 pt-6 pb-16">
          <p className="eyebrow mb-2 text-terracotta-dark">Legal</p>
          <h1 className="font-serif text-3xl text-charcoal md:text-4xl">{title}</h1>
          {business.policiesUpdated && (
            <p className="mt-2 text-xs text-ink-muted">Last updated: {business.policiesUpdated}</p>
          )}
          <p className="mt-5 text-sm leading-relaxed text-charcoal-light md:text-base">{intro}</p>

          <div className="mt-8 space-y-8">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-xl text-charcoal">{section.heading}</h2>
                <div className="mt-2 space-y-3 text-sm leading-relaxed text-charcoal-light md:text-[15px]">
                  {section.blocks.map((block, i) =>
                    block.type === "p" ? (
                      <p key={i}>{block.text}</p>
                    ) : (
                      <ul key={i} className="list-disc space-y-1.5 pl-5">
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

          <div className="mt-10 rounded-2xl border border-charcoal/10 bg-white p-5 sm:p-6">
            <h2 className="font-serif text-lg text-charcoal">Contact us</h2>
            <dl className="mt-3 space-y-1.5 text-sm">
              {contactLines.map((l) => (
                <div key={l.label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                  <dt className="w-40 shrink-0 text-ink-muted">{l.label}</dt>
                  <dd className="text-charcoal">{l.value}</dd>
                </div>
              ))}
            </dl>
            {grievanceLines.length > 0 && (
              <>
                <h3 className="mt-5 text-sm font-semibold text-charcoal">Grievance Officer</h3>
                <dl className="mt-2 space-y-1.5 text-sm">
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
      </main>
      <ShopFooter />
    </>
  );
}
