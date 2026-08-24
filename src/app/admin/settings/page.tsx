import { requireAdmin } from "@/lib/admin/require-admin";
import { getSiteSettings } from "@/lib/site-settings";
import { SettingsForm } from "./SettingsForm";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <div className="max-w-[600px] mx-auto space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Site Settings</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Store-wide pricing and shipping config used by checkout.
        </p>
      </div>

      <SettingsForm initial={settings} />
    </div>
  );
}
