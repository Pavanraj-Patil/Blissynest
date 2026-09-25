import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { corporateLeadSchema } from "@/lib/validations/leads";
import { emailTeam } from "@/lib/order-emails";
import { checkRateLimit, getClientIp, tooManyRequestsResponse } from "@/lib/rate-limit";
import { firstIssueMessage } from "@/lib/validations/format-error";

// POST /api/corporate-lead — the corporate gifting quote/consultation form.
// Same "download catalogue also submits the lead" behavior as before, now
// backed by a real row instead of just flipping local component state.
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`corporate-lead:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.allowed) return tooManyRequestsResponse(limit.retryAfterSeconds!);

  const body = await request.json().catch(() => null);
  const parsed = corporateLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 400 }
    );
  }

  await db.corporateLead.create({ data: parsed.data });
  void emailTeam(
    parsed.data.intent === "CONSULTATION" ? "New corporate consultation request" : "New corporate quote request",
    [
      ["Name", parsed.data.name],
      ["Work email", parsed.data.workEmail],
      ["Phone", parsed.data.phone],
      ["Company", parsed.data.companyName],
      ["Team size", parsed.data.teamSize ?? "—"],
      ["Interested in", parsed.data.interest ?? "—"],
      ["Message", parsed.data.message ?? "—"],
    ],
    parsed.data.workEmail
  );

  return NextResponse.json({ success: true }, { status: 201 });
}
