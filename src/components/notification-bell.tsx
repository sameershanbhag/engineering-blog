"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Bell, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { NotificationItem } from "./notification-item";
import type { Notification } from "@/lib/types";

export function NotificationBell({ className }: { className?: string }) {
  const { data: session, status } = useSession();
  const token = session?.accessToken;
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.getNotifications(token);
      setItems(res.items);
      setUnread(res.unreadCount);
      setLoaded(true);
    } catch {
      // ignore transient failures; the badge just stays as-is
    }
  }, [token]);

  // Initial load + poll the unread count periodically.
  useEffect(() => {
    if (!token) return;
    refresh();
    const id = setInterval(refresh, 60_000);
    return () => clearInterval(id);
  }, [token, refresh]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    refresh(); // freshen on open
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
  }, [open, refresh]);

  async function markAll() {
    if (!token) return;
    setUnread(0);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.markNotificationsRead(token);
    } catch {
      refresh();
    }
  }

  if (status !== "authenticated" || !token) return null;

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative grid h-9 w-9 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-error px-1 text-[10px] font-bold leading-none text-on-error">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-80 overflow-hidden rounded-lg border border-outline-variant/40 bg-surface-container-lowest shadow-[0_8px_30px_rgba(11,28,48,0.12)] sm:w-96"
        >
          <div className="flex items-center justify-between border-b border-outline-variant/40 px-4 py-3">
            <p className="text-sm font-semibold text-on-surface">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAll}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 divide-y divide-outline-variant/30 overflow-y-auto">
            {!loaded ? (
              <p className="px-4 py-8 text-center text-sm text-on-surface-variant">
                Loading…
              </p>
            ) : items.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-on-surface-variant">
                No notifications yet. Likes and bookmarks on your articles show up
                here.
              </p>
            ) : (
              items.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onClick={() => setOpen(false)}
                />
              ))
            )}
          </div>

          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="block border-t border-outline-variant/40 px-4 py-2.5 text-center text-sm font-medium text-primary hover:bg-surface-container"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
