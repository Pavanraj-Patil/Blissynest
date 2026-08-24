import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactMessageSchema } from "@/lib/validations/leads";
import { checkRateLimit, getClientIp, tooManyRequestsResponse } from "@/lib/rate-limit";

// POST /api/contact — the Contact Us page's message form. No auth required
// (anyone should be able to reach out), rate-limited per IP to keep it from
// being spammed.
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.allowed) return tooManyRequestsResponse(limit.retryAfterSeconds!);

  const body = await request.json().catch(() => null);
  const parsed = contactMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  await db.contactMessage.create({ data: parsed.data });

  return NextResponse.json({ success: true }, { status: 201 });
}
