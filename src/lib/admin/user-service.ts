import { db } from "@/lib/db";
import { paiseToRupees } from "@/lib/currency";
import type { Prisma, UserRole } from "@/generated/prisma/client";
import { isAdminPermission, type AdminPermission } from "./permissions";

function toPermissionList(value: unknown): AdminPermission[] {
  return Array.isArray(value) ? value.filter(isAdminPermission) : [];
}

export type AdminUserListItem = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  adminPermissions: AdminPermission[];
  createdAt: Date;
  orderCount: number;
  totalSpent: number; // rupees
};

export async function getUsersForAdmin(params: {
  q?: string;
  role?: UserRole | UserRole[];
  page: number;
  pageSize: number;
}): Promise<{ users: AdminUserListItem[]; total: number }> {
  const { q, role, page, pageSize } = params;

  const where: Prisma.UserWhereInput = {
    ...(q && { OR: [{ name: { contains: q } }, { email: { contains: q } }] }),
    ...(role && { role: Array.isArray(role) ? { in: role } : role }),
  };

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: { id: true, name: true, email: true, role: true, adminPermissions: true, createdAt: true },
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
        adminPermissions: toPermissionList(u.adminPermissions),
        orderCount: stats?._count._all ?? 0,
        totalSpent: paiseToRupees(stats?._sum.total ?? 0),
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
  adminPermissions: AdminPermission[];
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
      adminPermissions: true,
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
    adminPermissions: toPermissionList(user.adminPermissions),
    createdAt: user.createdAt,
    orders: user.orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      total: paiseToRupees(o.total),
      createdAt: o.createdAt,
    })),
    totalSpent: paiseToRupees(user.orders.reduce((sum, o) => sum + o.total, 0)),
  };
}

// Only ever called from a super-admin-gated route (requireSuperAdminApi) —
// this is the one place a user's admin role/permissions actually change.
export async function setUserRoleAndPermissions(
  id: string,
  role: UserRole,
  adminPermissions: AdminPermission[],
  requestingAdminId: string
): Promise<{ error: string; status: number } | { success: true }> {
  if (id === requestingAdminId && role !== "SUPER_ADMIN") {
    return { error: "You can't remove your own super admin access.", status: 400 };
  }

  const user = await db.user.findUnique({ where: { id } });
  if (!user) return { error: "User not found.", status: 404 };

  if (user.role === "SUPER_ADMIN" && role !== "SUPER_ADMIN") {
    const otherSuperAdmins = await db.user.count({
      where: { role: "SUPER_ADMIN", id: { not: id } },
    });
    if (otherSuperAdmins === 0) {
      return { error: "There must be at least one super admin.", status: 400 };
    }
  }

  await db.user.update({
    where: { id },
    // Permissions are only meaningful for a plain ADMIN — SUPER_ADMIN
    // implicitly has everything and CUSTOMER has nothing, so both clear the
    // field rather than leaving a stale list an admin could be re-promoted
    // into later.
    data: { role, adminPermissions: role === "ADMIN" ? adminPermissions : [] },
  });
  return { success: true };
}
