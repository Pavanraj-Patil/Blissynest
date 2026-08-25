import Link from "next/link";
import { Mail } from "lucide-react";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getContactMessagesForAdmin } from "@/lib/admin/lead-service";

const PAGE_SIZE = 20;

export default async function AdminContactMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin();
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { messages, total } = await getContactMessagesForAdmin({ page, pageSize: PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Contact Messages</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {total} message{total === 1 ? "" : "s"} submitted through the contact form.
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-charcoal/10 bg-white px-6 py-16 text-center">
          <Mail size={32} className="text-charcoal/20" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-charcoal">Nothing here</p>
          <p className="mt-1 text-xs text-ink-muted">No messages have been submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="rounded-2xl border border-charcoal/10 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-charcoal">{m.subject}</p>
                  <p className="text-xs text-ink-muted mt-0.5">
                    {m.name} · <a href={`mailto:${m.email}`} className="hover:text-terracotta-dark">{m.email}</a>
                  </p>
                </div>
                <p className="shrink-0 text-xs text-ink-muted">
                  {m.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <p className="mt-3 text-sm text-charcoal-light leading-relaxed whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={`/admin/leads/contact?page=${i + 1}`}
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
