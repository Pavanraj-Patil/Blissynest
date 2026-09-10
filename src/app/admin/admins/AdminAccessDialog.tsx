"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { ShieldAlert } from "lucide-react";
import { CheckboxGroupField } from "@/components/admin/CheckboxGroupField";
import { ADMIN_PERMISSIONS, adminPermissionLabels, type AdminPermission } from "@/lib/admin/permissions";

type Role = "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";

const permissionOptions = ADMIN_PERMISSIONS.map((value) => ({
  value,
  label: adminPermissionLabels[value],
}));

type AdminAccessDialogProps =
  | {
      open: boolean;
      onClose: () => void;
      onSaved: () => void;
      mode: "create";
    }
  | {
      open: boolean;
      onClose: () => void;
      onSaved: () => void;
      mode: "edit";
      userId: string;
      email: string;
      initialRole: "ADMIN" | "SUPER_ADMIN";
      initialPermissions: AdminPermission[];
      isSelf: boolean;
    };

export function AdminAccessDialog(props: AdminAccessDialogProps) {
  const { open, onClose, onSaved, mode } = props;
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>(mode === "edit" ? props.initialRole : "ADMIN");
  const [permissions, setPermissions] = useState<AdminPermission[]>(
    mode === "edit" ? props.initialPermissions : []
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const isSelf = mode === "edit" && props.isSelf;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res =
      mode === "create"
        ? await fetch("/api/admin/admins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, role, adminPermissions: permissions }),
          })
        : await fetch(`/api/admin/users/${props.userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role, adminPermissions: permissions }),
          });

    const data = await res.json().catch(() => null);
    setSubmitting(false);
    if (!res.ok) {
      setError(data?.error ?? "Something went wrong.");
      return;
    }
    onSaved();
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 px-4" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div>
          <h2 className="font-serif text-lg text-charcoal">
            {mode === "create" ? "Add Admin" : "Edit Access"}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            {mode === "create"
              ? "Promote an existing account to admin with a chosen set of permissions."
              : `Editing access for ${props.email}.`}
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta-dark">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {mode === "create" && (
          <label className="block">
            <span className="text-xs font-medium text-charcoal">Account email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="someone@example.com"
              className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
            />
            <span className="mt-1 block text-xs text-ink-muted">
              They must already have a regular account — this doesn&rsquo;t create one.
            </span>
          </label>
        )}

        {isSelf ? (
          <p className="rounded-lg bg-cream-dark px-3.5 py-2.5 text-xs text-ink-muted">
            You can&rsquo;t change your own role here — ask another super admin.
          </p>
        ) : (
          <div>
            <span className="text-xs font-medium text-charcoal">Role</span>
            <div className="mt-1.5 flex gap-2">
              {(mode === "edit"
                ? (["CUSTOMER", "ADMIN", "SUPER_ADMIN"] as const)
                : (["ADMIN", "SUPER_ADMIN"] as const)
              ).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                    role === r
                      ? "border-olive bg-olive/10 text-charcoal"
                      : "border-charcoal/15 text-charcoal-light hover:border-charcoal/30"
                  }`}
                >
                  {r === "CUSTOMER" ? "Remove access" : r === "ADMIN" ? "Admin" : "Super Admin"}
                </button>
              ))}
            </div>
          </div>
        )}

        {!isSelf && role === "ADMIN" && (
          <div>
            <span className="text-xs font-medium text-charcoal">Permissions</span>
            <p className="mt-0.5 text-xs text-ink-muted">Which admin sections can they access.</p>
            <div className="mt-2">
              <CheckboxGroupField
                value={permissions}
                onChange={(next) => setPermissions(next as AdminPermission[])}
                options={permissionOptions}
              />
            </div>
          </div>
        )}

        {!isSelf && role === "SUPER_ADMIN" && (
          <p className="rounded-lg bg-gold/10 px-3.5 py-2.5 text-xs text-charcoal">
            Super admins have full, unscoped access — every section, including managing other admins.
          </p>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-charcoal/20 px-4 py-2.5 text-xs font-semibold tracking-[0.08em] uppercase text-charcoal hover:bg-cream-dark transition-colors"
          >
            Cancel
          </button>
          {!isSelf && (
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-olive text-cream px-4 py-2.5 text-xs font-semibold tracking-[0.08em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Save"}
            </button>
          )}
        </div>
      </form>
    </div>,
    document.body
  );
}
