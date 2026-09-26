import { getBusinessDetails, getPageContent } from "@/lib/content-service";
import type { EmailContext, EmailCopy } from "@/lib/email-templates";

// The editable email wording (Admin > Site Content > Emails) plus the support
// details shown in every email's footer.
export async function getEmailContext(): Promise<EmailContext> {
  const [content, business] = await Promise.all([getPageContent("emails"), getBusinessDetails()]);
  const copy: EmailCopy = {};
  for (const [section, fields] of Object.entries(content)) {
    copy[section] = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, String(v ?? "")]));
  }
  return {
    copy,
    business: {
      contactEmail: business.contactEmail ?? "",
      contactPhone: business.contactPhone ?? "",
      address: business.address ?? "",
    },
  };
}
