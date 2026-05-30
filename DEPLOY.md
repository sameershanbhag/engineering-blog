# Deploying the frontend to Vercel (via GitHub Actions)

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the app and deploys it to **Vercel production**. Do this one-time setup first.

## 1. Create a Vercel token
- Vercel → **Account Settings → Tokens** → *Create Token* (scope: full account, no expiry or long).
- Copy it (shown once).

## 2. Link a Vercel project (no Git connection needed)
Run locally in this folder — this creates the project and writes the IDs we need:

```bash
npx vercel@latest login
npx vercel@latest link        # create/select a project; accept defaults
cat .vercel/project.json      # note "orgId" and "projectId"
```

> Don't import the repo through the Vercel dashboard's Git integration — that would
> make Vercel auto-deploy too, duplicating the Actions deploy. The CLI `link` above
> creates the project without connecting Git. (`.vercel/` is gitignored.)

## 3. Add the three GitHub secrets
Using the IDs from `.vercel/project.json` and your token:

```bash
gh secret set VERCEL_TOKEN      --repo sameershanbhag/engineering-blog            # paste token when prompted
gh secret set VERCEL_ORG_ID     --repo sameershanbhag/engineering-blog --body "<orgId>"
gh secret set VERCEL_PROJECT_ID --repo sameershanbhag/engineering-blog --body "<projectId>"
```

(Or add them in GitHub → repo → Settings → Secrets and variables → Actions.)

## 4. Set environment variables in Vercel
In the Vercel project → **Settings → Environment Variables** (Production). The workflow
pulls these at build time via `vercel pull`.

| Variable | Needed | Notes |
| --- | --- | --- |
| `AUTH_SECRET` | **required** | `npx auth secret` to generate. NextAuth won't run without it. |
| `AUTH_TRUST_HOST` | recommended | set to `true` so Auth.js trusts the Vercel host. |
| `NEXT_PUBLIC_API_URL` | optional | Your **publicly reachable** backend URL. **Leave unset** to run on the in-repo mock data (the UI still works; `localhost:8000` won't work in production). |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | optional | Enables the GitHub button. |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | optional | Enables the Google button. |

## 5. (If using OAuth) add the production callback URLs
After the first deploy you'll have a URL like `https://engineering-blog-xxxx.vercel.app`.
Add these to your OAuth apps:
- GitHub → Authorization callback URL: `https://<your-domain>/api/auth/callback/github`
- Google → Authorized redirect URI: `https://<your-domain>/api/auth/callback/google`

## 6. Deploy
```bash
git push            # or re-run the workflow from the Actions tab
```
Watch **Actions → Deploy to Vercel**. The deployment URL is printed in the run summary.

---

### Note on the backend
This deploys only the **UI**. For a fully functional production app (real auth,
persisted content, likes/bookmarks), the FastAPI backend
([engineering-blog-backend](https://github.com/sameershanbhag/engineering-blog-backend))
must be hosted somewhere public (e.g. Railway, Render, Fly.io, a container host), and
`NEXT_PUBLIC_API_URL` pointed at it. Until then, leave `NEXT_PUBLIC_API_URL` unset and
the UI runs on the bundled mock dataset.

### Simpler alternative (no Actions)
If you'd rather not manage tokens/secrets, Vercel's native Git integration does the same
"push → deploy" with one click: Vercel dashboard → *Add New Project* → import
`engineering-blog`. If you choose that, delete `.github/workflows/deploy.yml` to avoid
double deploys.
