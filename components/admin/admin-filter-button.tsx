"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/spinner";

export function AdminFilterButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? <Spinner /> : null}
      {pending ? "Filtering..." : "Filter"}
    </button>
  );
}
