"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { AdminAccessDialog } from "./AdminAccessDialog";
import type { AdminPermission } from "@/lib/admin/permissions";

export function AddAdminButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-xl bg-olive text-cream px-4 py-2.5 text-xs font-semibold tracking-[0.08em] uppercase hover:bg-olive-dark transition-colors"
      >
        <Plus size={14} />
        Add Admin
      </button>
      <AdminAccessDialog
        mode="create"
        open={open}
        onClose={() => setOpen(false)}
        onSaved={() => {
          setOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}

export function EditAdminAccessButton({
  userId,
  email,
  role,
  permissions,
  isSelf,
}: {
  userId: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  permissions: AdminPermission[];
  isSelf: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-olive/10 px-2.5 py-1 text-[11px] font-semibold text-olive-dark hover:opacity-75 transition-opacity"
      >
        Edit
      </button>
      <AdminAccessDialog
        mode="edit"
        open={open}
        onClose={() => setOpen(false)}
        onSaved={() => {
          setOpen(false);
          router.refresh();
        }}
        userId={userId}
        email={email}
        initialRole={role}
        initialPermissions={permissions}
        isSelf={isSelf}
      />
    </>
  );
}
