import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, oauthEnabled } from "@/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in — The Engineering Commons",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;

  // Already signed in? Send them on.
  const session = await auth();
  if (session?.user) redirect(callbackUrl || "/");

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to write, bookmark, and join the discussion."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm
        oauth={oauthEnabled}
        callbackUrl={callbackUrl || "/"}
        initialError={error}
      />
    </AuthShell>
  );
}
