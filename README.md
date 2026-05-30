# The Engineering Commons — Frontend

A community engineering blog where engineers share deep dives, lessons, and ideas
across disciplines. This is the **Next.js frontend**; the API lives in a separate
service: **[engineering-blog-backend](https://github.com/sameershanbhag/engineering-blog-backend)** (FastAPI).

## Stack
- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-based `@theme` config in `src/app/globals.css`)
- **Auth.js / NextAuth v5** — GitHub + Google OAuth + email/password
- **TipTap** WYSIWYG article editor
- Light/dark theming, responsive, accessible

## Features
- Homepage feed with discipline filters + full-text search
- Explore disciplines, article detail (reading progress, TOC, related)
- Author profiles (published / drafts / bookmarked tabs)
- Auth: sign in/up with GitHub, Google, or email; per-user profiles
- Write articles with a rich-text editor; save drafts; auth-gated likes & bookmarks

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in AUTH_SECRET (npx auth secret) + optional OAuth
npm run dev                  # http://localhost:3000
```

Set `NEXT_PUBLIC_API_URL=http://localhost:8000` to use the FastAPI backend; when
unset, the UI runs against an in-repo mock dataset (`src/lib/mock-data.ts`).

### Run both services together
The repos are siblings (`Blog/` + `BlogBackend/`); `dev.sh` (one level up) starts
both and restarts cleanly. See the backend repo for its setup.

## Environment
See `.env.example`. `AUTH_SECRET` is required; `AUTH_GITHUB_*` / `AUTH_GOOGLE_*`
are optional (those buttons hide when unset). Secrets live in `.env.local`
(gitignored).

## Project notes
Conventions and architecture are documented in [`AGENTS.md`](./AGENTS.md).
