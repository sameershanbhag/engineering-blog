"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LogOut, PenSquare, User as UserIcon } from "lucide-react";
import { ButtonLink } from "./ui/button";

function initials(nameOrEmail: string) {
  const base = nameOrEmail.includes("@") ? nameOrEmail.split("@")[0] : nameOrEmail;
  return base
    .split(/[\s._-]+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Header account control: avatar + dropdown when signed in, "Sign in" otherwise. */
export function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (status === "loading") {
    return <span className="h-9 w-9 animate-pulse rounded-full bg-surface-container" />;
  }

  if (!session?.user) {
    return (
      <ButtonLink href="/login" size="sm" variant="primary">
        Sign in
      </ButtonLink>
    );
  }

  const user = session.user;
  const label = user.name || user.email || "Account";
  const profileHref = user.handle ? `/authors/${user.handle}` : "/";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-tertiary text-sm font-semibold text-on-tertiary ring-2 ring-surface-container-lowest"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={label}
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        ) : (
          initials(label)
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 overflow-hidden rounded-lg border border-outline-variant/40 bg-surface-container-lowest py-1 shadow-[0_8px_30px_rgba(11,28,48,0.12)]"
        >
          <div className="border-b border-outline-variant/40 px-4 py-3">
            <p className="truncate text-sm font-semibold text-on-surface">
              {user.name || "Engineer"}
            </p>
            {user.email && (
              <p className="truncate text-xs text-on-surface-variant">{user.email}</p>
            )}
          </div>
          <MenuLink href={profileHref} icon={UserIcon}>
            Your profile
          </MenuLink>
          <MenuLink href="/write" icon={PenSquare}>
            Write article
          </MenuLink>
          <button
            type="button"
            role="menuitem"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-on-surface transition-colors hover:bg-surface-container"
          >
            <LogOut className="h-4 w-4 text-on-surface-variant" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: typeof UserIcon;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface transition-colors hover:bg-surface-container"
    >
      <Icon className="h-4 w-4 text-on-surface-variant" />
      {children}
    </Link>
  );
}
