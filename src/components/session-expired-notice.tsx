"use client";

import { signOut } from "next-auth/react";
import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

/** Shown when the backend rejects the session's token (stale/expired). The fix
 * is a fresh sign-in, so offer to sign out (which then leads back to login). */
export function SessionExpiredNotice() {
  return (
    <div className="px-4 py-14 text-center">
      <AlertCircle className="mx-auto h-8 w-8 text-on-surface-variant/60" />
      <p className="mt-3 font-medium text-on-surface">
        We couldn’t load your notifications.
      </p>
      <p className="mt-1 text-sm text-on-surface-variant">
        Your sign-in session has expired. Please sign in again.
      </p>
      <Button
        variant="primary"
        className="mt-5"
        onClick={() =>
          signOut({ callbackUrl: "/login?callbackUrl=%2Fnotifications" })
        }
      >
        Sign in again
      </Button>
    </div>
  );
}
