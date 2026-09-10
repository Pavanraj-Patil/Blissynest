import Link from "next/link";
import { Send } from "lucide-react";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getNewsletterSubscribersForAdmin } from "@/lib/admin/lead-service";

const PAGE_SIZE = 40;

export default async function AdminNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin("leads");
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { subscribers, total } = await getNewsletterSubscribersForAdmin({ page, pageSize: PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-[700px] mx-auto space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Newsletter</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {total} subscriber{total === 1 ? "" : "s"} signed up via the footer form.
        </p>
      </div>

      <div className="rounded-2xl border border-charcoal/10 bg-white overflow-hidden">
        {subscribers.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Send size={32} className="text-charcoal/20" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-charcoal">No subscribers yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-muted border-b border-charcoal/10 bg-cream-dark/50">
                <th className="py-3 pl-5 pr-3 font-medium">Email</th>
                <th className="py-3 pr-5 pl-3 font-medium text-right">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-b border-charcoal/5 last:border-0 hover:bg-cream/40">
                  <td className="py-2.5 pl-5 pr-3 text-charcoal">{s.email}</td>
                  <td className="py-2.5 pr-5 pl-3 text-right text-ink-muted">
                    {s.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={`/admin/leads/newsletter?page=${i + 1}`}
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
