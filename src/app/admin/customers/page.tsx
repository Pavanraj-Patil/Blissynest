import Link from "next/link";
import { Search, Users as UsersIcon, ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getUsersForAdmin, type AdminUserListItem } from "@/lib/admin/user-service";
import { UserRoleToggle } from "./UserRoleToggle";

const PAGE_SIZE = 10;

function UserColumn({
  title,
  icon: Icon,
  users,
  total,
  page,
  totalPages,
  pageHref,
  sessionUserId,
  emptyLabel,
}: {
  title: string;
  icon: typeof UsersIcon;
  users: AdminUserListItem[];
  total: number;
  page: number;
  totalPages: number;
  pageHref: (targetPage: number) => string;
  sessionUserId: string;
  emptyLabel: string;
}) {
  return (
    <div className="space-y-3">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-charcoal">
        <Icon size={15} className="text-terracotta" />
        {title}
        <span className="font-normal text-ink-muted">({total})</span>
      </h2>

      <div className="rounded-2xl border border-charcoal/10 bg-white overflow-hidden">
        {users.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <Icon size={28} className="text-charcoal/20" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-charcoal">{emptyLabel}</p>
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
                  <th className="py-3 px-3 font-medium">Total Spent</th>
                  <th className="py-3 pr-5 pl-3 font-medium text-right">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-charcoal/5 last:border-0 hover:bg-cream/40">
                    <td className="py-2.5 pl-5 pr-3 font-medium text-charcoal whitespace-nowrap">
                      <Link href={`/admin/customers/${u.id}`} className="hover:text-terracotta-dark">
                        {u.name ?? "—"}
                      </Link>
                      {u.id === sessionUserId && (
                        <span className="ml-1.5 text-[10px] font-normal text-ink-muted">(you)</span>
                      )}
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
                    <td className="py-2.5 px-3 text-charcoal-light whitespace-nowrap">
                      {u.totalSpent > 0 ? `₹${u.totalSpent.toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td className="py-2.5 pr-5 pl-3 text-right">
                      <UserRoleToggle userId={u.id} userEmail={u.email} role={u.role} isSelf={u.id === sessionUserId} />
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

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; customerPage?: string; adminPage?: string }>;
}) {
  const session = await requireAdmin();
  const { q, customerPage: customerPageParam, adminPage: adminPageParam } = await searchParams;
  const query = (q ?? "").trim();
  const customerPage = Math.max(1, Number(customerPageParam) || 1);
  const adminPage = Math.max(1, Number(adminPageParam) || 1);

  const [customers, admins] = await Promise.all([
    getUsersForAdmin({ q: query || undefined, role: "CUSTOMER", page: customerPage, pageSize: PAGE_SIZE }),
    getUsersForAdmin({ q: query || undefined, role: "ADMIN", page: adminPage, pageSize: PAGE_SIZE }),
  ]);
  const customerTotalPages = Math.max(1, Math.ceil(customers.total / PAGE_SIZE));
  const adminTotalPages = Math.max(1, Math.ceil(admins.total / PAGE_SIZE));

  function hrefFor(param: "customerPage" | "adminPage", targetPage: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (param === "customerPage" && adminPage > 1) params.set("adminPage", String(adminPage));
    if (param === "adminPage" && customerPage > 1) params.set("customerPage", String(customerPage));
    params.set(param, String(targetPage));
    return `/admin/customers?${params.toString()}`;
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Customers</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {customers.total + admins.total} account{customers.total + admins.total === 1 ? "" : "s"} — click a role badge to promote or demote an admin.
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <UserColumn
          title="Customers"
          icon={UsersIcon}
          users={customers.users}
          total={customers.total}
          page={customerPage}
          totalPages={customerTotalPages}
          pageHref={(p) => hrefFor("customerPage", p)}
          sessionUserId={session.user.id}
          emptyLabel="No customer accounts match this search."
        />
        <UserColumn
          title="Admins"
          icon={ShieldCheck}
          users={admins.users}
          total={admins.total}
          page={adminPage}
          totalPages={adminTotalPages}
          pageHref={(p) => hrefFor("adminPage", p)}
          sessionUserId={session.user.id}
          emptyLabel="No admin accounts match this search."
        />
      </div>
    </div>
  );
}
