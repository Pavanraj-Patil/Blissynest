import { requireAdmin } from "@/lib/admin/require-admin";
import { contentSchema } from "@/lib/content-schema";
import { getPageContent } from "@/lib/content-service";
import { ContentSectionForm } from "./ContentSectionForm";
import { ContentSidebar, type ContentPageGroup } from "./ContentSidebar";

const pageLabels: Record<string, string> = {
  home: "Homepage",
  about: "About",
  faqs: "FAQs",
  shipping: "Shipping",
  returns: "Returns",
  help: "Help",
  contact: "Contact",
  "track-order": "Track Order",
  corporate: "Corporate Gifting",
  layout: "Site-Wide",
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

  const groups: ContentPageGroup[] = pages.map((p) => ({
    slug: p,
    label: pageLabels[p] ?? p,
    sections: Object.entries(contentSchema[p]).map(([key, s]) => ({ key, title: s.title })),
  }));

  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Site Content</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Marketing copy, images, and links across the homepage and static pages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-5">
        <ContentSidebar groups={groups} activePage={activePage} activeSection={activeSection} />

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
