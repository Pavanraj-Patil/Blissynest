import Link from "next/link";
import { requireAdmin } from "@/lib/admin/require-admin";
import { contentSchema } from "@/lib/content-schema";
import { getPageContent } from "@/lib/content-service";
import { ContentSectionForm } from "./ContentSectionForm";

const pageLabels: Record<string, string> = {
  home: "Homepage",
  about: "About",
  shipping: "Shipping",
  returns: "Returns",
  help: "Help",
  contact: "Contact",
  "track-order": "Track Order",
  layout: "Site-Wide (Header / Footer)",
};

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; section?: string }>;
}) {
  await requireAdmin();
  const { page: pageParam, section: sectionParam } = await searchParams;

  const pages = Object.keys(contentSchema);
  const activePage = pageParam && contentSchema[pageParam] ? pageParam : pages[0];
  const sections = Object.entries(contentSchema[activePage] ?? {});
  const activeSection =
    sectionParam && contentSchema[activePage]?.[sectionParam] ? sectionParam : sections[0]?.[0];

  const pageContent = await getPageContent(activePage);
  const schema = activeSection ? contentSchema[activePage][activeSection] : undefined;

  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Site Content</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Marketing copy, images, and links across the homepage and static pages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">
        <div className="rounded-2xl border border-charcoal/10 bg-white p-3 space-y-4 h-fit">
          {pages.map((p) => (
            <div key={p}>
              <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                {pageLabels[p] ?? p}
              </p>
              <div className="mt-1 space-y-0.5">
                {Object.entries(contentSchema[p]).map(([sectionKey, sectionSchema]) => (
                  <Link
                    key={sectionKey}
                    href={`/admin/content?page=${p}&section=${sectionKey}`}
                    className={`block rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                      p === activePage && sectionKey === activeSection
                        ? "bg-olive text-cream"
                        : "text-charcoal-light hover:bg-cream-dark"
                    }`}
                  >
                    {sectionSchema.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {schema && activeSection ? (
          <ContentSectionForm
            key={`${activePage}.${activeSection}`}
            page={activePage}
            section={activeSection}
            schema={schema}
            initial={pageContent[activeSection]}
          />
        ) : (
          <div className="rounded-2xl border border-charcoal/10 bg-white p-8 text-center text-sm text-ink-muted">
            Nothing here yet.
          </div>
        )}
      </div>
    </div>
  );
}
