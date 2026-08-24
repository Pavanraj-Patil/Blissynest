import { db } from "@/lib/db";

function toRupees(paise: number): number {
  return Math.round(paise / 100);
}

// null means "can't compute a meaningful percentage" (previous period was
// zero) — the UI shows "New" instead of a bogus infinite/undefined swing.
function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export type DashboardStats = {
  revenue: number;
  revenueChangePct: number | null;
  orderCount: number;
  orderCountChangePct: number | null;
  aov: number;
  aovChangePct: number | null;
  newCustomers: number;
  newCustomersChangePct: number | null;
};

// Every number here comes from a real Order/User row in the selected
// window, compared against the equal-length window immediately before it.
// No traffic/session tracking exists in this app, so there's deliberately
// no "conversion rate" metric — it would have to be fabricated.
export async function getDashboardStats(days: number): Promise<DashboardStats> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const prevSince = new Date(Date.now() - 2 * days * 24 * 60 * 60 * 1000);

  const [currentOrders, prevOrders, newCustomers, prevNewCustomers] = await Promise.all([
    db.order.findMany({ where: { createdAt: { gte: since } }, select: { total: true } }),
    db.order.findMany({
      where: { createdAt: { gte: prevSince, lt: since } },
      select: { total: true },
    }),
    db.user.count({ where: { createdAt: { gte: since } } }),
    db.user.count({ where: { createdAt: { gte: prevSince, lt: since } } }),
  ]);

  const revenue = currentOrders.reduce((sum, o) => sum + o.total, 0);
  const prevRevenue = prevOrders.reduce((sum, o) => sum + o.total, 0);
  const orderCount = currentOrders.length;
  const prevOrderCount = prevOrders.length;
  const aov = orderCount ? Math.round(revenue / orderCount) : 0;
  const prevAov = prevOrderCount ? Math.round(prevRevenue / prevOrderCount) : 0;

  return {
    revenue: toRupees(revenue),
    revenueChangePct: pctChange(revenue, prevRevenue),
    orderCount,
    orderCountChangePct: pctChange(orderCount, prevOrderCount),
    aov: toRupees(aov),
    aovChangePct: pctChange(aov, prevAov),
    newCustomers,
    newCustomersChangePct: pctChange(newCustomers, prevNewCustomers),
  };
}

export type SalesPoint = { date: string; label: string; revenue: number; orders: number };

export async function getSalesOverview(days: number): Promise<SalesPoint[]> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  since.setHours(0, 0, 0, 0);

  const orders = await db.order.findMany({
    where: { createdAt: { gte: since } },
    select: { total: true, createdAt: true },
  });

  const buckets = new Map<string, { revenue: number; orders: number }>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), { revenue: 0, orders: 0 });
  }

  orders.forEach((o) => {
    const key = o.createdAt.toISOString().slice(0, 10);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.revenue += o.total;
      bucket.orders += 1;
    }
  });

  return Array.from(buckets.entries()).map(([date, v]) => ({
    date,
    label: new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    revenue: toRupees(v.revenue),
    orders: v.orders,
  }));
}

export type TopProduct = { slug: string | null; name: string; image: string; qty: number; revenue: number };

export async function getTopSellingProducts(days: number, limit = 5): Promise<TopProduct[]> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const items = await db.orderItem.findMany({
    where: { order: { createdAt: { gte: since } } },
    select: {
      productName: true,
      productImage: true,
      quantity: true,
      unitPrice: true,
      product: { select: { slug: true } },
    },
  });

  const map = new Map<string, TopProduct>();
  for (const item of items) {
    const key = item.product?.slug ?? item.productName;
    const existing = map.get(key) ?? {
      slug: item.product?.slug ?? null,
      name: item.productName,
      image: item.productImage,
      qty: 0,
      revenue: 0,
    };
    existing.qty += item.quantity;
    existing.revenue += item.quantity * item.unitPrice;
    map.set(key, existing);
  }

  return Array.from(map.values())
    .sort((a, b) => b.qty - a.qty)
    .slice(0, limit)
    .map((p) => ({ ...p, revenue: toRupees(p.revenue) }));
}

export type RecentOrder = {
  orderNumber: string;
  buyerName: string;
  total: number;
  createdAt: Date;
  status: string;
  paymentStatus: string;
};

export async function getRecentOrders(limit = 6): Promise<RecentOrder[]> {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      orderNumber: true,
      buyerName: true,
      total: true,
      createdAt: true,
      status: true,
      paymentStatus: true,
    },
  });
  return orders.map((o) => ({ ...o, total: toRupees(o.total) }));
}

export type StatusCount = { status: string; count: number };

export async function getOrdersByStatus(days: number): Promise<StatusCount[]> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const groups = await db.order.groupBy({
    by: ["status"],
    where: { createdAt: { gte: since } },
    _count: { _all: true },
  });
  return groups.map((g) => ({ status: g.status, count: g._count._all }));
}

export type LowStockProduct = { slug: string; name: string; image: string; stockQuantity: number };

export async function getLowStockProducts(threshold = 10, limit = 6): Promise<LowStockProduct[]> {
  const products = await db.product.findMany({
    where: { status: "PUBLISHED", stockQuantity: { lt: threshold } },
    orderBy: { stockQuantity: "asc" },
    take: limit,
    select: { slug: true, name: true, images: true, stockQuantity: true },
  });
  return products.map((p) => ({
    slug: p.slug,
    name: p.name,
    image: (p.images as string[])[0],
    stockQuantity: p.stockQuantity,
  }));
}

export type CatalogueSummary = { totalProducts: number; publishedProducts: number; outOfStock: number };

export async function getCatalogueSummary(): Promise<CatalogueSummary> {
  const [totalProducts, publishedProducts, outOfStock] = await Promise.all([
    db.product.count(),
    db.product.count({ where: { status: "PUBLISHED" } }),
    db.product.count({ where: { status: "PUBLISHED", stockQuantity: 0 } }),
  ]);
  return { totalProducts, publishedProducts, outOfStock };
}
