"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";
import { ThemeToggle } from "./theme-toggle";
import { SearchBox } from "./search-box";
import { UserMenu } from "./user-menu";
import { NotificationBell } from "./notification-bell";

const NAV = [
  { href: "/", label: "Feed" },
  { href: "/explore", label: "Explore" },
  { href: "/write", label: "Write" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile menu on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close on Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant/40 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-4 sm:gap-6 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-primary">
            <span className="hidden sm:inline">The Engineering Commons</span>
            <span className="sm:hidden">TEC</span>
          </span>
        </Link>

        {/* Desktop search */}
        <SearchBox className="hidden flex-1 md:block md:max-w-md" />

        {/* Desktop nav */}
        <nav className="ml-auto hidden items-center gap-1 md:flex lg:gap-2">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-on-surface",
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}

          <ThemeToggle className="ml-1" />

          <NotificationBell />

          <UserMenu />
        </nav>

        {/* Mobile controls */}
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <NotificationBell />
          <ThemeToggle />
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="border-t border-outline-variant/40 bg-surface md:hidden">
          <div className="mx-auto max-w-[1280px] space-y-4 px-4 py-4 sm:px-6">
            <SearchBox onSubmit={() => setMobileOpen(false)} />
            <nav className="flex flex-col">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-base font-medium transition-colors",
                      active
                        ? "bg-primary-container text-on-primary-container"
                        : "text-on-surface hover:bg-surface-container",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-1 border-t border-outline-variant/40 pt-1">
                {session?.user ? (
                  <>
                    <Link
                      href={
                        session.user.handle
                          ? `/authors/${session.user.handle}`
                          : "/"
                      }
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium text-on-surface hover:bg-surface-container"
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-tertiary text-xs font-semibold text-on-tertiary">
                        {initials(session.user.name || session.user.email || "U")}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate">
                          {session.user.name || "Your profile"}
                        </span>
                        {session.user.email && (
                          <span className="block truncate text-xs font-normal text-on-surface-variant">
                            {session.user.email}
                          </span>
                        )}
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-base font-medium text-on-surface hover:bg-surface-container"
                    >
                      <span className="grid h-8 w-8 place-items-center">
                        <LogOut className="h-5 w-5 text-on-surface-variant" />
                      </span>
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-center rounded-md bg-primary px-3 py-2.5 text-base font-medium text-on-primary"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
