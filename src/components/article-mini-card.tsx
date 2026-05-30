import Link from "next/link";
import { Clock, Heart } from "lucide-react";
import { formatDate, formatCompact } from "@/lib/format";
import type { Article } from "@/lib/types";

/** Compact article card used in Further Reading and profile grids. */
export function ArticleMiniCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex h-full flex-col rounded-lg bg-surface-container-lowest p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(11,28,48,0.06)]"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
        {article.category}
      </p>
      <h3 className="mt-2 text-lg font-semibold leading-snug text-on-surface group-hover:text-primary">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-on-surface-variant">
        {article.excerpt}
      </p>
      <div className="mt-4 flex items-center gap-4 pt-2 text-xs text-on-surface-variant">
        <span>{formatDate(article.publishedAt)}</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {article.readingMinutes} min read
        </span>
        <span className="ml-auto inline-flex items-center gap-1">
          <Heart className="h-3.5 w-3.5" />
          {formatCompact(article.likes)}
        </span>
      </div>
    </Link>
  );
}
