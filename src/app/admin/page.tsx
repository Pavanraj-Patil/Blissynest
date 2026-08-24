import Link from "next/link";
import Image from "next/image";
import {
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  UserPlus,
  Package,
  Plus,
  Tag,
  Users as UsersIcon,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  getDashboardStats,
  getSalesOverview,
  getTopSellingProducts,
  getRecentOrders,
  getOrdersByStatus,
  getLowStockProducts,
  getCatalogueSummary,
} from "@/lib/admin/dashboard-service";
import { ChangeBadge } from "@/components/admin/ChangeBadge";
import { SalesOverviewChart, OrdersByStatusChart } from "./DashboardCharts";

const rangeOptions = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
];

const orderStatusStyles: Record<string, string> = {
  PLACED: "bg-gold/15 text-charcoal",
  CONFIRMED: "bg-terracotta/10 text-terracotta-dark",
  PACKED: "bg-terracotta/10 text-terracotta-dark",
  SHIPPED: "bg-olive/10 text-olive-dark",
  DELIVERED: "bg-olive/15 text-olive-dark",
  CANCELLED: "bg-charcoal/10 text-charcoal-light",
};

const paymentStatusStyles: Record<string, string> = {
  PAID: "bg-olive/10 text-olive-dark",
  PENDING: "bg-gold/15 text-charcoal",
  FAILED: "bg-terracotta/10 text-terracotta-dark",
  REFUNDED: "bg-charcoal/10 text-charcoal-light",
};

function StatCard({
  icon: Icon,
  label,
  value,
  changePct,
}: {
  icon: typeof IndianRupee;
  label: string;
  value: string;
  changePct: number | null;
}) {
  return (
    <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs text-ink-muted">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream-dark text-olive">
          <Icon size={15} strokeWidth={1.75} />
        </span>
      </div>
      <p className="mt-2 font-serif text-2xl text-charcoal">{value}</p>
      <div className="mt-1.5">
        <ChangeBadge pct={changePct} />
      </div>
    </div>
  );
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const session = await requireAdmin();
  const { range } = await searchParams;
  const days = rangeOptions.some((r) => String(r.days) === range) ? Number(range) : 30;

  const [stats, sales, topProducts, recentOrders, ordersByStatus, lowStock, catalogue] =
    await Promise.all([
      getDashboardStats(days),
      getSalesOverview(Math.min(days, 30)),
      getTopSellingProducts(days),
      getRecentOrders(6),
      getOrdersByStatus(days),
      getLowStockProducts(),
      getCatalogueSummary(),
    ]);

  const adminName = session.user.name ?? "Admin";

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Welcome back, {adminName} 👋</h1>
          <p className="mt-1 text-sm text-ink-muted">Here&rsquo;s what&rsquo;s happening with your store.</p>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-charcoal/15 bg-white p-1 shrink-0">
          {rangeOptions.map((opt) => (
            <Link
              key={opt.days}
              href={`/admin?range=${opt.days}`}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                opt.days === days
                  ? "bg-olive text-cream"
                  : "text-charcoal-light hover:bg-cream-dark"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value={`₹${stats.revenue.toLocaleString("en-IN")}`}
          changePct={stats.revenueChangePct}
        />
        <StatCard
          icon={ShoppingBag}
          label="Orders"
          value={stats.orderCount.toLocaleString("en-IN")}
          changePct={stats.orderCountChangePct}
        />
        <StatCard
          icon={TrendingUp}
          label="Average Order Value"
          value={`₹${stats.aov.toLocaleString("en-IN")}`}
          changePct={stats.aovChangePct}
        />
        <StatCard
          icon={UserPlus}
          label="New Customers"
          value={stats.newCustomers.toLocaleString("en-IN")}
          changePct={stats.newCustomersChangePct}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">
        <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-lg text-charcoal">Sales Overview</h2>
            <p className="text-xs text-ink-muted">Last {Math.min(days, 30)} days</p>
          </div>
          <SalesOverviewChart data={sales} />
        </div>

        <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg text-charcoal">Top Selling Products</h2>
            <Link href="/admin/products" className="text-xs font-medium text-terracotta-dark hover:text-terracotta">
              View all
            </Link>
          </div>
          {topProducts.length === 0 ? (
            <p className="text-sm text-ink-muted py-6 text-center">No sales in this period yet.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.slug ?? p.name} className="flex items-center gap-3">
                  <span className="w-4 text-xs font-medium text-ink-muted shrink-0">{i + 1}</span>
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-charcoal">{p.name}</p>
                    <p className="text-xs text-ink-muted">₹{p.revenue.toLocaleString("en-IN")}</p>
                  </div>
                  <p className="text-xs text-ink-muted shrink-0">{p.qty} sold</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
          <h2 className="font-serif text-lg text-charcoal mb-4">Orders by Status</h2>
          <OrdersByStatusChart data={ordersByStatus} />
        </div>

        <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg text-charcoal">Low Stock Alert</h2>
            <Link href="/admin/products" className="text-xs font-medium text-terracotta-dark hover:text-terracotta">
              View all
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-ink-muted py-6 text-center">Nothing running low right now.</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <div key={p.slug} className="flex items-center gap-3">
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="36px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-charcoal">{p.name}</p>
                    <p className="flex items-center gap-1 text-xs text-terracotta-dark">
                      <AlertTriangle size={11} />
                      {p.stockQuantity} left
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
          <h2 className="font-serif text-lg text-charcoal mb-4">Catalogue</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">Total products</span>
              <span className="font-medium text-charcoal">{catalogue.totalProducts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">Published</span>
              <span className="font-medium text-charcoal">{catalogue.publishedProducts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">Out of stock</span>
              <span className="font-medium text-terracotta-dark">{catalogue.outOfStock}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg text-charcoal">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-medium text-terracotta-dark hover:text-terracotta">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-ink-muted py-6 text-center">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-muted border-b border-charcoal/10">
                  <th className="pb-2 font-medium">Order</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Payment</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.orderNumber} className="border-b border-charcoal/5 last:border-0">
                    <td className="py-2.5 font-medium text-charcoal">{o.orderNumber}</td>
                    <td className="py-2.5 text-charcoal-light">{o.buyerName}</td>
                    <td className="py-2.5 text-ink-muted">
                      {o.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${paymentStatusStyles[o.paymentStatus] ?? ""}`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${orderStatusStyles[o.status] ?? ""}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-medium text-charcoal">
                      ₹{o.total.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
        <h2 className="font-serif text-lg text-charcoal mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "All Products", href: "/admin/products", icon: Package },
            { label: "All Orders", href: "/admin/orders", icon: ShoppingBag },
            { label: "Coupons", href: "/admin/coupons", icon: Tag },
            { label: "Customers", href: "/admin/customers", icon: UsersIcon },
            { label: "Corporate Leads", href: "/admin/leads/corporate", icon: Plus },
            { label: "Site Settings", href: "/admin/settings", icon: Settings },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-xl border border-charcoal/10 px-4 py-4 text-center hover:border-olive/40 hover:bg-cream-dark transition-colors"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-dark text-olive">
                <action.icon size={16} strokeWidth={1.75} />
              </span>
              <span className="text-xs font-medium text-charcoal">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
