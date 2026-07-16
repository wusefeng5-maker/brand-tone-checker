import Link from "next/link";

type AdminPaginationProps = {
  basePath: string;
  page: number;
  hasNextPage: boolean;
  searchParams?: Record<string, string | undefined>;
};

function buildHref(
  basePath: string,
  page: number,
  searchParams: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value) {
      params.set(key, value);
    }
  }

  if (page > 1) {
    params.set("page", String(page));
  } else {
    params.delete("page");
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function AdminPagination({
  basePath,
  page,
  hasNextPage,
  searchParams = {},
}: AdminPaginationProps) {
  return (
    <div className="mt-6 flex items-center justify-between gap-4">
      {page > 1 ? (
        <Link
          className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:text-zinc-950"
          href={buildHref(basePath, page - 1, searchParams)}
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-full border border-zinc-100 bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-300">
          Previous
        </span>
      )}

      <span className="text-sm font-semibold text-zinc-500">Page {page}</span>

      {hasNextPage ? (
        <Link
          className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:text-zinc-950"
          href={buildHref(basePath, page + 1, searchParams)}
        >
          Next
        </Link>
      ) : (
        <span className="rounded-full border border-zinc-100 bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-300">
          Next
        </span>
      )}
    </div>
  );
}
