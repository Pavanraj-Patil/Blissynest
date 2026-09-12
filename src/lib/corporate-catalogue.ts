import {
  corporateNeeds,
  curatedCollections,
  needToCollectionSlugs,
  whyChooseUsChecklist,
} from "@/lib/corporate-data";

export function getCatalogueFilename(needSlug: string): string {
  return `blissynest-corporate-catalogue-${needSlug || "general"}.html`;
}

export function generateCatalogueHtml(needSlug: string): string {
  const need = corporateNeeds.find((n) => n.slug === needSlug) ?? null;
  const collectionSlugs = needToCollectionSlugs[needSlug] ?? [];
  const collections = curatedCollections.filter((c) =>
    collectionSlugs.includes(c.slug)
  );

  const title = need ? need.title : "Corporate Gifting";
  const subtitle = need ? need.subtitle : "A curated overview of our corporate gifting programme.";

  const collectionsHtml =
    collections.length > 0
      ? collections.map((c) => `<li>${c.title}</li>`).join("\n")
      : `<li>Every collection can be tailored for ${title.toLowerCase()} — let us know your brief and we'll curate a set for you.</li>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Blissynest Corporate Catalogue — ${title}</title>
<style>
  body {
    font-family: Georgia, "Times New Roman", serif;
    background: #f8f3ec;
    color: #2a2621;
    padding: 48px 24px;
  }
  .sheet {
    max-width: 640px;
    margin: 0 auto;
    background: #ffffff;
    border: 1px solid #e9dfcd;
    border-radius: 24px;
    padding: 48px;
  }
  .brand {
    font-size: 22px;
    margin: 0;
  }
  .eyebrow {
    color: #a85830;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 11px;
    font-weight: 600;
    margin: 24px 0 6px;
  }
  h1 {
    font-size: 28px;
    margin: 0 0 6px;
  }
  .subtitle {
    color: #7a7267;
    margin: 0 0 8px;
  }
  h2 {
    font-size: 16px;
    margin-top: 32px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e9dfcd;
  }
  ul {
    padding-left: 20px;
    line-height: 1.9;
    margin: 12px 0 0;
  }
  .footer {
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid #e9dfcd;
    color: #7a7267;
    font-size: 13px;
  }
</style>
</head>
<body>
  <div class="sheet">
    <p class="brand">blissynest</p>
    <p class="eyebrow">Corporate Gifting Catalogue</p>
    <h1>${title}</h1>
    <p class="subtitle">${subtitle}</p>

    <h2>What's included</h2>
    <ul>
      ${whyChooseUsChecklist.map((item) => `<li>${item}</li>`).join("\n      ")}
    </ul>

    <h2>Featured collections for this category</h2>
    <ul>
      ${collectionsHtml}
    </ul>

    <div class="footer">
      <p>Have questions or ready to place a bulk order?</p>
      <p>Email: enquiry@blissynest.com &nbsp;|&nbsp; Phone: 1800-123-456</p>
    </div>
  </div>
</body>
</html>`;
}

export function downloadCatalogue(needSlug: string) {
  const html = generateCatalogueHtml(needSlug);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getCatalogueFilename(needSlug);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
