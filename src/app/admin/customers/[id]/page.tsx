import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, CalendarDays, ShoppingBag, IndianRupee } from "lucide-react";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getUserForAdmin } from "@/lib/admin/user-service";
import { orderStatusStyles as statusStyles } from "@/lib/admin/order-status-styles";
import { UserRoleToggle } from "../UserRoleToggle";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin();
  const { id } = await params;
  const customer = await getUserForAdmin(id);
  if (!customer) notFound();

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-charcoal">
        <ArrowLeft size={14} />
        All Customers
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">
            {customer.name ?? "—"}
            {customer.id === session.user.id && (
              <span className="ml-2 text-sm font-normal text-ink-muted">(you)</span>
            )}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
            <Mail size={13} />
            {customer.email}
          </p>
        </div>
        <UserRoleToggle
          userId={customer.id}
          userEmail={customer.email}
          role={customer.role}
          isSelf={customer.id === session.user.id}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
          <div className="flex items-center gap-2 text-ink-muted">
            <CalendarDays size={15} />
            <span className="text-xs">Member Since</span>
          </div>
          <p className="mt-1.5 text-lg font-serif text-charcoal">
            {customer.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
          <div className="flex items-center gap-2 text-ink-muted">
            <ShoppingBag size={15} />
            <span className="text-xs">Orders</span>
          </div>
          <p className="mt-1.5 text-lg font-serif text-charcoal">{customer.orders.length}</p>
        </div>
        <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
          <div className="flex items-center gap-2 text-ink-muted">
            <IndianRupee size={15} />
            <span className="text-xs">Total Spent</span>
          </div>
          <p className="mt-1.5 text-lg font-serif text-charcoal">₹{customer.totalSpent.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-charcoal/10 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-charcoal/10">
          <h2 className="font-serif text-lg text-charcoal">Order History</h2>
        </div>
        {customer.orders.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-muted">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-muted border-b border-charcoal/10 bg-cream-dark/50">
                  <th className="py-3 pl-5 pr-3 font-medium">Order</th>
                  <th className="py-3 px-3 font-medium">Date</th>
                  <th className="py-3 px-3 font-medium">Status</th>
                  <th className="py-3 pr-5 pl-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {customer.orders.map((o) => (
                  <tr key={o.id} className="border-b border-charcoal/5 last:border-0 hover:bg-cream/40">
                    <td className="py-2.5 pl-5 pr-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-medium text-charcoal hover:text-terracotta-dark">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="py-2.5 px-3 text-ink-muted">
                      {o.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[o.status] ?? ""}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-2.5 pr-5 pl-3 text-right font-medium text-charcoal">
                      ₹{o.total.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
