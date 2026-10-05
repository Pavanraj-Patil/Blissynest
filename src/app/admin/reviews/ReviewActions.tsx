"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export function ReviewActions({
  reviewId,
  showModeration,
}: {
  reviewId: string;
  showModeration: boolean;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function moderate(status: "APPROVED" | "REJECTED") {
    setSubmitting(status);
    try {
      await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(null);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });
      if (!res.ok) return; // leave the dialog open so they can retry
      setConfirmingDelete(false);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {showModeration && (
        <>
          <button
            type="button"
            onClick={() => moderate("APPROVED")}
            disabled={submitting !== null}
            className="flex items-center gap-1.5 rounded-lg bg-olive text-cream px-3 py-1.5 text-xs font-semibold hover:bg-olive-dark transition-colors disabled:opacity-50"
          >
            <Check size={13} />
            {submitting === "APPROVED" ? "Approving…" : "Approve"}
          </button>
          <button
            type="button"
            onClick={() => moderate("REJECTED")}
            disabled={submitting !== null}
            className="flex items-center gap-1.5 rounded-lg border border-charcoal/20 px-3 py-1.5 text-xs font-semibold text-charcoal hover:bg-cream-dark transition-colors disabled:opacity-50"
          >
            <X size={13} />
            {submitting === "REJECTED" ? "Rejecting…" : "Reject"}
          </button>
        </>
      )}
      <button
        type="button"
        onClick={() => setConfirmingDelete(true)}
        aria-label="Delete review"
        className="flex h-7 w-7 items-center justify-center rounded-full text-charcoal-light hover:text-terracotta-dark hover:bg-cream-dark transition-colors"
      >
        <Trash2 size={13} />
      </button>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete this review?"
        description="This will be permanently removed. If it's currently approved, the product's star rating will be recalculated without it. This can't be undone."
        submitting={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
}
