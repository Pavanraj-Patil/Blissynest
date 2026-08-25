import Link from "next/link";
import { Building2, Download, MessageSquareText } from "lucide-react";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getCorporateLeadsForAdmin } from "@/lib/admin/lead-service";
import { corporateNeeds } from "@/lib/corporate-data";
import { LeadStatusSelect } from "./LeadStatusSelect";
import type { LeadStatus } from "@/generated/prisma/client";

const PAGE_SIZE = 20;

const statusFilters = [
  { label: "New", value: "NEW" },
  { label: "Contacted", value: "CONTACTED" },
  { label: "Quoted", value: "QUOTED" },
  { label: "Converted", value: "CONVERTED" },
  { label: "Closed", value: "CLOSED" },
  { label: "All", value: "" },
] as const;

function interestLabel(interest: string | null) {
  if (!interest) return "—";
  return corporateNeeds.find((n) => n.slug === interest)?.title ?? interest;
}

export default async function AdminCorporateLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  await requireAdmin();
  const { status, page: pageParam } = await searchParams;
  const activeStatus = statusFilters.some((f) => f.value === status) ? (status as string) : "";
  const page = Math.max(1, Number(pageParam) || 1);

  const { leads, total } = await getCorporateLeadsForAdmin({
    status: activeStatus ? (activeStatus as LeadStatus) : undefined,
    page,
    pageSize: PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (activeStatus) params.set("status", activeStatus);
    params.set("page", String(targetPage));
    return `/admin/leads/corporate?${params.toString()}`;
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Corporate Leads</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {total} enquir{total === 1 ? "y" : "ies"} from the corporate gifting quote form.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {statusFilters.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/admin/leads/corporate?status=${f.value}` : "/admin/leads/corporate"}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeStatus === f.value
                ? "bg-olive text-cream"
                : "border border-charcoal/15 text-charcoal-light hover:bg-cream-dark"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {leads.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-charcoal/10 bg-white px-6 py-16 text-center">
          <Building2 size={32} className="text-charcoal/20" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-charcoal">Nothing here</p>
          <p className="mt-1 text-xs text-ink-muted">No leads match this filter right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-2xl border border-charcoal/10 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-charcoal">
                    {lead.name} · {lead.companyName}
                  </p>
                  <p className="text-xs text-ink-muted mt-0.5">
                    {lead.workEmail} · {lead.phone}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-charcoal-light">
                    <span>{interestLabel(lead.interest)}</span>
                    <span>·</span>
                    <span>{lead.intent === "QUOTE" ? "Requested a quote" : "Requested a consultation"}</span>
                    {lead.teamSize && (
                      <>
                        <span>·</span>
                        <span>{lead.teamSize} people</span>
                      </>
                    )}
                    {lead.downloadedCatalogue && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-olive-dark">
                          <Download size={11} /> Downloaded catalogue
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <LeadStatusSelect leadId={lead.id} status={lead.status} />
              </div>

              {lead.message && (
                <p className="mt-3 flex items-start gap-1.5 text-sm text-charcoal-light leading-relaxed">
                  <MessageSquareText size={14} className="mt-0.5 shrink-0 text-charcoal/30" />
                  {lead.message}
                </p>
              )}

              <p className="mt-3 border-t border-charcoal/10 pt-3 text-xs text-ink-muted">
                {lead.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={pageHref(i + 1)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                page === i + 1 ? "bg-olive text-cream" : "text-charcoal-light hover:bg-cream-dark"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
