import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-8 text-center">
      <h2 className="text-xl font-semibold text-zinc-950">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-600">
        {description}
      </p>
      {actionHref && actionLabel ? (
        <Link
          className="mt-6 inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          href={actionHref}
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
