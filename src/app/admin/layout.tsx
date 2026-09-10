import type { Metadata } from "next";
import { requireAdmin, getAdminAccess } from "@/lib/admin/require-admin";
import { AdminShell } from "@/components/admin/AdminShell";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Admin | Blissynest",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const adminName = session.user.name ?? session.user.email ?? "Admin";
  // requireAdmin() above already confirmed this is an admin, so this can't
  // come back null — re-fetched here (rather than threaded through) purely
  // to get the permission list, which requireAdmin's return value doesn't
  // carry (see require-admin.ts for why it keeps that contract unchanged).
  const access = (await getAdminAccess(session.user.id))!;

  // Read-only counts for the sidebar's "needs attention" badges — every
  // admin page re-runs this (it's the layout), so these must never mutate
  // anything themselves. Reviews/CorporateLeads only leave their counted
  // status via an explicit admin action elsewhere (approve/reject, status
  // dropdown); ContactMessage.read is the one cleared just by viewing its
  // list (see admin/leads/contact/page.tsx).
  const [pendingReviews, newCorporateLeads, unreadContactMessages] = await Promise.all([
    db.review.count({ where: { status: "PENDING" } }),
    db.corporateLead.count({ where: { status: "NEW" } }),
    db.contactMessage.count({ where: { read: false } }),
  ]);

  return (
    <AdminShell
      adminName={adminName}
      counts={{ pendingReviews, newCorporateLeads, unreadContactMessages }}
      access={access}
    >
      {children}
    </AdminShell>
  );
}
