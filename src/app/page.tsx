import Link from "next/link";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatCompact } from "@/lib/format";
import { FeedArticleCard } from "@/components/feed-article-card";
import { Avatar } from "@/components/avatar";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Disciplines surfaced as quick filter chips on the feed.
const FILTER_SLUGS = ["software", "hardware", "civil-systems", "mechanical", "electrical"];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ discipline?: string; q?: string }>;
}) {
  const { discipline, q } = await searchParams;
  const [articles, disciplines, topics, contributors] = await Promise.all([
    api.listArticles({ discipline, q }),
    api.listDisciplines(),
    api.trendingTopics(),
    api.topContributors(),
  ]);

  const filterChips = [
    { slug: undefined, name: "All" },
    ...FILTER_SLUGS.map((s) => disciplines.find((d) => d.slug === s)).filter(
      (d): d is NonNullable<typeof d> => Boolean(d),
    ),
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Discipline filter chips */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        {filterChips.map((d) => {
          const active = d.slug === discipline;
          return (
            <Link
              key={d.slug ?? "all"}
              href={d.slug ? `/?discipline=${d.slug}` : "/"}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-on-primary"
                  : "border border-outline-variant text-on-surface-variant hover:bg-surface-container",
              )}
            >
              {d.name}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Feed */}
        <div>
          {q && (
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-outline-variant/40 pb-4">
              <p className="text-sm text-on-surface-variant">
                <span className="font-semibold text-on-surface">
                  {articles.length}
                </span>{" "}
                {articles.length === 1 ? "result" : "results"} for{" "}
                <span className="font-semibold text-on-surface">“{q}”</span>
              </p>
              <Link
                href="/"
                className="text-sm font-medium text-primary hover:underline"
              >
                Clear
              </Link>
            </div>
          )}

          {articles.length === 0 ? (
            <p className="py-16 text-center text-on-surface-variant">
              {q
                ? `No articles match “${q}”.`
                : "No articles in this discipline yet."}
            </p>
          ) : (
            articles.map((article) => (
              <FeedArticleCard key={article.slug} article={article} />
            ))
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card className="bg-surface-container-low">
            <CardBody>
              <h2 className="text-base font-semibold text-on-surface">
                Trending Topics
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {topics.map((t) => (
                  <Badge key={t.tag} href={`/explore?tag=${t.tag}`} variant="outline">
                    #{t.tag}
                  </Badge>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card className="bg-surface-container-low">
            <CardBody>
              <h2 className="text-base font-semibold text-on-surface">
                Top Contributors
              </h2>
              <ul className="mt-4 space-y-4">
                {contributors.map((author) => (
                  <li key={author.handle}>
                    <Link
                      href={`/authors/${author.handle}`}
                      className="group flex items-center gap-3"
                    >
                      <Avatar author={author} size="md" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-on-surface group-hover:text-primary">
                          {author.name}
                        </span>
                        <span className="block truncate text-xs text-on-surface-variant">
                          {author.title}
                        </span>
                      </span>
                      <span className="ml-auto text-xs font-medium text-on-surface-variant">
                        {formatCompact(author.stats.followers)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </aside>
      </div>
    </div>
  );
}
