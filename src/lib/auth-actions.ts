"use server";

import { api } from "./api";
import type { RegisterInput } from "./types";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

/**
 * Server action: create an account via the API client (mock in dev, real
 * backend in prod). Sign-in is performed client-side afterward so the session
 * cookie is set in the browser. Kept server-side to mirror the login path.
 */
export async function registerUser(input: RegisterInput): Promise<ActionResult> {
  const name = input.name?.trim();
  const email = input.email?.trim();
  const password = input.password ?? "";

  if (!name || !email || password.length < 6) {
    return { ok: false, error: "Please complete all fields (password 6+ chars)." };
  }

  try {
    await api.register({ name, email, password });
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Could not create your account. The email may already be in use.",
    };
  }
}
