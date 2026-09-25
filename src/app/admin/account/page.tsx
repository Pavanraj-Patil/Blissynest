import { requireAdmin } from "@/lib/admin/require-admin";
import { ChangePasswordForm } from "@/components/account/SettingsSection";

// Admins are redirected away from the customer /account page, so this is where
// an admin changes their own password.
export default async function AdminAccountPage() {
  const session = await requireAdmin();

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">My account</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Signed in as <span className="text-charcoal">{session.user.email}</span>
        </p>
      </div>

      <div className="rounded-2xl border border-charcoal/10 bg-white p-6">
        <h2 className="font-serif text-lg text-charcoal">Change password</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
