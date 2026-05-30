import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BadgeVariant = "outline" | "tonal" | "accent";

const variants: Record<BadgeVariant, string> = {
  outline:
    "border border-outline-variant text-on-surface-variant hover:bg-surface-container",
  tonal: "bg-surface-container-high text-on-surface-variant",
  accent: "bg-secondary-container text-on-secondary-container",
};

const base =
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium tracking-wide transition-colors";

/** Tag chip. Renders as a Link when `href` is provided, else a span. */
export function Badge({
  className,
  variant = "outline",
  href,
  children,
}: {
  className?: string;
  variant?: BadgeVariant;
  href?: string;
  children: React.ReactNode;
}) {
  const classes = cn(base, variants[variant], className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return <span className={classes}>{children}</span>;
}
