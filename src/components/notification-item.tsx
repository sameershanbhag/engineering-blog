"use client";

import Link from "next/link";
import Image from "next/image";
import { Bookmark, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { initials, formatRelativeTime } from "@/lib/format";
import type { Notification } from "@/lib/types";

const VERB: Record<string, string> = { like: "liked", bookmark: "bookmarked" };
const ICON = { like: Heart, bookmark: Bookmark } as const;

export function NotificationItem({
  notification: n,
  onClick,
}: {
  notification: Notification;
  onClick?: () => void;
}) {
  const Ico = ICON[n.type as keyof typeof ICON] ?? Heart;
  return (
    <Link
      href={`/articles/${n.articleSlug}`}
      onClick={onClick}
      className={cn(
        "flex gap-3 px-4 py-3 transition-colors hover:bg-surface-container",
        !n.read && "bg-primary-container/30",
      )}
    >
      <span className="relative shrink-0">
        {n.actorAvatarUrl ? (
          <Image
            src={n.actorAvatarUrl}
            alt={n.actorName}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-white",
              n.actorAvatarColor,
            )}
          >
            {initials(n.actorName)}
          </span>
        )}
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full ring-2 ring-surface-container-lowest",
            n.type === "like" ? "bg-error text-on-error" : "bg-primary text-on-primary",
          )}
        >
          <Ico className="h-3 w-3" />
        </span>
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm leading-snug text-on-surface">
          <span className="font-semibold">{n.actorName}</span>{" "}
          {VERB[n.type] ?? "interacted with"} your article
        </span>
        <span className="block truncate text-sm text-on-surface-variant">
          “{n.articleTitle}”
        </span>
        <span className="mt-0.5 block text-xs text-on-surface-variant">
          {formatRelativeTime(n.createdAt)}
        </span>
      </span>

      {!n.read && (
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-secondary" />
      )}
    </Link>
  );
}
