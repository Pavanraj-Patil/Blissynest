import Link from "next/link";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getEmailContext } from "@/lib/email-context";
import { buildSampleEmail, emailTypes } from "@/lib/email-samples";
import { isEmailConfigured } from "@/lib/email";
import { EmailPreviews } from "./EmailPreviews";

export default async function AdminEmailsPage() {
  const session = await requireAdmin("content");
  const ctx = await getEmailContext();
  const previews = emailTypes.map((t) => {
    const email = buildSampleEmail(t.key, ctx);
    return { key: t.key, label: t.label, subject: email.subject, html: email.html };
  });

  return (
    <div className="max-w-[1100px] mx-auto space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Emails</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Preview every email the site sends, using an example order. To change the wording, open{" "}
          <Link href="/admin/content?page=emails" className="font-medium text-terracotta-dark hover:text-terracotta">
            Site Content, Emails
          </Link>
          . The support email and phone in each footer come from Legal &amp; Business.
        </p>
      </div>
      <EmailPreviews
        previews={previews}
        canSend={isEmailConfigured()}
        adminEmail={session.user?.email ?? ""}
      />
    </div>
  );
}
