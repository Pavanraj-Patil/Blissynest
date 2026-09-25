import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsletterSchema } from "@/lib/validations/leads";
import { checkRateLimit, getClientIp, tooManyRequestsResponse } from "@/lib/rate-limit";
import { firstIssueMessage } from "@/lib/validations/format-error";

// POST /api/newsletter — subscribes an email. Re-subscribing an already-
// subscribed address is treated as success, not an error.
export async function POST(request: Request) {
  // Per-IP cap so the form can't be used to stuff the list with junk addresses.
  const limit = checkRateLimit(`newsletter:${getClientIp(request)}`, 6, 10 * 60 * 1000);
  if (!limit.allowed) return tooManyRequestsResponse(limit.retryAfterSeconds!);

  const body = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 400 }
    );
  }

  await db.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    update: {},
    create: { email: parsed.data.email },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
