import Link from "next/link";
import { Search, Users as UsersIcon } from "lucide-react";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getUsersForAdmin, type AdminUserListItem } from "@/lib/admin/user-service";

const PAGE_SIZE = 10;

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requireAdmin("customers");
  const { q, page: pageParam } = await searchParams;
  const query = (q ?? "").trim();
  const page = Math.max(1, Number(pageParam) || 1);

  const { users, total } = await getUsersForAdmin({
    q: query || undefined,
    role: "CUSTOMER",
    page,
    pageSize: PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function hrefFor(targetPage: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("page", String(targetPage));
    return `/admin/customers?${params.toString()}`;
  }

  return (
    <div className="max-w-[1100px] mx-auto space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Customers</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {total} account{total === 1 ? "" : "s"}.
        </p>
      </div>

      <div className="rounded-2xl border border-charcoal/10 bg-white p-4">
        <form className="max-w-sm">
          <label className="relative block">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/35" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by name or email…"
              className="w-full rounded-lg border border-charcoal/15 py-2 pl-9 pr-3 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
            />
          </label>
        </form>
      </div>

      <div className="rounded-2xl border border-charcoal/10 bg-white overflow-hidden">
        {users.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <UsersIcon size={28} className="text-charcoal/20" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-charcoal">No customer accounts match this search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-muted border-b border-charcoal/10 bg-cream-dark/50">
                  <th className="py-3 pl-5 pr-3 font-medium">Name</th>
                  <th className="py-3 px-3 font-medium">Email</th>
                  <th className="py-3 px-3 font-medium">Joined</th>
                  <th className="py-3 px-3 font-medium">Orders</th>
                  <th className="py-3 pr-5 pl-3 font-medium text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: AdminUserListItem) => (
                  <tr key={u.id} className="border-b border-charcoal/5 last:border-0 hover:bg-cream/40">
                    <td className="py-2.5 pl-5 pr-3 font-medium text-charcoal whitespace-nowrap">
                      <Link href={`/admin/customers/${u.id}`} className="hover:text-terracotta-dark">
                        {u.name ?? "—"}
                      </Link>
                    </td>
                    <td className="py-2.5 px-3 text-charcoal-light whitespace-nowrap">{u.email}</td>
                    <td className="py-2.5 px-3 text-ink-muted whitespace-nowrap">
                      {u.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-2.5 px-3">
                      {u.orderCount > 0 ? (
                        <Link href={`/admin/orders?q=${encodeURIComponent(u.email)}`} className="text-terracotta-dark hover:text-terracotta">
                          {u.orderCount}
                        </Link>
                      ) : (
                        <span className="text-charcoal-light">0</span>
                      )}
                    </td>
                    <td className="py-2.5 pr-5 pl-3 text-right text-charcoal-light whitespace-nowrap">
                      {u.totalSpent > 0 ? `₹${u.totalSpent.toLocaleString("en-IN")}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={hrefFor(i + 1)}
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
