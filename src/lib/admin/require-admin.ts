import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Every /admin page (via the layout) calls this — the only place "is this
// request allowed into the admin area" gets decided. Redirects rather than
// 404s so a demoted/logged-out admin gets sent somewhere useful instead of
// a dead end.
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/");
  }
  return session;
}

// The /api/admin/* equivalent — returns an error to send back as a JSON
// response instead of redirecting, since a redirect makes no sense for a
// fetch() caller.
export async function requireAdminApi() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "Forbidden", status: 403 } as const;
  }
  return { session } as const;
}
