import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { corporateLeadSchema } from "@/lib/validations/leads";
import { checkRateLimit, getClientIp, tooManyRequestsResponse } from "@/lib/rate-limit";

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
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  await db.corporateLead.create({ data: parsed.data });

  return NextResponse.json({ success: true }, { status: 201 });
}
