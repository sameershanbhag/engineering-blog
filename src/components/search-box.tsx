"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Feed search. Submits a GET to "/" with `?q=`, landing on the homepage feed
 * which filters by the query. Reads the current query from the URL to prefill
 * (via window, so static pages aren't forced into dynamic rendering).
 */
export function SearchBox({
  className,
  onSubmit,
}: {
  className?: string;
  onSubmit?: () => void;
}) {
  const pathname = usePathname();
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(new URLSearchParams(window.location.search).get("q") ?? "");
  }, [pathname]);

  return (
    <form action="/" className={cn("relative", className)} onSubmit={onSubmit}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
      <input
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search technical resources…"
        className="h-10 w-full rounded-full border border-outline-variant/60 bg-surface-container-low pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
      />
    </form>
  );
}
