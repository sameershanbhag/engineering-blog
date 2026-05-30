import type {
  Article,
  Author,
  AuthResponse,
  AuthUser,
  CreateArticleInput,
  CreateArticleResult,
  Discipline,
  LoginInput,
  OAuthInput,
  RegisterInput,
  Topic,
} from "./types";
import {
  articles,
  authors,
  disciplines,
  topContributors,
  trendingTopics,
} from "./mock-data";

/*
  API client for The Engineering Commons.

  Talks to the separate FastAPI backend when NEXT_PUBLIC_API_URL is set
  (e.g. http://localhost:8000); otherwise resolves from the in-repo mock
  dataset so the UI runs with zero backend. Function signatures are the
  contract the backend satisfies.
*/

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function authHeaders(token?: string): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function get<T>(
  path: string,
  fallback: () => T,
  opts?: { token?: string },
): Promise<T> {
  if (!BASE_URL) return fallback();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: authHeaders(opts?.token),
    // Per-user responses must not be cached across users.
    ...(opts?.token ? { cache: "no-store" } : { next: { revalidate: 30 } }),
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

async function send<TResult>(
  path: string,
  method: "POST" | "DELETE",
  body: unknown,
  token: string | undefined,
  fallback: () => Promise<TResult> | TResult,
): Promise<TResult> {
  if (!BASE_URL) return fallback();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return (await res.json()) as TResult;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const api = {
  listArticles(params?: { discipline?: string; q?: string }): Promise<Article[]> {
    const search = new URLSearchParams();
    if (params?.discipline) search.set("discipline", params.discipline);
    if (params?.q) search.set("q", params.q);
    const query = search.toString() ? `?${search.toString()}` : "";

    return get(`/articles${query}`, () => {
      const needle = params?.q?.trim().toLowerCase();
      return articles.filter((a) => {
        if (params?.discipline && a.discipline.slug !== params.discipline) return false;
        if (needle) {
          const haystack = [a.title, a.excerpt, a.category, a.author.name, ...a.tags]
            .join(" ")
            .toLowerCase();
          if (!haystack.includes(needle)) return false;
        }
        return true;
      });
    });
  },

  getArticle(slug: string, token?: string): Promise<Article | null> {
    return get(
      `/articles/${slug}`,
      () => articles.find((a) => a.slug === slug) ?? null,
      { token },
    );
  },

  relatedArticles(slug: string, limit = 3): Promise<Article[]> {
    return get(`/articles/${slug}/related?limit=${limit}`, () =>
      articles.filter((a) => a.slug !== slug).slice(0, limit),
    );
  },

  listDisciplines(): Promise<Discipline[]> {
    return get(`/disciplines`, () => disciplines);
  },

  trendingTopics(): Promise<Topic[]> {
    return get(`/topics/trending`, () => trendingTopics);
  },

  topContributors(): Promise<Author[]> {
    return get(`/contributors/top`, () => topContributors);
  },

  getAuthor(handle: string): Promise<Author | null> {
    return get(`/authors/${handle}`, () => authors[handle] ?? null);
  },

  authorArticles(handle: string, token?: string): Promise<Article[]> {
    return get(
      `/authors/${handle}/articles`,
      () => articles.filter((a) => a.author.handle === handle),
      { token },
    );
  },

  // ---- Auth ----

  register(input: RegisterInput): Promise<AuthResponse> {
    return send<AuthResponse>("/auth/register", "POST", input, undefined, () => ({
      user: {
        id: `user_${slugify(input.email)}`,
        name: input.name,
        email: input.email,
        handle: slugify(input.name) || slugify(input.email),
      },
      accessToken: "mock-token",
    }));
  },

  /** Returns the auth payload on valid credentials, or null on failure. */
  async login(input: LoginInput): Promise<AuthResponse | null> {
    if (!BASE_URL) {
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email);
      if (!validEmail || input.password.length < 6) return null;
      const name = input.email
        .split("@")[0]
        .split(/[._-]+/)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");
      return {
        user: {
          id: `user_${slugify(input.email)}`,
          name: name || "Engineer",
          email: input.email,
          handle: slugify(input.email),
        },
        accessToken: "mock-token",
      };
    }
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (res.status === 401) return null;
    if (!res.ok) throw new Error(`login failed: ${res.status}`);
    return (await res.json()) as AuthResponse;
  },

  oauthLogin(input: OAuthInput): Promise<AuthResponse | null> {
    return send<AuthResponse>("/auth/oauth", "POST", input, undefined, () => ({
      user: {
        id: `user_${slugify(input.email)}`,
        name: input.name,
        email: input.email,
        image: input.image,
        handle: slugify(input.name) || slugify(input.email),
      },
      accessToken: "mock-token",
    }));
  },

  // ---- Write / interactions ----

  createArticle(
    input: CreateArticleInput,
    token?: string,
  ): Promise<CreateArticleResult> {
    return send<CreateArticleResult>("/articles", "POST", input, token, async () => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      return {
        slug: slugify(input.title) || "untitled-draft",
        title: input.title,
        status: input.status,
      };
    });
  },

  setLike(slug: string, liked: boolean, token: string): Promise<{ likes: number; liked: boolean }> {
    return send(
      `/articles/${slug}/like`,
      liked ? "POST" : "DELETE",
      undefined,
      token,
      () => ({ likes: 0, liked }),
    );
  },

  setBookmark(slug: string, bookmarked: boolean, token: string): Promise<{ bookmarked: boolean }> {
    return send(
      `/articles/${slug}/bookmark`,
      bookmarked ? "POST" : "DELETE",
      undefined,
      token,
      () => ({ bookmarked }),
    );
  },

  myDrafts(token: string): Promise<Article[]> {
    return get(`/me/drafts`, () => [] as Article[], { token });
  },

  myBookmarks(token: string): Promise<Article[]> {
    return get(`/me/bookmarks`, () => [] as Article[], { token });
  },
};
