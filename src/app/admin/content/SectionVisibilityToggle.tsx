"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

// Show/hide switch for one Site Content section. Saves the moment it's
// flipped (its own request, separate from the field form) — a visibility
// change shouldn't depend on remembering to also press "Save Changes", and
// shouldn't drag along half-edited copy from the form below it.
export function SectionVisibilityToggle({
  page,
  section,
  initialVisible,
  hasFields,
}: {
  page: string;
  section: string;
  initialVisible: boolean;
  hasFields: boolean;
}) {
  const router = useRouter();
  const [visible, setVisible] = useState(initialVisible);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    const next = !visible;
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/content/${page}/${section}/visibility`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: next }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Couldn't change visibility.");
      return;
    }
    setVisible(next);
    router.refresh();
  }

  return (
    <div
      className={cn(
        "rounded-2xl border px-5 py-4",
        visible ? "border-charcoal/10 bg-white" : "border-terracotta/30 bg-terracotta/5"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <span
            className={cn(
              "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              visible ? "bg-olive/10 text-olive-dark" : "bg-terracotta/10 text-terracotta-dark"
            )}
          >
            {visible ? <Eye size={15} /> : <EyeOff size={15} />}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-charcoal">
              {visible ? "Showing on the site" : "Hidden from the site"}
            </p>
            <p className="text-xs text-ink-muted">
              {visible
                ? "Visitors can see this section."
                : "Visitors don't see this section. Its content is kept, so switching it back on restores it."}
              {!hasFields && " This section has no editable copy — only the switch."}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={visible}
          aria-label="Show this section on the site"
          onClick={toggle}
          disabled={saving}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-60",
            visible ? "bg-olive" : "bg-charcoal/25"
          )}
        >
          <span
            className={cn(
              "inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform",
              visible ? "translate-x-[1.375rem]" : "translate-x-0.5"
            )}
          >
            {saving && <Loader2 size={11} className="animate-spin text-charcoal-light" />}
          </span>
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-terracotta-dark">{error}</p>}
    </div>
  );
}
