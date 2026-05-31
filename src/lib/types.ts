/** Domain types for The Engineering Commons. Shared by the API client and UI. */

export interface Author {
  handle: string; // unique, used in URLs e.g. "aris_thorne"
  name: string;
  title: string; // e.g. "Principal Engineer, Data Infrastructure"
  bio: string;
  avatarUrl?: string; // real photo; falls back to a generated initials avatar
  avatarColor: string; // bg for the generated initials fallback
  github?: string;
  stats: {
    engagements: number;
    followers: number;
    following: number;
  };
}

export interface Discipline {
  slug: string; // "software", "robotics", ...
  name: string;
  description: string;
  icon: string; // lucide icon name key (see icon-map)
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  /** Article body as simple HTML (mock). A real backend would return rich content. */
  contentHtml: string;
  discipline: Discipline;
  category: string; // e.g. "Software Architecture"
  author: Author;
  publishedAt: string; // ISO date
  readingMinutes: number;
  likes: number;
  tags: string[];
  /** Real cover image; when absent the tonal glyph block below is used. */
  coverImageUrl?: string;
  /** Fallback visual accent for the thumbnail when there's no cover image. */
  cover: { icon: string; tone: "indigo" | "emerald" | "slate" | "dark" };
  status?: "published" | "draft";
  /** Per-viewer interaction state (set when the request is authenticated). */
  liked?: boolean;
  bookmarked?: boolean;
}

export interface Topic {
  tag: string; // without leading '#'
  count: number;
}

export interface Notification {
  id: string;
  type: "like" | "bookmark";
  actorName: string;
  actorHandle: string;
  actorAvatarUrl?: string;
  actorAvatarColor: string;
  articleSlug: string;
  articleTitle: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  items: Notification[];
  unreadCount: number;
}

/** Payload sent to the backend when publishing or saving a draft. */
export interface CreateArticleInput {
  title: string;
  body: string;
  disciplineSlug: string;
  tags: string[];
  visibility: "public" | "unlisted" | "draft";
  featuredImage: boolean;
  status: "published" | "draft";
}

export interface CreateArticleResult {
  slug: string;
  title: string;
  status: "published" | "draft";
}

/** Authenticated user identity (distinct from a public Author profile). */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  handle?: string; // the user's author-profile handle
}

/** Auth endpoints return the user plus a backend access token (JWT). */
export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface OAuthInput {
  provider: string;
  providerAccountId: string;
  email: string;
  name: string;
  image?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ProfileUpdateInput {
  title?: string;
  bio?: string;
  github?: string;
}
