import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/require-admin";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin | Blissynest",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const adminName = session.user.name ?? session.user.email ?? "Admin";

  return <AdminShell adminName={adminName}>{children}</AdminShell>;
}
