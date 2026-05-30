import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { auth } from "@/auth";
import { WriteEditor } from "@/components/write-editor";

export const metadata: Metadata = {
  title: "Write New Article — The Engineering Commons",
};

export default async function WritePage() {
  // Protected route: only signed-in users can write.
  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/write")}`);
  }

  const disciplines = await api.listDisciplines();
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
      <WriteEditor
        disciplines={disciplines}
        authorName={session.user.name ?? undefined}
        accessToken={session.accessToken}
      />
    </div>
  );
}
