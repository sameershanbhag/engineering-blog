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

/** "Just now", "5m ago", "3h ago", "Yesterday", "4d ago", or a date. */
export function formatRelativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.round(ms / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day === 1) return "Yesterday";
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
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

/** Up-to-2-letter initials from a name or email. Names split on whitespace
 * (so "Jean-Luc Picard" -> "JP"); email local parts split on separators. */
export function initials(nameOrEmail: string): string {
  const isEmail = nameOrEmail.includes("@");
  const parts = isEmail
    ? nameOrEmail.split("@")[0].split(/[._-]+/)
    : nameOrEmail.replace(/^(Dr|Mr|Ms|Mrs)\.?\s+/i, "").split(/\s+/);
  const result = parts
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return result || "?";
}
