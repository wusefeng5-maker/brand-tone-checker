"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocaleAction } from "@/app/i18n-actions";
import type { Dictionary, Locale } from "@/lib/i18n/config";

export function LanguageSwitcher({
  locale,
  labels,
}: {
  locale: Locale;
  labels: Dictionary["common"];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchLocale(nextLocale: Locale) {
    const formData = new FormData();
    formData.set("locale", nextLocale);
    formData.set("path", pathname);

    startTransition(async () => {
      await setLocaleAction(formData);
      router.refresh();
    });
  }

  return (
    <div
      aria-label={labels.language}
      className="inline-flex rounded-full border border-zinc-200 bg-white p-1 text-xs font-semibold shadow-sm"
      role="group"
    >
      <button
        className={`rounded-full px-3 py-1.5 transition ${
          locale === "zh"
            ? "bg-zinc-950 text-white"
            : "text-zinc-600 hover:bg-zinc-100"
        }`}
        disabled={isPending}
        onClick={() => switchLocale("zh")}
        type="button"
      >
        {labels.chinese}
      </button>
      <button
        className={`rounded-full px-3 py-1.5 transition ${
          locale === "en"
            ? "bg-zinc-950 text-white"
            : "text-zinc-600 hover:bg-zinc-100"
        }`}
        disabled={isPending}
        onClick={() => switchLocale("en")}
        type="button"
      >
        {labels.english}
      </button>
    </div>
  );
}
