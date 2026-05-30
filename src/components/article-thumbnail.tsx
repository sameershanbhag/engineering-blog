import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";
import type { Article } from "@/lib/types";

const tones = {
  dark: "bg-code-surface text-secondary",
  indigo: "bg-primary text-on-primary",
  emerald: "bg-secondary text-on-secondary",
  slate: "bg-tertiary text-on-tertiary",
} as const;

/**
 * Article cover. Renders the real image when `coverImageUrl` is set; otherwise a
 * tonal block with a discipline glyph (mirrors the dark "code anchor" imagery
 * from the Stitch mockups).
 */
export function ArticleThumbnail({
  article,
  className,
  sizes = "176px",
}: {
  article: Article;
  className?: string;
  sizes?: string;
}) {
  if (article.coverImageUrl) {
    return (
      <div className={cn("relative overflow-hidden rounded-md", className)}>
        <Image
          src={article.coverImageUrl}
          alt={article.title}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-md",
        tones[article.cover.tone],
        className,
      )}
    >
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />
      <Icon name={article.cover.icon} className="h-10 w-10 opacity-90" />
    </div>
  );
}
