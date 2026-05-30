<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# The Engineering Commons

A community engineering blog. Designs come from the Stitch project "The Engineering Commons"
(design system "Technical Precision"). Brand reads "EnginRoom" in the Stitch mockups but the
product name is **The Engineering Commons**.

## Stack
- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — config is CSS-based in `src/app/globals.css` via `@theme` (there is no
  `tailwind.config.js`). Design tokens (colors, fonts, radii) live there.
- Hand-rolled shadcn-style primitives in `src/components/ui/` (no shadcn CLI).
- Icons: `lucide-react`. NOTE: brand icons like `Github` were removed — use generic icons.

## Data layer
- The blog calls a **separate backend service** — the FastAPI app in `../BlogBackend`
  (see its README). Client is `src/lib/api.ts`.
- Set `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:8000`) to use it. When unset, every
  method falls back to the in-repo mock dataset (`src/lib/mock-data.ts`), so the UI runs
  with zero backend. The `api` method signatures ARE the contract the backend satisfies.
- Backend responses are camelCase to match `src/lib/types.ts` exactly (no mapping layer).
- Authed calls (create article, like, bookmark, drafts/bookmarks lists) pass the backend
  JWT as `Authorization: Bearer`. That token comes from the Auth.js session
  (`session.accessToken`) — see Auth below.

## Pages (mapped from Stitch screens)
- `/` — Homepage feed (`src/app/page.tsx`), discipline filter via `?discipline=<slug>`
- `/explore` — Explore disciplines grid
- `/articles/[slug]` — Article detail (reading progress, action rail, on-this-page TOC)
- `/authors/[handle]` — Author profile (tabs: Published / Bookmarked / About)
- `/write` — Article editor (client component)

## Fonts (per design system)
Hanken Grotesk = UI/headings (`font-sans`), Source Serif 4 = article body (`font-serif` /
`.prose-article`), JetBrains Mono = code (`font-mono`). Loaded in `src/app/layout.tsx`.

## Theming (light/dark)
- Class-based dark mode: `.dark` on `<html>`. Tokens live in `:root` / `.dark` in
  `globals.css`; `@theme inline` maps them to utilities. Use semantic tokens
  (`bg-surface`, `text-on-surface`, …) so both themes work — avoid hardcoded grays.
- A no-flash inline script in `layout.tsx` applies the saved/OS theme before paint.
  Toggle via `ThemeToggle`; deep-link with `?theme=dark|light`.
- Avatar initials fallback uses fixed palette classes (e.g. `bg-indigo-600`) that are
  theme-stable; don't switch them to themed tokens (they'd flip and lose contrast).

## Images
- `Avatar` renders `author.avatarUrl` (real photo) or initials fallback.
- `ArticleThumbnail` renders `article.coverImageUrl` or a tonal glyph fallback.
- Allowed remote hosts are in `next.config.ts` `images.remotePatterns` — add your
  CDN/backend host there. Mock uses i.pravatar.cc + picsum.photos.

## Write flow
- `WriteEditor` (`/write`, auth-protected) uses a **TipTap WYSIWYG editor**
  (`RichTextEditor`, TipTap v3 + StarterKit/Placeholder/Image) — bold, italic, H2/H3,
  lists, quote, code block, link, image, undo/redo. It emits HTML into `body`.
- Editor content is styled with `.prose-article` so it matches the published view.
  Placeholder + list/img styles live in `globals.css`.
- POSTs via `api.createArticle()`; the backend **sanitizes** the HTML with `nh3`
  (a safe tag/attr allowlist) before storing — the article page renders it with
  `dangerouslySetInnerHTML`, so never trust raw editor HTML. Excerpt + reading time
  are derived from the stripped text. Tags have no defaults.

## Auth (Auth.js / NextAuth v5)
- Config split: `src/auth.config.ts` (base: pages + jwt/session callbacks, no providers)
  and `src/auth.ts` (adds providers + exports `handlers, auth, signIn, signOut`).
- Providers: **GitHub + Google** (env-gated — only registered when their
  `AUTH_*_ID/SECRET` exist) and **Credentials** (email+password) whose `authorize`
  delegates to `api.login()` (mock in dev, backend in prod).
- API route: `src/app/api/auth/[...nextauth]/route.ts`. Session strategy: **JWT** (no DB).
- Route protection is **page-level** (not middleware — Next 16 renamed that to `proxy`
  and its export detection rejected Auth.js's destructured export). Protect a page with
  `const s = await auth(); if (!s?.user) redirect("/login?callbackUrl=...")`.
- Session in client components via `useSession()` (wrapped by `Providers` in layout).
  `UserMenu` shows avatar+dropdown when signed in, "Sign in" otherwise.
- Registration: `registerUser` server action (`src/lib/auth-actions.ts`) → `api.register()`,
  then client `signIn("credentials")` to auto-login.
- Env: `AUTH_SECRET` (required), `AUTH_GITHUB_ID/SECRET`, `AUTH_GOOGLE_ID/SECRET` (optional).
  See `.env.example`. OAuth callback URLs: `/api/auth/callback/{github,google}`.
- Dev email rule (mock, no backend): any valid email + 6+ char password authenticates.
- **Backend token bridge:** `api.login`/`api.register` return `{user, accessToken}` (a backend
  JWT). The Credentials `authorize` returns that token on the user object; the `jwt` callback
  (in `auth.ts`) stores it; the `session` callback exposes `session.accessToken` + `session.user.handle`.
  OAuth sign-ins are federated into the backend via `api.oauthLogin()` → `/auth/oauth` in the same
  `jwt` callback, so GitHub/Google users also get a backend identity + author profile.

## Per-user features (backed by the API)
- **Per-user profile:** each account has an author `handle`; `session.user.handle` maps the
  signed-in user to `/authors/{handle}` (UserMenu, header, profile owner view).
- **Drafts:** `WriteEditor` Save Draft → `api.createArticle(status:"draft")`. Owner sees a
  **Drafts** tab on their profile (`api.myDrafts`, client-fetched with the token).
- **Likes/bookmarks (auth-gated):** `ArticleActions` calls `api.setLike/setBookmark` with the
  token; signed-out clicks redirect to `/login`. The article page passes the token to
  `api.getArticle` so initial liked/bookmarked state is per-viewer. Owner profile has a
  **Bookmarked** tab (`api.myBookmarks`).

## Local config
- `.mcp.json` holds the Stitch MCP API key and is **gitignored** — do not commit it.
- Run: `npm run dev` (http://localhost:3000).
