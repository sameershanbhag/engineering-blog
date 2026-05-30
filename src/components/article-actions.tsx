"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Bookmark, Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { formatCompact } from "@/lib/format";

/** Sticky vertical rail of reader actions beside the article. Auth-gated. */
export function ArticleActions({
  slug,
  initialLikes,
  initialLiked = false,
  initialBookmarked = false,
  orientation = "vertical",
}: {
  slug: string;
  initialLikes: number;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
  orientation?: "vertical" | "horizontal";
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialBookmarked);
  const [likes, setLikes] = useState(initialLikes);
  const [pending, setPending] = useState(false);

  const token = session?.accessToken;

  function requireAuth(): boolean {
    if (status === "authenticated" && token) return true;
    router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    return false;
  }

  async function toggleLike() {
    if (pending || !requireAuth()) return;
    const next = !liked;
    setLiked(next);
    setLikes((c) => c + (next ? 1 : -1));
    setPending(true);
    try {
      const res = await api.setLike(slug, next, token!);
      setLiked(res.liked);
      setLikes(res.likes);
    } catch {
      setLiked(!next); // revert
      setLikes((c) => c + (next ? -1 : 1));
    } finally {
      setPending(false);
    }
  }

  async function toggleBookmark() {
    if (pending || !requireAuth()) return;
    const next = !saved;
    setSaved(next);
    setPending(true);
    try {
      const res = await api.setBookmark(slug, next, token!);
      setSaved(res.bookmarked);
    } catch {
      setSaved(!next);
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className={cn(
        "flex gap-2",
        orientation === "vertical" ? "flex-col items-center" : "flex-row items-center",
      )}
    >
      <button
        type="button"
        onClick={toggleLike}
        aria-pressed={liked}
        aria-label="Like article"
        className={cn(
          "flex flex-col items-center gap-1 rounded-full p-2 transition-colors",
          liked
            ? "text-error"
            : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
        )}
      >
        <Heart className={cn("h-5 w-5", liked && "fill-current")} />
        <span className="text-xs font-medium">{formatCompact(likes)}</span>
      </button>

      <button
        type="button"
        onClick={toggleBookmark}
        aria-pressed={saved}
        aria-label="Bookmark article"
        className={cn(
          "rounded-full p-2 transition-colors",
          saved
            ? "text-primary"
            : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
        )}
      >
        <Bookmark className={cn("h-5 w-5", saved && "fill-current")} />
      </button>

      <button
        type="button"
        aria-label="Share article"
        onClick={() => {
          if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href).catch(() => {});
          }
        }}
        className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
      >
        <Share2 className="h-5 w-5" />
      </button>
    </div>
  );
}
