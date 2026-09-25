import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { passwordResetEmail } from "@/lib/email-templates";
import { getSiteUrl } from "@/lib/site-url";
import { hashResetToken, RESET_TOKEN_LIFETIME_MS } from "@/lib/password-reset";
import { checkRateLimit, getClientIp, tooManyRequestsResponse } from "@/lib/rate-limit";
import { firstIssueMessage } from "@/lib/validations/format-error";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

// POST /api/auth/forgot-password — emails a one-hour reset link.
//
// Always answers the same way whether or not the address has an account, so
// this can't be used to discover who is registered. Google-only accounts (no
// password) get no email — there is no password to reset.
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const byIp = checkRateLimit(`forgot-ip:${ip}`, 8, 15 * 60 * 1000);
  if (!byIp.allowed) return tooManyRequestsResponse(byIp.retryAfterSeconds!);

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: firstIssueMessage(parsed.error) }, { status: 400 });
  }
  const { email } = parsed.data;

  const byEmail = checkRateLimit(`forgot-email:${email}`, 3, 60 * 60 * 1000);
  if (!byEmail.allowed) return tooManyRequestsResponse(byEmail.retryAfterSeconds!);

  const user = await db.user.findUnique({ where: { email }, select: { id: true, name: true, passwordHash: true } });
  if (user?.passwordHash) {
    const token = randomBytes(32).toString("hex");
    // One live link per account: a new request replaces any earlier one.
    await db.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await db.passwordResetToken.create({
      data: { userId: user.id, tokenHash: hashResetToken(token), expiresAt: new Date(Date.now() + RESET_TOKEN_LIFETIME_MS) },
    });
    const resetUrl = `${getSiteUrl()}/reset-password?token=${token}`;
    void sendEmail({ to: email, ...passwordResetEmail(user.name, resetUrl) });
  }

  return NextResponse.json({ success: true });
}
