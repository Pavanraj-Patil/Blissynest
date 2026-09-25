import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { deletePost, updatePost } from "@/lib/journal-service";
import { journalInputSchema } from "@/lib/validations/journal";
import { firstIssueMessage } from "@/lib/validations/format-error";

// PATCH /api/admin/journal/:id: full update.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await requireAdminApi("content");
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = journalInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: firstIssueMessage(parsed.error) }, { status: 400 });
  }

  try {
    const post = await updatePost(id, parsed.data);
    if (!post) return NextResponse.json({ error: "Article not found" }, { status: 404 });
    revalidatePath("/journal");
    revalidatePath(`/journal/${post.slug}`);
    return NextResponse.json({ post: { id: post.id } });
  } catch (e) {
    if (e instanceof Error && /Unique constraint|slug/i.test(e.message)) {
      return NextResponse.json({ error: "Another article already uses that web address." }, { status: 409 });
    }
    throw e;
  }
}

// DELETE /api/admin/journal/:id
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await requireAdminApi("content");
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { id } = await params;
  await deletePost(id);
  revalidatePath("/journal");
  return NextResponse.json({ success: true });
}
