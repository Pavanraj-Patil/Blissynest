import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { passwordField } from "@/lib/validations/auth";
import { sendEmail } from "@/lib/email";
import { passwordChangedEmail } from "@/lib/email-templates";
import { checkRateLimit, getClientIp, tooManyRequestsResponse } from "@/lib/rate-limit";
import { hashResetToken } from "@/lib/password-reset";
import { firstIssueMessage } from "@/lib/validations/format-error";

const schema = z
  .object({
    token: z.string().min(20),
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// POST /api/auth/reset-password — sets a new password from a valid emailed token.
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`reset-ip:${ip}`, 10, 15 * 60 * 1000);
  if (!limit.allowed) return tooManyRequestsResponse(limit.retryAfterSeconds!);

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: firstIssueMessage(parsed.error) }, { status: 400 });
  }

  const record = await db.passwordResetToken.findUnique({
    where: { tokenHash: hashResetToken(parsed.data.token) },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  if (!record || record.expiresAt.getTime() < Date.now()) {
    return NextResponse.json(
      { error: "This reset link has expired or was already used. Please request a new one." },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await db.$transaction([
    db.user.update({ where: { id: record.user.id }, data: { passwordHash } }),
    // Every outstanding link for this account dies with the first successful reset.
    db.passwordResetToken.deleteMany({ where: { userId: record.user.id } }),
  ]);

  void sendEmail({ to: record.user.email, ...passwordChangedEmail(record.user.name) });

  return NextResponse.json({ success: true });
}
