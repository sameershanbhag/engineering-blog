/**
 * Lightweight content processor for article HTML: injects stable `id`s onto
 * <h2> headings and returns a table of contents derived from them. Keeps the
 * mock self-contained without pulling a full markdown/HTML pipeline.
 */

export interface TocEntry {
  id: string;
  text: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function processArticleHtml(html: string): {
  html: string;
  toc: TocEntry[];
} {
  const toc: TocEntry[] = [];
  const processed = html.replace(
    /<h2>(.*?)<\/h2>/g,
    (_match, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      const id = slugify(text);
      toc.push({ id, text });
      return `<h2 id="${id}">${inner}</h2>`;
    },
  );
  return { html: processed, toc };
}
