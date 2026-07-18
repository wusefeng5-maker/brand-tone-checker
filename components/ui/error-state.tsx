"use client";

import { useEffect, useState } from "react";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title,
  description,
  onRetry,
}: ErrorStateProps) {
  const [isZh, setIsZh] = useState(true);

  useEffect(() => {
    setIsZh(document.documentElement.lang.startsWith("zh"));
  }, []);

  const fallback = isZh
    ? {
        description: "请刷新页面或稍后重试。",
        label: "错误",
        retry: "重试",
        title: "页面出现问题",
      }
    : {
        description: "Refresh the page or try again later.",
        label: "Error",
        retry: "Try again",
        title: "Something went wrong",
      };

  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm shadow-zinc-200/70">
        <p className="text-sm font-semibold text-red-600">{fallback.label}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950">
          {title ?? fallback.title}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-600">
          {description ?? fallback.description}
        </p>
        {onRetry ? (
          <button
            className="mt-6 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            onClick={onRetry}
            type="button"
          >
            {fallback.retry}
          </button>
        ) : null}
      </div>
    </section>
  );
}
