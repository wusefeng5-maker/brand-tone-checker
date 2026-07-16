"use client";

import { useTransition } from "react";
import { deleteBrandProfileAction } from "@/app/(app)/profiles/actions";

type DeleteBrandProfileButtonProps = {
  brandProfileId: string;
  brandName: string;
};

export function DeleteBrandProfileButton({
  brandProfileId,
  brandName,
}: DeleteBrandProfileButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isPending}
      onClick={() => {
        const confirmed = window.confirm(
          `Delete the brand profile "${brandName}"?`,
        );

        if (!confirmed) {
          return;
        }

        startTransition(() => {
          void deleteBrandProfileAction(brandProfileId);
        });
      }}
      type="button"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
