import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addToWishlist, getWishlistItemsForUser } from "@/lib/wishlist-service";
import { mergeWishlistSchema } from "@/lib/validations/wishlist";
import { firstIssueMessage } from "@/lib/validations/format-error";

// POST /api/wishlist/merge — folds a just-logged-in user's guest
// (localStorage) wishlist into their server wishlist. Same pattern as
// /api/cart/merge.
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = mergeWishlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 400 }
    );
  }

  for (const slug of parsed.data.slugs) {
    await addToWishlist(session.user.id, slug);
  }

  return NextResponse.json({ items: await getWishlistItemsForUser(session.user.id) });
}
