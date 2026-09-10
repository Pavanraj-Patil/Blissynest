// The delegable admin capabilities a SUPER_ADMIN can grant to an ADMIN
// account, one per admin-section. Deliberately does NOT include an
// "admins" entry — managing other admins' roles/permissions is exclusively
// a super-admin capability (see requireSuperAdmin in require-admin.ts), so
// an admin can never grant themselves (or anyone else) more access than
// they were given.
export const ADMIN_PERMISSIONS = [
  "orders",
  "products",
  "coupons",
  "banners",
  "content",
  "customers",
  "reviews",
  "leads",
  "settings",
] as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];

export const adminPermissionLabels: Record<AdminPermission, string> = {
  orders: "Orders",
  products: "Products",
  coupons: "Coupons",
  banners: "Banners",
  content: "Site Content",
  customers: "Customers",
  reviews: "Reviews",
  leads: "Leads",
  settings: "Site Settings",
};

export function isAdminPermission(value: unknown): value is AdminPermission {
  return typeof value === "string" && (ADMIN_PERMISSIONS as readonly string[]).includes(value);
}
