import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, oauthEnabled } from "@/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account — The Engineering Commons",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  const session = await auth();
  if (session?.user) redirect(callbackUrl || "/");

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join a community of engineers sharing what they build and learn."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm oauth={oauthEnabled} callbackUrl={callbackUrl || "/"} />
    </AuthShell>
  );
}
