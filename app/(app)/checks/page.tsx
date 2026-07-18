import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { DeleteCheckButton } from "@/components/check/delete-check-button";
import { EmptyState } from "@/components/ui/empty-state";
import { readToneCheckResultFromCheck } from "@/lib/check-history";
import { formatDateTime } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";

type ChecksPageProps = {
  searchParams: Promise<{
    brand?: string;
    date?: string;
    decision?: string;
    page?: string;
    platform?: string;
    q?: string;
    sort?: string;
  }>;
};

const PAGE_SIZE = 8;

const decisionClasses = {
  PASS: "bg-emerald-50 text-emerald-700",
  "Needs Revision": "bg-yellow-50 text-yellow-800",
  "OFF BRAND": "bg-red-50 text-red-700",
};

type BrandOption = {
  id: string;
  name: string;
};

function parsePage(value: string | undefined) {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

function buildPageHref(page: number, params: URLSearchParams) {
  const nextParams = new URLSearchParams(params);
  nextParams.set("page", String(page));

  return `/checks?${nextParams.toString()}`;
}

function buildDecisionHref(decision: string, params: URLSearchParams) {
  const nextParams = new URLSearchParams(params);
  nextParams.delete("page");

  if (decision) {
    nextParams.set("decision", decision);
  } else {
    nextParams.delete("decision");
  }

  const query = nextParams.toString();

  return query ? `/checks?${query}` : "/checks";
}

async function getChecks() {
  const { userId } = await auth.protect();
  const [userProfile, checks] = await Promise.all([
    prisma.userProfile.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        email: true,
      },
    }),
    prisma.check.findMany({
      where: {
        user: {
          clerkUserId: userId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        brandProfile: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
  ]);

  return {
    checks,
    userEmail: userProfile?.email ?? null,
  };
}

export default async function ChecksPage({ searchParams }: ChecksPageProps) {
  const params = await searchParams;
  const [{ checks, userEmail }, clerkUser, { locale, t }] = await Promise.all([
    getChecks(),
    currentUser(),
    getDictionary(),
  ]);
  const query = params.q?.trim().toLowerCase() ?? "";
  const sort = params.sort === "oldest" ? "oldest" : "newest";
  const page = parsePage(params.page);
  const currentParams = new URLSearchParams();
  const displayEmail =
    userEmail ?? clerkUser?.primaryEmailAddress?.emailAddress ?? t.common.currentUser;

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      currentParams.set(key, value);
    }
  }

  const enriched = checks.map((check) => ({
    check,
    result: readToneCheckResultFromCheck(check),
  }));
  const brandOptions = Array.from(
    new Map(
      enriched
        .map(({ check }) => check.brandProfile)
        .filter((brand): brand is BrandOption => Boolean(brand))
        .map((brand) => [brand.id, brand.name]),
    ),
  );
  const platformOptions = Array.from(
    new Set(
      enriched
        .map(({ result }) => result.context?.platform)
        .filter((value): value is string => Boolean(value)),
    ),
  );
  const filtered = enriched
    .filter(({ check, result }) => {
      const brandName = check.brandProfile?.name ?? "";
      const matchesQuery =
        !query ||
        check.inputText.toLowerCase().includes(query) ||
        result.summary.toLowerCase().includes(query) ||
        brandName.toLowerCase().includes(query);
      const matchesBrand =
        !params.brand || check.brandProfile?.id === params.brand;
      const matchesPlatform =
        !params.platform || result.context?.platform === params.platform;
      const matchesDecision =
        !params.decision || result.finalDecision === params.decision;
      const matchesDate =
        !params.date ||
        check.createdAt.toISOString().slice(0, 10) === params.date;

      return (
        matchesQuery &&
        matchesBrand &&
        matchesPlatform &&
        matchesDecision &&
        matchesDate
      );
    })
    .sort((a, b) =>
      sort === "oldest"
        ? a.check.createdAt.getTime() - b.check.createdAt.getTime()
        : b.check.createdAt.getTime() - a.check.createdAt.getTime(),
    );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            {t.history.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950">
            {t.history.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            {t.history.description}
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          href="/check"
        >
          {t.history.newCheck}
        </Link>
      </div>

      <form className="mt-8 grid gap-3 rounded-3xl border border-zinc-100 bg-white p-4 shadow-sm shadow-zinc-200/70 lg:grid-cols-6">
        <input
          className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 lg:col-span-2"
          defaultValue={params.q ?? ""}
          name="q"
          placeholder={t.history.searchPlaceholder}
        />
        <select
          className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 outline-none transition focus:border-zinc-950"
          defaultValue={params.brand ?? ""}
          name="brand"
        >
          <option value="">{t.history.brand}</option>
          {brandOptions.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        <select
          className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 outline-none transition focus:border-zinc-950"
          defaultValue={params.platform ?? ""}
          name="platform"
        >
          <option value="">{t.history.platform}</option>
          {platformOptions.map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>
        <select
          className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 outline-none transition focus:border-zinc-950"
          defaultValue={params.decision ?? ""}
          name="decision"
        >
          <option value="">{t.history.decision}</option>
          <option value="PASS">PASS</option>
          <option value="Needs Revision">Needs Revision</option>
          <option value="OFF BRAND">OFF BRAND</option>
        </select>
        <input
          className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
          defaultValue={params.date ?? ""}
          name="date"
          type="date"
        />
        <select
          className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 outline-none transition focus:border-zinc-950"
          defaultValue={sort}
          name="sort"
        >
          <option value="newest">{t.history.newest}</option>
          <option value="oldest">{t.history.oldest}</option>
        </select>
        <button
          className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          type="submit"
        >
          {t.common.search}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {["", "PASS", "Needs Revision", "OFF BRAND"].map((decision) => (
          <Link
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              (params.decision ?? "") === decision
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-950"
            }`}
            href={buildDecisionHref(decision, currentParams)}
            key={decision || "all"}
          >
            {decision || t.common.all}
          </Link>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {paged.length > 0 ? (
          paged.map(({ check, result }) => {
            const platform = result.context?.platform ?? t.history.noPlatform;

            return (
              <article
                className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-200/70 transition hover:border-zinc-200 hover:shadow-md"
                key={check.id}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <Link
                    className="block min-w-0 flex-1"
                    href={`/checks/${check.id}`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-zinc-500">
                        {check.brandProfile?.name ?? t.history.deletedBrand}
                      </p>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${decisionClasses[result.finalDecision]}`}
                      >
                        {result.finalDecision}
                      </span>
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                        {platform}
                      </span>
                    </div>
                    <h2 className="mt-2 text-xl font-semibold tracking-normal text-zinc-950">
                      {result.summary || t.history.savedReport}
                    </h2>
                    <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-zinc-600">
                      {check.inputText}
                    </p>
                    <dl className="mt-4 grid gap-2 text-xs font-medium text-zinc-400 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <dt className="text-zinc-500">{t.history.created}</dt>
                        <dd>{formatDateTime(check.createdAt, locale)}</dd>
                      </div>
                      <div>
                        <dt className="text-zinc-500">{t.history.updated}</dt>
                        <dd>{t.common.notTracked}</dd>
                      </div>
                      <div>
                        <dt className="text-zinc-500">{t.history.createdBy}</dt>
                        <dd>{displayEmail}</dd>
                      </div>
                      <div>
                        <dt className="text-zinc-500">{t.history.reviewer}</dt>
                        <dd>{result.context?.reviewer ?? displayEmail}</dd>
                      </div>
                    </dl>
                  </Link>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-950 text-xl font-semibold text-white">
                      {check.score}
                    </div>
                    <DeleteCheckButton
                      checkId={check.id}
                      labels={t.common}
                      message={t.history.confirmDelete}
                    />
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <EmptyState
            actionHref="/check"
            actionLabel={t.history.startFirst}
            description={query ? t.history.emptySearch : t.history.emptyDescription}
            title={t.history.emptyTitle}
          />
        )}
      </div>

      {totalPages > 1 ? (
        <div className="mt-8 flex items-center justify-between">
          <Link
            aria-disabled={safePage <= 1}
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-950 aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href={buildPageHref(Math.max(1, safePage - 1), currentParams)}
          >
            {t.common.previous}
          </Link>
          <p className="text-sm font-medium text-zinc-500">
            {safePage} / {totalPages}
          </p>
          <Link
            aria-disabled={safePage >= totalPages}
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-950 aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href={buildPageHref(Math.min(totalPages, safePage + 1), currentParams)}
          >
            {t.common.next}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
