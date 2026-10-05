import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getMaintenanceStatus } from "@/lib/site-settings";

// Shows every visitor the branded "We'll be right back" page
// (src/app/maintenance/page.tsx) instead of the real one, whenever Admin ->
// Site Settings -> Maintenance Mode is switched on. A signed-in admin is
// exempt, so they can keep browsing the actual storefront to check on it
// while it's "down" for everyone else — no second browser or incognito
// window needed.
//
// Only ever intercepts page navigations: the matcher below already skips
// /api, /admin and any static-looking file (anything with a dot in its
// path, which covers _next assets, images, favicon, robots.txt, sitemap.xml
// and the like) without running any of this.
//
// Next 16 renamed middleware.ts to proxy.ts and it now defaults to the
// Node.js runtime (not Edge), so this can safely import the full `auth`
// instance from src/auth.ts — Prisma adapter included — and read the
// maintenance flag straight from the database.
export default auth(async (request) => {
  const role = request.auth?.user?.role;
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return NextResponse.next();
  }

  const { maintenanceMode } = await getMaintenanceStatus();
  if (!maintenanceMode) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/maintenance";
  // 503 + Retry-After tells search engines and uptime checks this is a
  // temporary state, not that the page is gone.
  return NextResponse.rewrite(url, { status: 503, headers: { "Retry-After": "300" } });
});

export const config = {
  matcher: ["/((?!api|admin|_next/static|_next/image|maintenance|.*\\..*).*)"],
};
