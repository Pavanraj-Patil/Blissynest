"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UserRoleToggle({
  userId,
  role,
  isSelf,
}: {
  userId: string;
  role: "CUSTOMER" | "ADMIN";
  isSelf: boolean;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    if (isSelf) return;
    setSubmitting(true);
    setError(null);
    const nextRole = role === "ADMIN" ? "CUSTOMER" : "ADMIN";
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: nextRole }),
    });
    const data = await res.json();
    setSubmitting(false);
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
    <button
      type="button"
      onClick={toggle}
      disabled={isSelf || submitting}
      title={isSelf ? "You can't change your own role" : undefined}
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        role === "ADMIN" ? "bg-olive/10 text-olive-dark" : "bg-charcoal/10 text-charcoal-light"
      } ${!isSelf && "hover:opacity-75"}`}
    >
      {submitting ? "…" : role}
    </button>
  );
}
