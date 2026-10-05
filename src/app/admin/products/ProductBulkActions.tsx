"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

type Action = "PUBLISH" | "DRAFT" | "ARCHIVE";

const labels: Record<Action, { button: string; verb: string }> = {
  PUBLISH: { button: "Publish all", verb: "publish" },
  DRAFT: { button: "Move all to Draft", verb: "move to Draft" },
  ARCHIVE: { button: "Archive all", verb: "archive" },
};

// Applies one status change to every product matching the list's current
// filters (all pages, not just the 20 visible). Sits collapsed so it can't be
// hit by accident; every action asks for confirmation with the exact count.
export function ProductBulkActions({
  total,
  filters,
}: {
  total: number;
  filters: { q: string; status: string; audience: string; category: string };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<Action | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const filtered = Boolean(filters.q || filters.status || filters.audience || filters.category);
  const scope = filtered ? `the ${total} product${total === 1 ? "" : "s"} matching your current filters` : `ALL ${total} products in the catalogue`;

  async function run(action: Action) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...filters }),
      });
      const data = await res.json();
      setMessage(res.ok ? `Done, ${data.updated} product${data.updated === 1 ? "" : "s"} updated.` : (data.error ?? "That didn't work."));
      if (res.ok) router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
      setPending(null);
    }
  }

  if (total === 0) return null;

  return (
    <div className="rounded-2xl border border-charcoal/10 bg-white px-4 py-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs font-medium text-charcoal-light hover:text-terracotta-dark"
      >
        {open ? "Hide bulk actions" : "Bulk actions…"}
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-ink-muted">
            Applies to {scope} — not just this page. Archived products leave the store but stay here, with their order
            history.
          </p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(labels) as Action[]).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setPending(a)}
                className="rounded-lg border border-charcoal/20 px-3.5 py-2 text-xs font-semibold text-charcoal hover:bg-cream-dark"
              >
                {labels[a].button}
              </button>
            ))}
          </div>
          {message && <p className="text-xs text-olive-dark">{message}</p>}
        </div>
      )}

      <ConfirmDialog
        open={pending !== null}
        title={pending ? `${labels[pending].button}?` : ""}
        description={pending ? `This will ${labels[pending].verb} ${scope}. You can change them back later.` : ""}
        confirmLabel={pending ? labels[pending].button : "Confirm"}
        submitting={submitting}
        onConfirm={() => pending && run(pending)}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
