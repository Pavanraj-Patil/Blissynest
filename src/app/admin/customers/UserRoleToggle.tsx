"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export function UserRoleToggle({
  userId,
  userEmail,
  role,
  isSelf,
}: {
  userId: string;
  userEmail: string;
  role: "CUSTOMER" | "ADMIN";
  isSelf: boolean;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextRole = role === "ADMIN" ? "CUSTOMER" : "ADMIN";

  async function toggle() {
    setSubmitting(true);
    setError(null);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: nextRole }),
    });
    const data = await res.json();
    setSubmitting(false);
    setConfirming(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    router.refresh();
  }

  if (error) {
    return <p className="text-[11px] text-terracotta-dark">{error}</p>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={isSelf}
        title={isSelf ? "You can't change your own role" : undefined}
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          role === "ADMIN" ? "bg-olive/10 text-olive-dark" : "bg-charcoal/10 text-charcoal-light"
        } ${!isSelf && "hover:opacity-75"}`}
      >
        {role}
      </button>

      <ConfirmDialog
        open={confirming}
        title={nextRole === "ADMIN" ? "Make this user an admin?" : "Remove admin access?"}
        description={
          nextRole === "ADMIN"
            ? `${userEmail} will get full access to this admin panel — orders, products, customers, everything.`
            : `${userEmail} will lose admin access immediately and be treated as a regular customer.`
        }
        confirmLabel={nextRole === "ADMIN" ? "Make Admin" : "Remove Access"}
        submitting={submitting}
        onConfirm={toggle}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
