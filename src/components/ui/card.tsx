import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Card — borderless tonal surface (M3). Sits as a lighter/raised tone against
 * the page background; 24px internal padding by default.
 */
export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg bg-surface-container-lowest text-on-surface",
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}
