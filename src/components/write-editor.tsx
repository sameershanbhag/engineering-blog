"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { Button } from "./ui/button";
import { Card, CardBody } from "./ui/card";
import { RichTextEditor } from "./rich-text-editor";
import type { CreateArticleInput, Discipline } from "@/lib/types";

type Status =
  | { kind: "idle" }
  | { kind: "submitting"; action: "published" | "draft" }
  | { kind: "success"; action: "published" | "draft"; title: string; slug: string }
  | { kind: "error"; message: string };

const VISIBILITY: { value: CreateArticleInput["visibility"]; label: string }[] = [
  { value: "public", label: "Public" },
  { value: "unlisted", label: "Unlisted" },
  { value: "draft", label: "Draft only" },
];

export function WriteEditor({
  disciplines,
  authorName,
  accessToken,
}: {
  disciplines: Discipline[];
  authorName?: string;
  accessToken?: string;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState(""); // HTML from the rich-text editor
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState("");
  const [featured, setFeatured] = useState(false);
  const [visibility, setVisibility] =
    useState<CreateArticleInput["visibility"]>("public");
  const [disciplineSlug, setDisciplineSlug] = useState(
    disciplines.find((d) => d.slug === "software")?.slug ?? disciplines[0]?.slug ?? "",
  );
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const submitting = status.kind === "submitting";

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && tagDraft.trim()) {
      e.preventDefault();
      const t = tagDraft.trim().replace(/^#/, "");
      if (t && !tags.includes(t) && tags.length < 5) setTags([...tags, t]);
      setTagDraft("");
    }
  }

  // The editor emits HTML; check for actual text, not just empty markup.
  const bodyIsEmpty = body.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() === "";

  async function submit(action: "published" | "draft") {
    if (!title.trim() || bodyIsEmpty) {
      setStatus({
        kind: "error",
        message: "Add a title and some content before publishing.",
      });
      return;
    }
    setStatus({ kind: "submitting", action });
    try {
      const result = await api.createArticle(
        {
          title: title.trim(),
          body: body.trim(),
          disciplineSlug,
          tags,
          visibility: action === "draft" ? "draft" : visibility,
          featuredImage: featured,
          status: action,
        },
        accessToken,
      );
      setStatus({
        kind: "success",
        action,
        title: result.title,
        slug: result.slug,
      });
    } catch {
      setStatus({
        kind: "error",
        message: "Something went wrong submitting your article. Please try again.",
      });
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* Editor column */}
      <div>
        {/* Status banner */}
        {status.kind === "success" && (
          <div className="mb-5 flex items-start gap-3 rounded-lg bg-secondary-container px-4 py-3 text-on-secondary-container">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">
                {status.action === "published"
                  ? "Article published!"
                  : "Draft saved!"}
              </p>
              <p className="opacity-90">
                “{status.title}” —{" "}
                {status.action === "published" ? (
                  <Link
                    href={`/articles/${status.slug}`}
                    className="font-medium underline"
                  >
                    view your article
                  </Link>
                ) : (
                  <Link href="/write" className="font-medium underline">
                    keep editing
                  </Link>
                )}
              </p>
            </div>
          </div>
        )}
        {status.kind === "error" && (
          <div className="mb-5 flex items-start gap-3 rounded-lg bg-error-container px-4 py-3 text-on-error-container">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{status.message}</p>
          </div>
        )}

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article Title"
          className="w-full bg-transparent text-4xl font-bold tracking-tight text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none sm:text-5xl"
        />

        <Card className="mt-6 overflow-hidden border border-outline-variant/40 bg-surface-container-lowest">
          <RichTextEditor
            value={body}
            onChange={setBody}
            placeholder="Start writing your engineering insights here…"
          />
        </Card>
      </div>

      {/* Settings sidebar */}
      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <Card className="bg-surface-container-low">
          <CardBody className="space-y-3">
            <Button
              variant="primary"
              className="w-full"
              disabled={submitting}
              onClick={() => submit("published")}
            >
              <Send className="h-4 w-4" />
              {status.kind === "submitting" && status.action === "published"
                ? "Publishing…"
                : "Publish Article"}
            </Button>
            <Button
              variant="tonal"
              className="w-full"
              disabled={submitting}
              onClick={() => submit("draft")}
            >
              {status.kind === "submitting" && status.action === "draft"
                ? "Saving…"
                : "Save Draft"}
            </Button>
            <p className="text-center text-xs text-on-surface-variant">
              {status.kind === "success" ? "Last saved · Just now" : "Not saved yet"}
            </p>
            {authorName && (
              <p className="text-center text-xs text-on-surface-variant">
                Publishing as{" "}
                <span className="font-medium text-on-surface">{authorName}</span>
              </p>
            )}
          </CardBody>
        </Card>

        <Card className="bg-surface-container-low">
          <CardBody className="space-y-5">
            <h2 className="text-sm font-semibold text-on-surface">
              Publishing Settings
            </h2>

            <Field label="Visibility">
              <select
                value={visibility}
                onChange={(e) =>
                  setVisibility(e.target.value as CreateArticleInput["visibility"])
                }
                className="h-10 w-full rounded-md border-[1.5px] border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface focus:border-primary focus:outline-none"
              >
                {VISIBILITY.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Primary Discipline">
              <select
                value={disciplineSlug}
                onChange={(e) => setDisciplineSlug(e.target.value)}
                className="h-10 w-full rounded-md border-[1.5px] border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface focus:border-primary focus:outline-none"
              >
                {disciplines.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Tags (up to 5)">
              <input
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={addTag}
                placeholder="Add a tag…"
                className="h-10 w-full rounded-md border-[1.5px] border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary focus:outline-none"
              />
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-2.5 py-1 text-xs font-medium text-on-surface-variant"
                    >
                      #{t}
                      <button
                        type="button"
                        aria-label={`Remove ${t}`}
                        onClick={() => setTags(tags.filter((x) => x !== t))}
                        className="text-on-surface-variant hover:text-error"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Field>

            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface">Include Featured Image</span>
              <button
                type="button"
                role="switch"
                aria-checked={featured}
                onClick={() => setFeatured((v) => !v)}
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors",
                  featured ? "bg-primary" : "bg-outline-variant",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                    featured && "translate-x-5",
                  )}
                />
              </button>
            </div>
          </CardBody>
        </Card>
      </aside>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-on-surface-variant">
        {label}
      </span>
      {children}
    </label>
  );
}
