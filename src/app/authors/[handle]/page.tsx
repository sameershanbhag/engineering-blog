import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { api } from "@/lib/api";
import { auth } from "@/auth";
import { formatCompact } from "@/lib/format";
import { Avatar } from "@/components/avatar";
import { Button, ButtonLink } from "@/components/ui/button";
import { ProfileTabs } from "@/components/profile-tabs";
import { EditProfile } from "@/components/edit-profile";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const author = await api.getAuthor(handle);
  return {
    title: author
      ? `${author.name} — The Engineering Commons`
      : "Author not found",
  };
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-lg font-bold text-on-surface">
        {formatCompact(value)}
      </span>
      <span className="text-sm text-on-surface-variant">{label}</span>
    </div>
  );
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const [author, session] = await Promise.all([api.getAuthor(handle), auth()]);
  if (!author) notFound();

  const articles = await api.authorArticles(handle);
  const isOwner = session?.user?.handle === handle;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
      {/* Profile header card */}
      <section className="rounded-xl bg-surface-container-low p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Avatar author={author} size="xl" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-on-surface">
                  {author.name}
                </h1>
                <p className="text-sm text-on-surface-variant">@{author.handle}</p>
              </div>
              <div className="flex gap-2">
                {isOwner ? (
                  <>
                    <EditProfile author={author} />
                    <ButtonLink href="/write" variant="primary">
                      Write article
                    </ButtonLink>
                  </>
                ) : (
                  <>
                    <Button variant="primary">Follow</Button>
                    <Button variant="outline">Message</Button>
                  </>
                )}
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-on-surface-variant">{author.bio}</p>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
              <Stat value={author.stats.engagements} label="Engagements" />
              <Stat value={author.stats.followers} label="Followers" />
              <Stat value={author.stats.following} label="Following" />
              {author.github && (
                <a
                  href={`https://${author.github}`}
                  className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                  {author.github.replace("github.com/", "")}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <ProfileTabs
        author={author}
        articles={articles}
        isOwner={isOwner}
        accessToken={session?.accessToken}
      />
    </div>
  );
}
