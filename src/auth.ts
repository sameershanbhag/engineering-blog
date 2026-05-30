import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import { authConfig } from "./auth.config";
import { api } from "./lib/api";

/** Which OAuth providers are configured (drives which buttons the UI shows). */
export const oauthEnabled = {
  github: Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET),
  google: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
};

const providers: Provider[] = [];
if (oauthEnabled.github) providers.push(GitHub);
if (oauthEnabled.google) providers.push(Google);

providers.push(
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      const email = typeof credentials?.email === "string" ? credentials.email : "";
      const password =
        typeof credentials?.password === "string" ? credentials.password : "";
      if (!email || !password) return null;

      const result = await api.login({ email, password });
      if (!result) return null;
      // Carry the backend token + handle through to the JWT callback.
      return {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        image: result.user.image ?? null,
        handle: result.user.handle,
        accessToken: result.accessToken,
      };
    },
  }),
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
  callbacks: {
    async jwt({ token, user, account }) {
      // Credentials sign-in: `user` carries our fields from authorize().
      if (user) {
        const u = user as typeof user & { handle?: string; accessToken?: string };
        if (u.id) token.id = u.id;
        if (u.handle) token.handle = u.handle;
        if (u.accessToken) token.accessToken = u.accessToken;
      }

      // OAuth sign-in: federate into the backend to mint a backend token +
      // author profile, so OAuth users can write, like, and bookmark too.
      if (
        account &&
        (account.provider === "github" || account.provider === "google") &&
        user?.email
      ) {
        let fed: Awaited<ReturnType<typeof api.oauthLogin>> = null;
        try {
          fed = await api.oauthLogin({
            provider: account.provider,
            providerAccountId: account.providerAccountId ?? account.provider,
            email: user.email,
            name: user.name ?? user.email,
            image: user.image ?? undefined,
          });
        } catch {
          // fed stays null; handled below.
        }
        // Fail the sign-in rather than create a session with no backend token
        // (which would 401 silently on every later write).
        if (!fed) {
          throw new Error("Sign-in failed: the backend is unavailable. Please try again.");
        }
        token.id = fed.user.id;
        token.handle = fed.user.handle;
        token.accessToken = fed.accessToken;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? session.user.id;
        session.user.handle = token.handle as string | undefined;
      }
      session.accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
});
