import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { sendEmail, isEmailConfigured } from "@/lib/email";
import { getEmailContext } from "@/lib/email-context";
import { buildSampleEmail, isEmailTypeKey } from "@/lib/email-samples";

const bodySchema = z.object({ type: z.string() });

// POST /api/admin/emails/test: sends a sample of one email type to the
// signed-in admin's own address. Never to anyone else.
export async function POST(request: Request) {
  const check = await requireAdminApi("content");
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  const to = check.session.user?.email;
  if (!to) {
    return NextResponse.json({ error: "Your admin account has no email address." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !isEmailTypeKey(parsed.data.type)) {
    return NextResponse.json({ error: "Unknown email type." }, { status: 400 });
  }
  if (!isEmailConfigured()) {
    return NextResponse.json(
      { error: "Email is not set up yet (add ZEPTOMAIL_TOKEN and EMAIL_FROM), so nothing can be sent." },
      { status: 400 }
    );
  }

  const email = buildSampleEmail(parsed.data.type, await getEmailContext());
  const ok = await sendEmail({ to, ...email, subject: `[Test] ${email.subject}` });
  if (!ok) {
    return NextResponse.json({ error: "The email service refused the message. Check the server log." }, { status: 502 });
  }
  return NextResponse.json({ success: true, to });
}
