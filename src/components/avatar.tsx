import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Author } from "@/lib/types";

const sizes = {
  sm: { cls: "h-8 w-8 text-xs", px: 32 },
  md: { cls: "h-10 w-10 text-sm", px: 40 },
  lg: { cls: "h-14 w-14 text-base", px: 56 },
  xl: { cls: "h-24 w-24 text-2xl", px: 96 },
} as const;

function initials(name: string) {
  return name
    .replace(/^(Dr|Mr|Ms|Mrs)\.?\s+/i, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Author avatar. Renders the real photo when `avatarUrl` is set, otherwise a
 * generated initials chip (theme-stable background).
 */
export function Avatar({
  author,
  size = "md",
  className,
}: {
  author: Author;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const { cls, px } = sizes[size];
  const ring = "ring-2 ring-surface-container-lowest";

  if (author.avatarUrl) {
    return (
      <Image
        src={author.avatarUrl}
        alt={author.name}
        width={px}
        height={px}
        className={cn("shrink-0 rounded-full object-cover", ring, cls, className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        ring,
        author.avatarColor,
        cls,
        className,
      )}
      aria-label={author.name}
    >
      {initials(author.name)}
    </span>
  );
}
