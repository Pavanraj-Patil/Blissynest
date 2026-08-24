import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsletterSchema } from "@/lib/validations/leads";

// POST /api/newsletter — subscribes an email. Re-subscribing an already-
// subscribed address is treated as success, not an error.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
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
