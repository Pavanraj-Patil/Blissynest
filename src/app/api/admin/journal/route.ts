import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { createPost } from "@/lib/journal-service";
import { journalInputSchema } from "@/lib/validations/journal";
import { firstIssueMessage } from "@/lib/validations/format-error";

// POST /api/admin/journal: create an article.
export async function POST(request: Request) {
  const check = await requireAdminApi("content");
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const body = await request.json().catch(() => null);
  const parsed = journalInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: firstIssueMessage(parsed.error) }, { status: 400 });
  }

  try {
    const post = await createPost(parsed.data);
    revalidatePath("/journal");
    return NextResponse.json({ post: { id: post.id } }, { status: 201 });
  } catch (e) {
    // The only realistic failure is a web address that's already taken.
    if (e instanceof Error && /Unique constraint|slug/i.test(e.message)) {
      return NextResponse.json({ error: "Another article already uses that web address." }, { status: 409 });
    }
    throw e;
  }
}
