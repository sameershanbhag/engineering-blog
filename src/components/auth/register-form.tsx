"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { registerUser } from "@/lib/auth-actions";
import { OAuthButtons, hasOAuth, type OAuthFlags } from "./oauth-buttons";
import { OrDivider } from "./auth-shell";

export function RegisterForm({
  oauth,
  callbackUrl,
}: {
  oauth: OAuthFlags;
  callbackUrl: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await registerUser({ name, email, password });
      if (!result.ok) {
        setError(result.error ?? "Registration failed.");
        return;
      }
      // Auto sign-in with the new credentials.
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        // Account created but auto-login failed — send them to login.
        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }
      router.refresh();
      router.push(callbackUrl);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <OAuthButtons oauth={oauth} callbackUrl={callbackUrl} />
      {hasOAuth(oauth) && <OrDivider />}

      <form onSubmit={onSubmit} className="grid gap-4">
        {error && (
          <div className="flex items-start gap-2 rounded-md bg-error-container px-3 py-2.5 text-sm text-on-error-container">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-on-surface">Name</span>
          <Input
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-on-surface">Email</span>
          <Input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-on-surface">Password</span>
          <Input
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
        </label>

        <Button type="submit" disabled={submitting} className="mt-1 w-full" size="lg">
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </div>
  );
}
