import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "tonal" | "outline" | "ghost" | "accent";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Filled Deep Indigo
  primary: "bg-primary text-on-primary hover:bg-primary/90",
  // Tonal: light indigo bg, indigo text
  tonal:
    "bg-primary-container text-on-primary-container hover:bg-primary-container/70",
  // Outlined
  outline:
    "border border-outline-variant bg-transparent text-on-surface hover:bg-surface-container",
  // Text only
  ghost: "bg-transparent text-on-surface hover:bg-surface-container",
  // Emerald accent CTA
  accent: "bg-secondary text-on-secondary hover:bg-secondary/90",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export interface ButtonLinkProps
  extends React.ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
}

/** Same visual treatment as Button, rendered as a Next.js Link. */
export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
