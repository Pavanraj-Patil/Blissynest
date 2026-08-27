import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/require-admin";
import { AdminShell } from "@/components/admin/AdminShell";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Admin | Blissynest",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const adminName = session.user.name ?? session.user.email ?? "Admin";

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
    >
      {children}
    </AdminShell>
  );
}
