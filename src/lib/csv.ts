// Minimal CSV writer for admin exports (opens cleanly in Excel / Google Sheets).

// A cell that starts with = + - @ (or a tab/CR) is treated as a formula by
// spreadsheet apps — a customer could put "=HYPERLINK(...)" in their name and
// have it run when an admin opens the export. Prefixing an apostrophe makes
// it plain text.
function safeCell(value: unknown): string {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  if (/[",\n\r]/.test(text)) text = `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function toCsv(header: string[], rows: unknown[][]): string {
  // BOM so Excel reads ₹ and non-English names as UTF-8.
  return "﻿" + [header, ...rows].map((row) => row.map(safeCell).join(",")).join("\r\n") + "\r\n";
}

export function csvResponse(filename: string, csv: string): Response {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
