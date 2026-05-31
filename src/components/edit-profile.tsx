"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Pencil, X } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "./ui/button";
import { Input, Textarea } from "./ui/input";
import type { Author } from "@/lib/types";

const BIO_MAX = 600;

/** Owner-only "Edit profile" button + modal to update headline, bio, GitHub. */
export function EditProfile({ author }: { author: Author }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(author.title);
  const [bio, setBio] = useState(author.bio);
  const [github, setGithub] = useState(author.github ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openModal() {
    setTitle(author.title);
    setBio(author.bio);
    setGithub(author.github ?? "");
    setError(null);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const token = session?.accessToken;
    if (!token) {
      setError("Your session expired. Please sign in again.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.updateProfile(
        { title: title.trim(), bio: bio.trim(), github: github.trim() },
        token,
      );
      setOpen(false);
      router.refresh();
    } catch {
      setError("Couldn’t save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Button variant="outline" onClick={openModal}>
        <Pencil className="h-4 w-4" />
        Edit profile
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-xl bg-surface-container-lowest p-6 shadow-[0_8px_40px_rgba(11,28,48,0.25)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface">Edit profile</h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={save} className="mt-5 grid gap-4">
              {error && (
                <p className="rounded-md bg-error-container px-3 py-2 text-sm text-on-error-container">
                  {error}
                </p>
              )}

              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-on-surface">
                  Headline
                </span>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={120}
                  placeholder="e.g. Staff Engineer at DataStream"
                />
              </label>

              <label className="grid gap-1.5">
                <span className="flex items-center justify-between text-sm font-medium text-on-surface">
                  Bio
                  <span className="text-xs font-normal text-on-surface-variant">
                    {bio.length}/{BIO_MAX}
                  </span>
                </span>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
                  rows={4}
                  placeholder="Tell people what you build and write about…"
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-on-surface">GitHub</span>
                <Input
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  maxLength={200}
                  placeholder="your-username"
                />
              </label>

              <div className="mt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
