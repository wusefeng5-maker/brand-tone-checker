"use client";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again. If the problem continues, refresh the page.",
  onRetry,
}: ErrorStateProps) {
  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm shadow-zinc-200/70">
        <p className="text-sm font-semibold text-red-600">Error</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-600">
          {description}
        </p>
        {onRetry ? (
          <button
            className="mt-6 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            onClick={onRetry}
            type="button"
          >
            Try again
          </button>
        ) : null}
      </div>
    </section>
  );
}
