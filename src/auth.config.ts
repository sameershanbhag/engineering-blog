import type { NextAuthConfig } from "next-auth";

/**
 * Base Auth.js config: pages + session strategy, no providers (added in
 * `auth.ts`). Callbacks live in `auth.ts` because OAuth federation calls the
 * backend. Route protection is page-level via `auth()` (e.g. app/write/page.tsx).
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
} satisfies NextAuthConfig;
