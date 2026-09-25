import type { JournalBlock } from "@/lib/journal-posts";

// Journal bodies are edited as plain text in the admin, using a tiny markup:
//   ## A heading
//   - a bullet            (consecutive lines make one list)
//   1. a numbered step    (consecutive lines make one list)
//   > a pull quote
//   anything else          a paragraph (blank lines separate paragraphs)
export function parseMarkup(text: string): JournalBlock[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: JournalBlock[] = [];
  let para: string[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushPara = () => {
    if (para.length) blocks.push({ type: "p", text: para.join(" ") });
    para = [];
  };
  const flushList = () => {
    if (list) blocks.push({ type: list.type, items: list.items });
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    if (line.startsWith("## ")) {
      flushPara();
      flushList();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
    } else if (line.startsWith("> ")) {
      flushPara();
      flushList();
      blocks.push({ type: "quote", text: line.slice(2).trim() });
    } else if (/^[-*] /.test(line)) {
      flushPara();
      if (list?.type !== "ul") {
        flushList();
        list = { type: "ul", items: [] };
      }
      list.items.push(line.slice(2).trim());
    } else if (/^\d+[.)] /.test(line)) {
      flushPara();
      if (list?.type !== "ol") {
        flushList();
        list = { type: "ol", items: [] };
      }
      list.items.push(line.replace(/^\d+[.)] /, "").trim());
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return blocks;
}

export function blocksToMarkup(blocks: JournalBlock[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "h2":
          return `## ${b.text}`;
        case "quote":
          return `> ${b.text}`;
        case "ul":
          return b.items.map((i) => `- ${i}`).join("\n");
        case "ol":
          return b.items.map((i, n) => `${n + 1}. ${i}`).join("\n");
        default:
          return b.text;
      }
    })
    .join("\n\n");
}
