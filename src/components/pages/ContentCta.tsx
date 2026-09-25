import { PageCta } from "@/components/pages/PageCta";

// The closing banner, filled from a page's "Closing Banner" section in Site
// Content. Renders nothing when the section is switched off.
export function ContentCta({
  content,
  visible = true,
}: {
  content: Record<string, unknown>;
  visible?: boolean;
}) {
  if (!visible) return null;
  const str = (k: string) => (content[k] as string) ?? "";
  const primary = { label: str("primaryLabel"), href: str("primaryHref") };
  const secondary = { label: str("secondaryLabel"), href: str("secondaryHref") };
  if (!str("title") || !primary.label || !primary.href) return null;
  return (
    <PageCta
      title={str("title")}
      body={str("body")}
      primary={primary}
      secondary={secondary.label && secondary.href ? secondary : undefined}
    />
  );
}
