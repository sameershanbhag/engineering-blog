/** Formatting helpers shared across the UI. */

export function formatDate(iso: string): string {
  // Parse as UTC-noon to avoid timezone-induced off-by-one day shifts.
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** 14200 -> "14.2k", 980 -> "980". */
export function formatCompact(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k % 1 === 0 ? k : k.toFixed(1)}k`;
}

/** Lowercase, hyphenate, strip tags, cap length. Shared by api + TOC. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Up-to-2-letter initials from a name or email (honorifics + separators handled). */
export function initials(nameOrEmail: string): string {
  const base = nameOrEmail.includes("@")
    ? nameOrEmail.split("@")[0]
    : nameOrEmail;
  const result = base
    .replace(/^(Dr|Mr|Ms|Mrs)\.?\s+/i, "")
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return result || "?";
}
