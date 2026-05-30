import type { DefaultSession } from "next-auth";

// Add our custom fields to the session, user, and JWT.
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      handle?: string;
    } & DefaultSession["user"];
  }

  interface User {
    handle?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    handle?: string;
    accessToken?: string;
  }
}
