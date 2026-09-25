import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { importStarterPosts } from "@/lib/journal-service";

// POST /api/admin/journal/starter: copy the built-in starter articles into
// the database. Does nothing if any article already exists.
export async function POST() {
  const check = await requireAdminApi("content");
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  const added = await importStarterPosts();
  revalidatePath("/journal");
  return NextResponse.json({ added });
}
