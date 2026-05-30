"use client";

import { signIn } from "next-auth/react";
import { GitHubIcon, GoogleIcon } from "./brand-icons";

export interface OAuthFlags {
  github: boolean;
  google: boolean;
}

/**
 * OAuth provider buttons. Only renders providers that are configured via env.
 * Returns null when none are enabled (the form hides its divider in that case).
 */
export function OAuthButtons({
  oauth,
  callbackUrl,
}: {
  oauth: OAuthFlags;
  callbackUrl: string;
}) {
  if (!oauth.github && !oauth.google) return null;

  return (
    <div className="grid gap-3">
      {oauth.github && (
        <button
          type="button"
          onClick={() => signIn("github", { callbackUrl })}
          className="inline-flex h-11 items-center justify-center gap-2.5 rounded-md border border-outline-variant bg-surface-container-lowest text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
        >
          <GitHubIcon className="h-5 w-5" />
          Continue with GitHub
        </button>
      )}
      {oauth.google && (
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="inline-flex h-11 items-center justify-center gap-2.5 rounded-md border border-outline-variant bg-surface-container-lowest text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
        >
          <GoogleIcon className="h-5 w-5" />
          Continue with Google
        </button>
      )}
    </div>
  );
}

/** True when at least one OAuth provider is enabled (controls divider). */
export function hasOAuth(oauth: OAuthFlags) {
  return oauth.github || oauth.google;
}
