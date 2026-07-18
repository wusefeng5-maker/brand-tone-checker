"use client";

import { useTransition } from "react";
import { deleteCheckAction } from "@/app/(app)/checks/actions";
import { Spinner } from "@/components/ui/spinner";
import type { Dictionary } from "@/lib/i18n/config";

export function DeleteCheckButton({
  checkId,
  labels,
  message,
}: {
  checkId: string;
  labels: Dictionary["common"];
  message: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(message)) {
          return;
        }

        startTransition(() => {
          void deleteCheckAction(checkId);
        });
      }}
      type="button"
    >
      {isPending ? <Spinner /> : null}
      {isPending ? labels.deleting : labels.delete}
    </button>
  );
}
