import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Bell } from "lucide-react";
import { auth } from "@/auth";
import { api, ApiError } from "@/lib/api";
import type { NotificationsResponse } from "@/lib/types";
import { NotificationItem } from "@/components/notification-item";
import { MarkAllReadButton } from "@/components/mark-all-read-button";
import { SessionExpiredNotice } from "@/components/session-expired-notice";

export const metadata: Metadata = {
  title: "Notifications — The Engineering Commons",
};

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user || !session.accessToken) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/notifications")}`);
  }

  let data: NotificationsResponse | null = null;
  try {
    data = await api.getNotifications(session.accessToken);
  } catch (err) {
    // Stale/expired backend token: show a re-auth prompt instead of crashing
    // (redirecting to /login would loop, since the NextAuth session is valid).
    if (!(err instanceof ApiError && err.status === 401)) throw err;
  }

  const items = data?.items ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-on-surface">Notifications</h1>
        {unreadCount > 0 && <MarkAllReadButton />}
      </div>

      <div className="mt-6 divide-y divide-outline-variant/30 overflow-hidden rounded-lg border border-outline-variant/40 bg-surface-container-lowest">
        {data === null ? (
          <SessionExpiredNotice />
        ) : items.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <Bell className="mx-auto h-8 w-8 text-on-surface-variant/50" />
            <p className="mt-3 text-on-surface-variant">
              No notifications yet.
            </p>
            <p className="text-sm text-on-surface-variant/80">
              When someone likes or bookmarks your articles, you’ll see it here.
            </p>
          </div>
        ) : (
          items.map((n) => <NotificationItem key={n.id} notification={n} />)
        )}
      </div>
    </div>
  );
}
