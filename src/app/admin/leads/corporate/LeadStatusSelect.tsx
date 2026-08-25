"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statusOptions = ["NEW", "CONTACTED", "QUOTED", "CONVERTED", "CLOSED"];

const statusStyles: Record<string, string> = {
  NEW: "bg-gold/15 text-charcoal",
  CONTACTED: "bg-terracotta/10 text-terracotta-dark",
  QUOTED: "bg-charcoal/10 text-charcoal",
  CONVERTED: "bg-olive/10 text-olive-dark",
  CLOSED: "bg-charcoal/5 text-ink-muted",
};

export function LeadStatusSelect({ leadId, status }: { leadId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: string) {
    setValue(next);
    setSaving(true);
    await fetch(`/api/admin/leads/corporate/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <select
      value={value}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value)}
      className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-olive disabled:opacity-60 ${statusStyles[value]}`}
    >
      {statusOptions.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
