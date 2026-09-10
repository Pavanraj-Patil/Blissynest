import { ShieldCheck } from "lucide-react";
import { requireSuperAdmin } from "@/lib/admin/require-admin";
import { getUsersForAdmin } from "@/lib/admin/user-service";
import { adminPermissionLabels } from "@/lib/admin/permissions";
import { AddAdminButton, EditAdminAccessButton } from "./AdminAccessControls";

export default async function AdminAdminsPage() {
  const session = await requireSuperAdmin();

  const { users } = await getUsersForAdmin({
    role: ["ADMIN", "SUPER_ADMIN"],
    page: 1,
    pageSize: 200,
  });

  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Admins</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {users.length} account{users.length === 1 ? "" : "s"} with admin access — only a super
            admin can see or change this page.
          </p>
        </div>
        <AddAdminButton />
      </div>

      <div className="rounded-2xl border border-charcoal/10 bg-white overflow-hidden">
        {users.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <ShieldCheck size={28} className="text-charcoal/20" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-charcoal">No admin accounts yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-muted border-b border-charcoal/10 bg-cream-dark/50">
                  <th className="py-3 pl-5 pr-3 font-medium">Name</th>
                  <th className="py-3 px-3 font-medium">Email</th>
                  <th className="py-3 px-3 font-medium">Role</th>
                  <th className="py-3 px-3 font-medium">Permissions</th>
                  <th className="py-3 pr-5 pl-3 font-medium text-right">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u.id === session.user.id;
                  const role = u.role as "ADMIN" | "SUPER_ADMIN";
                  return (
                    <tr key={u.id} className="border-b border-charcoal/5 last:border-0 hover:bg-cream/40">
                      <td className="py-2.5 pl-5 pr-3 font-medium text-charcoal whitespace-nowrap">
                        {u.name ?? "—"}
                        {isSelf && <span className="ml-1.5 text-[10px] font-normal text-ink-muted">(you)</span>}
                      </td>
                      <td className="py-2.5 px-3 text-charcoal-light whitespace-nowrap">{u.email}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            role === "SUPER_ADMIN" ? "bg-gold/15 text-charcoal" : "bg-olive/10 text-olive-dark"
                          }`}
                        >
                          {role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {role === "SUPER_ADMIN" ? (
                          <span className="text-xs text-ink-muted">Everything</span>
                        ) : u.adminPermissions.length === 0 ? (
                          <span className="text-xs text-ink-muted">None yet</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {u.adminPermissions.map((p) => (
                              <span
                                key={p}
                                className="rounded-full bg-charcoal/5 px-2 py-0.5 text-[10px] text-charcoal-light"
                              >
                                {adminPermissionLabels[p]}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 pr-5 pl-3 text-right">
                        <EditAdminAccessButton
                          userId={u.id}
                          email={u.email}
                          role={role}
                          permissions={u.adminPermissions}
                          isSelf={isSelf}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
