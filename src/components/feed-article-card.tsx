import Link from "next/link";
import { Clock } from "lucide-react";
import { Avatar } from "./avatar";
import { ArticleThumbnail } from "./article-thumbnail";
import { formatDate } from "@/lib/format";
import type { Article } from "@/lib/types";

/** Horizontal feed item used on the homepage feed. */
export function FeedArticleCard({ article }: { article: Article }) {
  return (
    <article className="group border-b border-outline-variant/40 py-8 first:pt-0">
      <div className="flex gap-6">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            {article.category}
            <span className="mx-1.5 text-outline">·</span>
            <span className="font-medium normal-case">
              {formatDate(article.publishedAt)}
            </span>
          </p>

          <h2 className="mt-2 text-2xl font-semibold leading-snug text-on-surface">
            <Link
              href={`/articles/${article.slug}`}
              className="transition-colors group-hover:text-primary"
            >
              {article.title}
            </Link>
          </h2>

          <p className="mt-2 line-clamp-2 text-on-surface-variant">
            {article.excerpt}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <Link
              href={`/authors/${article.author.handle}`}
              className="flex items-center gap-2"
            >
              <Avatar author={article.author} size="sm" />
              <span className="text-sm font-medium text-on-surface hover:text-primary">
                {article.author.name}
              </span>
            </Link>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-secondary-container px-2.5 py-1 text-xs font-medium text-on-secondary-container">
              <Clock className="h-3.5 w-3.5" />
              {article.readingMinutes} min read
            </span>
          </div>
        </div>

        <Link
          href={`/articles/${article.slug}`}
          className="hidden shrink-0 sm:block"
          aria-hidden
          tabIndex={-1}
        >
          <ArticleThumbnail
            article={article}
            className="h-32 w-44 transition-transform group-hover:scale-[1.02]"
          />
        </Link>
      </div>
    </article>
  );
}
