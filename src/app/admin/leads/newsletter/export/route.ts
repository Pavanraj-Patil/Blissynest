import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { db } from "@/lib/db";
import { csvResponse, toCsv } from "@/lib/csv";

// GET /admin/leads/newsletter/export — the full subscriber list as a CSV, for
// importing into an email tool.
export async function GET() {
  const check = await requireAdminApi("leads");
  if ("error" in check) return NextResponse.json({ error: check.error }, { status: check.status });

  const subscribers = await db.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  const csv = toCsv(
    ["Email", "Subscribed (IST)"],
    subscribers.map((s) => [s.email, s.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })])
  );
  return csvResponse(`blissynest-newsletter-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}
