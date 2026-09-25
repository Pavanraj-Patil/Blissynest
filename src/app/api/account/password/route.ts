import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { changePasswordSchema } from "@/lib/validations/account";
import { checkRateLimit, tooManyRequestsResponse } from "@/lib/rate-limit";
import { firstIssueMessage } from "@/lib/validations/format-error";

// PATCH /api/account/password — changes the signed-in user's password.
// Only meaningful for accounts that have one (credentials sign-up); a
// Google-only account has no passwordHash to verify against, so it's
// rejected outright rather than silently creating a password out of thin
// air — the client UI doesn't show this form for those accounts either.
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Keyed by user id, not IP — this guards against brute-forcing a known
  // account's current password, which an IP-keyed limit wouldn't catch
  // for a shared/proxied IP.
  const limit = checkRateLimit(`account-password:${session.user.id}`, 5, 10 * 60 * 1000);
  if (!limit.allowed) return tooManyRequestsResponse(limit.retryAfterSeconds!);

  const body = await request.json().catch(() => null);
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 400 }
    );
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true },
  });
  if (!user?.passwordHash) {
    return NextResponse.json(
      { error: "This account signed in with Google and has no password to change." },
      { status: 400 }
    );
  }

  const { currentPassword, newPassword } = parsed.data;
  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  }

  // Checked only after the current password is verified, so this can't be
  // used to probe what someone's password is.
  if (newPassword === currentPassword) {
    return NextResponse.json(
      { error: "Your new password can't be the same as your current password." },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(newPassword);
  await db.user.update({ where: { id: session.user.id }, data: { passwordHash } });

  return NextResponse.json({ success: true });
}
