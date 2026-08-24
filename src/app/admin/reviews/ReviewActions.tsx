"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

export function ReviewActions({ reviewId }: { reviewId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState<"APPROVED" | "REJECTED" | null>(null);

  async function moderate(status: "APPROVED" | "REJECTED") {
    setSubmitting(status);
    await fetch(`/api/admin/reviews/${reviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
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
    </div>
  );
}
