import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ADMIN_PERMISSIONS, isAdminPermission, type AdminPermission } from "./permissions";

export type AdminAccess = { role: "ADMIN" | "SUPER_ADMIN"; permissions: AdminPermission[] };

// Always re-read role/permissions from the DB rather than trusting the JWT
// session (which only refreshes on login/token-rotation) — a super admin
// revoking or changing someone's access needs to take effect on that
// admin's very next request, not just their next login.
async function getAccess(userId: string): Promise<AdminAccess | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true, adminPermissions: true },
  });
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) return null;
  return {
    role: user.role,
    permissions:
      user.role === "SUPER_ADMIN"
        ? [...ADMIN_PERMISSIONS]
        : ((user.adminPermissions as unknown[]) ?? []).filter(isAdminPermission),
  };
}

function hasAccess(access: AdminAccess, permission?: AdminPermission) {
  return !permission || access.role === "SUPER_ADMIN" || access.permissions.includes(permission);
}

// Every /admin page (via the layout) calls this — the only place "is this
// request allowed into the admin area" gets decided. Redirects rather than
// 404s so a demoted/logged-out admin gets sent somewhere useful instead of
// a dead end. Pass a permission to also gate that specific section — an
// admin without it gets bounced back to the dashboard rather than seeing
// content they're not scoped for.
export async function requireAdmin(permission?: AdminPermission) {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  const access = await getAccess(session.user.id);
  if (!access) redirect("/");
  if (!hasAccess(access, permission)) redirect("/admin");
  return session;
}

// The /api/admin/* equivalent — returns an error to send back as a JSON
// response instead of redirecting, since a redirect makes no sense for a
// fetch() caller.
export async function requireAdminApi(permission?: AdminPermission) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Forbidden", status: 403 } as const;
  const access = await getAccess(session.user.id);
  if (!access) return { error: "Forbidden", status: 403 } as const;
  if (!hasAccess(access, permission)) {
    return { error: "You don't have permission to do this.", status: 403 } as const;
  }
  return { session } as const;
}

// Admin management (viewing/editing OTHER admins' roles and permissions) is
// exclusively a super-admin capability — deliberately NOT part of the
// delegable permission system above. If it were delegable, an admin holding
// it could grant themselves (or anyone) any other permission, defeating the
// whole point of scoped access.
export async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  const access = await getAccess(session.user.id);
  if (!access || access.role !== "SUPER_ADMIN") redirect("/admin");
  return session;
}

export async function requireSuperAdminApi() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Forbidden", status: 403 } as const;
  const access = await getAccess(session.user.id);
  if (!access || access.role !== "SUPER_ADMIN") {
    return { error: "Only a super admin can do this.", status: 403 } as const;
  }
  return { session } as const;
}

// Used by admin/layout.tsx to decide which sidebar sections to render, and
// by the admin-management page to show an admin's current access.
export async function getAdminAccess(userId: string): Promise<AdminAccess | null> {
  return getAccess(userId);
}
