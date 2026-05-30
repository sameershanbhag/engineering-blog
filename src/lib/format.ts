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
