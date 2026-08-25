import { db } from "@/lib/db";
import type { Prisma, UserRole } from "@/generated/prisma/client";

export type AdminUserListItem = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: Date;
  orderCount: number;
  totalSpent: number; // rupees
};

export async function getUsersForAdmin(params: {
  q?: string;
  page: number;
  pageSize: number;
}): Promise<{ users: AdminUserListItem[]; total: number }> {
  const { q, page, pageSize } = params;

  const where: Prisma.UserWhereInput = q
    ? { OR: [{ name: { contains: q } }, { email: { contains: q } }] }
    : {};

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    db.user.count({ where }),
  ]);

  const userIds = users.map((u) => u.id);
  const orderStats =
    userIds.length > 0
      ? await db.order.groupBy({
          by: ["userId"],
          where: { userId: { in: userIds } },
          _count: { _all: true },
          _sum: { total: true },
        })
      : [];

  const statsByUserId = new Map(orderStats.map((s) => [s.userId, s]));

  return {
    users: users.map((u) => {
      const stats = statsByUserId.get(u.id);
      return {
        ...u,
        orderCount: stats?._count._all ?? 0,
        totalSpent: Math.round((stats?._sum.total ?? 0) / 100),
      };
    }),
    total,
  };
}

export type AdminUserOrder = {
  id: string;
  orderNumber: string;
  status: string;
  total: number; // rupees
  createdAt: Date;
};

export type AdminUserDetail = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: Date;
  orders: AdminUserOrder[];
  totalSpent: number; // rupees
};

export async function getUserForAdmin(id: string): Promise<AdminUserDetail | null> {
  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      orders: {
        orderBy: { createdAt: "desc" },
        select: { id: true, orderNumber: true, status: true, total: true, createdAt: true },
      },
    },
  });
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    orders: user.orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      total: Math.round(o.total / 100),
      createdAt: o.createdAt,
    })),
    totalSpent: Math.round(user.orders.reduce((sum, o) => sum + o.total, 0) / 100),
  };
}

export async function setUserRole(
  id: string,
  role: UserRole,
  requestingAdminId: string
): Promise<{ error: string; status: number } | { success: true }> {
  if (id === requestingAdminId && role !== "ADMIN") {
    return { error: "You can't remove your own admin access.", status: 400 };
  }
  const user = await db.user.findUnique({ where: { id } });
  if (!user) return { error: "User not found.", status: 404 };

  await db.user.update({ where: { id }, data: { role } });
  return { success: true };
}
