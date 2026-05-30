import { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { api } from "@/lib/api";
import { auth } from "@/auth";
import { processArticleHtml } from "@/lib/toc";
import { formatDate } from "@/lib/format";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/ui/badge";
import { ReadingProgress } from "@/components/reading-progress";
import { ArticleActions } from "@/components/article-actions";
import { ArticleMiniCard } from "@/components/article-mini-card";

// Memoized per request so generateMetadata and the page share one auth() +
// getArticle round-trip (the token path is no-store, so React fetch dedup alone
// wouldn't help).
const loadArticle = cache(async (slug: string) => {
  const session = await auth();
  const article = await api.getArticle(slug, session?.accessToken);
  return { article };
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { article } = await loadArticle(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: `${article.title} — The Engineering Commons`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Article (memoized, shared with generateMetadata) + related, in parallel.
  const [{ article }, related] = await Promise.all([
    loadArticle(slug),
    api.relatedArticles(slug),
  ]);
  if (!article) notFound();
  const { html, toc } = processArticleHtml(article.contentHtml);

  return (
    <>
      <ReadingProgress />

      <article className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[3rem_minmax(0,1fr)_15rem] lg:gap-8">
          {/* Action rail */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <ArticleActions
                slug={article.slug}
                initialLikes={article.likes}
                initialLiked={article.liked}
                initialBookmarked={article.bookmarked}
              />
            </div>
          </div>

          {/* Article body */}
          <div className="mx-auto w-full max-w-[45rem]">
            <Badge href={`/?discipline=${article.discipline.slug}`} variant="accent">
              {article.discipline.name}
            </Badge>

            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-on-surface sm:text-[2.75rem]">
              {article.title}
            </h1>

            <div className="mt-6 flex items-center gap-3 border-b border-outline-variant/40 pb-6">
              <Link href={`/authors/${article.author.handle}`}>
                <Avatar author={article.author} size="lg" />
              </Link>
              <div>
                <Link
                  href={`/authors/${article.author.handle}`}
                  className="font-semibold text-on-surface hover:text-primary"
                >
                  {article.author.name}
                </Link>
                <p className="text-sm text-on-surface-variant">
                  {formatDate(article.publishedAt)} · {article.readingMinutes} min
                  read
                </p>
              </div>
            </div>

            <div
              className="prose-article mt-8"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* Tags */}
            <div className="mt-10 flex flex-wrap gap-2 border-t border-outline-variant/40 pt-6">
              {article.tags.map((tag) => (
                <Badge key={tag} href={`/explore?tag=${tag}`} variant="tonal">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Mobile actions */}
            <div className="mt-6 lg:hidden">
              <ArticleActions
                slug={article.slug}
                initialLikes={article.likes}
                initialLiked={article.liked}
                initialBookmarked={article.bookmarked}
                orientation="horizontal"
              />
            </div>
          </div>

          {/* On this page */}
          <aside className="hidden lg:block">
            {toc.length > 0 && (
              <div className="sticky top-24">
                <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  On this page
                </p>
                <ul className="mt-3 space-y-2 border-l border-outline-variant/50">
                  {toc.map((entry) => (
                    <li key={entry.id}>
                      <a
                        href={`#${entry.id}`}
                        className="-ml-px block border-l-2 border-transparent pl-3 text-sm text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                      >
                        {entry.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {/* Further reading */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-outline-variant/40 pt-10">
            <h2 className="text-2xl font-semibold text-on-surface">
              Further Reading
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ArticleMiniCard key={r.slug} article={r} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
