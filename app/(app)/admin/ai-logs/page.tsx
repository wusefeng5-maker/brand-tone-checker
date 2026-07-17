import type { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/admin-auth";
import { Suspense } from "react";
import {
  ADMIN_PAGE_SIZE,
  parseAdminPage,
  parseAiLogFilters,
} from "@/lib/admin-rules";
import { prisma } from "@/lib/prisma";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminFilterButton } from "@/components/admin/admin-filter-button";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/skeleton";

type AdminAiLogsPageProps = {
  searchParams: Promise<{
    email?: string | string[];
    page?: string | string[];
    provider?: string | string[];
    status?: string | string[];
  }>;
};

function buildAiLogWhere(filters: ReturnType<typeof parseAiLogFilters>) {
  const where: Prisma.AiCallLogWhereInput = {};

  if (filters.email) {
    where.user = {
      email: {
        contains: filters.email,
        mode: "insensitive",
      },
    };
  }

  if (filters.provider) {
    where.provider = {
      contains: filters.provider,
      mode: "insensitive",
    };
  }

  if (filters.status) {
    where.status = filters.status;
  }

  return where;
}

async function getAiLogs(
  page: number,
  filters: ReturnType<typeof parseAiLogFilters>,
) {
  const logs = await prisma.aiCallLog.findMany({
    where: buildAiLogWhere(filters),
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * ADMIN_PAGE_SIZE,
    take: ADMIN_PAGE_SIZE + 1,
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  return {
    logs: logs.slice(0, ADMIN_PAGE_SIZE),
    hasNextPage: logs.length > ADMIN_PAGE_SIZE,
  };
}

export default async function AdminAiLogsPage({
  searchParams,
}: AdminAiLogsPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const page = parseAdminPage(params.page);
  const filters = parseAiLogFilters(params);

  return (
    <AdminPage
      description="Read-only AI request log with simple filters for support checks."
      title="AI logs"
    >
      <form className="mb-6 grid gap-3 rounded-3xl border border-zinc-100 bg-white p-5 shadow-sm shadow-zinc-200/70 md:grid-cols-4">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-normal text-zinc-500">
            Email
          </span>
          <input
            className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
            defaultValue={filters.email ?? ""}
            name="email"
            placeholder="user@example.com"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-normal text-zinc-500">
            Provider
          </span>
          <input
            className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
            defaultValue={filters.provider ?? ""}
            name="provider"
            placeholder="openai-compatible"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-normal text-zinc-500">
            Status
          </span>
          <select
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
            defaultValue={filters.status ?? ""}
            name="status"
          >
            <option value="">All</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
          </select>
        </label>
        <div className="flex items-end">
          <AdminFilterButton />
        </div>
      </form>

      <Suspense fallback={<TableSkeleton />}>
        <AdminAiLogsTable filters={filters} page={page} />
      </Suspense>
    </AdminPage>
  );
}

async function AdminAiLogsTable({
  page,
  filters,
}: {
  page: number;
  filters: ReturnType<typeof parseAiLogFilters>;
}) {
  const { logs, hasNextPage } = await getAiLogs(page, filters);

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm shadow-zinc-200/70">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-xs font-semibold uppercase tracking-normal text-zinc-500">
              <tr>
                <th className="px-5 py-4">User Email</th>
                <th className="px-5 py-4">Provider</th>
                <th className="px-5 py-4">Model</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Error Message</th>
                <th className="px-5 py-4">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-5 py-4 font-medium text-zinc-950">
                    {log.user.email ?? "No email"}
                  </td>
                  <td className="px-5 py-4 text-zinc-600">{log.provider}</td>
                  <td className="px-5 py-4 text-zinc-600">{log.model}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                      {log.status === "SUCCESS" ? "Success" : "Failed"}
                    </span>
                  </td>
                  <td className="max-w-md px-5 py-4 text-zinc-600">
                    <span className="line-clamp-2">
                      {log.errorMessage ?? "-"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-zinc-600">
                    {log.createdAt.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {logs.length === 0 ? (
          <div className="p-5">
            <EmptyState
              description="AI request logs will appear here after tone checks are submitted."
              title="No AI logs found"
            />
          </div>
        ) : null}
      </div>

      <AdminPagination
        basePath="/admin/ai-logs"
        hasNextPage={hasNextPage}
        page={page}
        searchParams={{
          email: filters.email,
          provider: filters.provider,
          status: filters.status,
        }}
      />
    </>
  );
}
