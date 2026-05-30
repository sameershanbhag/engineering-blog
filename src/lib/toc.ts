/**
 * Lightweight content processor for article HTML: injects stable, unique `id`s
 * onto <h2> headings and returns a table of contents derived from them.
 */
import { slugify } from "./format";

export interface TocEntry {
  id: string;
  text: string;
}

export function processArticleHtml(html: string): {
  html: string;
  toc: TocEntry[];
} {
  const toc: TocEntry[] = [];
  const seen = new Map<string, number>();
  const processed = html.replace(
    /<h2>(.*?)<\/h2>/g,
    (_match, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      const base = slugify(text) || "section";
      // Disambiguate duplicate headings so each id is unique.
      const n = seen.get(base) ?? 0;
      seen.set(base, n + 1);
      const id = n === 0 ? base : `${base}-${n + 1}`;
      toc.push({ id, text });
      return `<h2 id="${id}">${inner}</h2>`;
    },
  );
  return { html: processed, toc };
}
