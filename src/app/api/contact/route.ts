import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactMessageSchema } from "@/lib/validations/leads";
import { emailTeam } from "@/lib/order-emails";
import { checkRateLimit, getClientIp, tooManyRequestsResponse } from "@/lib/rate-limit";
import { firstIssueMessage } from "@/lib/validations/format-error";

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
      { error: firstIssueMessage(parsed.error) },
      { status: 400 }
    );
  }

  await db.contactMessage.create({ data: parsed.data });
  void emailTeam(
    `New contact message: ${parsed.data.subject}`,
    [
      ["Name", parsed.data.name],
      ["Email", parsed.data.email],
      ["Subject", parsed.data.subject],
      ["Message", parsed.data.message],
    ],
    parsed.data.email
  );

  return NextResponse.json({ success: true }, { status: 201 });
}
