import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addQuantityToCart, getCartItemsForUser } from "@/lib/cart-service";
import { mergeCartSchema } from "@/lib/validations/cart";

// POST /api/cart/merge — folds a just-logged-in user's guest (localStorage)
// cart into their server cart, adding on top of anything already there.
// Called once by CartProvider right after `useSession()` flips to
// "authenticated"; the client clears localStorage once this succeeds.
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = mergeCartSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  for (const item of parsed.data.items) {
    // Unknown/unpublished slugs are skipped rather than failing the whole
    // merge — a stale localStorage entry shouldn't block everything else.
    await addQuantityToCart(session.user.id, item.slug, item.quantity);
  }

  return NextResponse.json({ items: await getCartItemsForUser(session.user.id) });
}
