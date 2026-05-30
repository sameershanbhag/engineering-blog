import * as React from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-md border-[1.5px] border-outline-variant bg-surface-container-lowest px-3.5 text-on-surface placeholder:text-on-surface-variant/70 transition-colors focus:border-primary focus:outline-none";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input className={cn(fieldBase, "h-11", className)} {...props} />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={cn(fieldBase, "py-2.5 resize-y", className)} {...props} />
  );
}
