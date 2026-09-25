import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signupSchema } from "@/lib/validations/auth";
import { hashPassword } from "@/lib/password";
import { checkRateLimit, getClientIp, tooManyRequestsResponse } from "@/lib/rate-limit";
import { firstIssueMessage } from "@/lib/validations/format-error";

// Creates the account only — sign-in itself happens client-side afterward
// via signIn("password", ...), so this route doesn't have to juggle
// NextAuth's session/cookie machinery too.
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`auth-signup:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.allowed) return tooManyRequestsResponse(limit.retryAfterSeconds!);

  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists — try signing in instead.", field: "email" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  // role deliberately left at its schema default (CUSTOMER) — never taken
  // from the request body, so a crafted signup payload can't self-promote.
  await db.user.create({
    data: { name, email, passwordHash },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
