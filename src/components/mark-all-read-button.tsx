"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCheck } from "lucide-react";
import { api } from "@/lib/api";

export function MarkAllReadButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        const token = session?.accessToken;
        if (!token) return;
        setBusy(true);
        try {
          await api.markNotificationsRead(token);
          router.refresh();
        } finally {
          setBusy(false);
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-surface-container disabled:opacity-50"
    >
      <CheckCheck className="h-4 w-4" />
      Mark all as read
    </button>
  );
}
