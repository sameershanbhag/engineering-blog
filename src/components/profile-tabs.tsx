"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { ArticleMiniCard } from "./article-mini-card";
import { Button } from "./ui/button";
import type { Article, Author } from "@/lib/types";

export function ProfileTabs({
  author,
  articles,
  isOwner,
  accessToken,
}: {
  author: Author;
  articles: Article[];
  isOwner: boolean;
  accessToken?: string;
}) {
  const tabs = isOwner
    ? (["Published Articles", "Drafts", "Bookmarked", "About"] as const)
    : (["Published Articles", "About"] as const);
  type Tab = (typeof tabs)[number];
  const [tab, setTab] = useState<Tab>("Published Articles");

  // Lazily-loaded, owner-only collections.
  const [drafts, setDrafts] = useState<Article[] | null>(null);
  const [bookmarks, setBookmarks] = useState<Article[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOwner || !accessToken) return;
    if (tab === "Drafts" && drafts === null) {
      setLoading(true);
      api.myDrafts(accessToken).then(setDrafts).catch(() => setDrafts([])).finally(() => setLoading(false));
    }
    if (tab === "Bookmarked" && bookmarks === null) {
      setLoading(true);
      api
        .myBookmarks(accessToken)
        .then(setBookmarks)
        .catch(() => setBookmarks([]))
        .finally(() => setLoading(false));
    }
  }, [tab, isOwner, accessToken, drafts, bookmarks]);

  return (
    <div className="mt-8">
      <div className="flex gap-6 border-b border-outline-variant/40">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "relative -mb-px pb-3 text-sm font-medium transition-colors",
              tab === t
                ? "text-primary"
                : "text-on-surface-variant hover:text-on-surface",
            )}
          >
            {t}
            {tab === t && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "About" ? (
          <div className="max-w-2xl space-y-4 text-on-surface-variant">
            <p className="text-lg leading-relaxed text-on-surface">
              {author.bio || "This engineer hasn’t written a bio yet."}
            </p>
            {author.github && (
              <p className="text-sm">
                On the web:{" "}
                <a
                  href={`https://${author.github}`}
                  className="font-medium text-primary hover:underline"
                >
                  {author.github}
                </a>
              </p>
            )}
          </div>
        ) : tab === "Published Articles" ? (
          <ArticleGrid
            articles={articles}
            empty="No published articles yet."
            showLoadMore={articles.length > 0}
          />
        ) : tab === "Drafts" ? (
          loading && drafts === null ? (
            <Loading />
          ) : (
            <ArticleGrid
              articles={drafts ?? []}
              empty="No drafts yet. Start writing!"
              draftBadge
            />
          )
        ) : loading && bookmarks === null ? (
          <Loading />
        ) : (
          <ArticleGrid
            articles={bookmarks ?? []}
            empty="No bookmarked articles yet."
          />
        )}
      </div>
    </div>
  );
}

function ArticleGrid({
  articles,
  empty,
  showLoadMore = false,
  draftBadge = false,
}: {
  articles: Article[];
  empty: string;
  showLoadMore?: boolean;
  draftBadge?: boolean;
}) {
  if (articles.length === 0) {
    return <p className="py-12 text-center text-on-surface-variant">{empty}</p>;
  }
  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {articles.map((a) => (
          <div key={a.slug} className="relative">
            {draftBadge && (
              <span className="absolute right-3 top-3 z-10 rounded-full bg-surface-container-highest px-2 py-0.5 text-xs font-medium text-on-surface-variant">
                Draft
              </span>
            )}
            <ArticleMiniCard article={a} />
          </div>
        ))}
      </div>
      {showLoadMore && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline">Load More Papers</Button>
        </div>
      )}
    </>
  );
}

function Loading() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="h-40 animate-pulse rounded-lg bg-surface-container-low"
        />
      ))}
    </div>
  );
}
