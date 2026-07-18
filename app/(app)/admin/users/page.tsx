import { requireAdmin } from "@/lib/admin-auth";
import { Suspense } from "react";
import { ADMIN_PAGE_SIZE, parseAdminPage } from "@/lib/admin-rules";
import { prisma } from "@/lib/prisma";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/skeleton";
import type { Dictionary, Locale } from "@/lib/i18n/config";
import { formatDateTime } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/server";

type AdminUsersPageProps = {
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

async function getUsers(page: number) {
  const users = await prisma.userProfile.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * ADMIN_PAGE_SIZE,
    take: ADMIN_PAGE_SIZE + 1,
    select: {
      id: true,
      email: true,
      plan: true,
      createdAt: true,
      _count: {
        select: {
          brandProfiles: true,
          checks: true,
        },
      },
    },
  });

  return {
    users: users.slice(0, ADMIN_PAGE_SIZE),
    hasNextPage: users.length > ADMIN_PAGE_SIZE,
  };
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const [, { locale, t }] = await Promise.all([requireAdmin(), getDictionary()]);
  const params = await searchParams;
  const page = parseAdminPage(params.page);

  return (
    <AdminPage
      description={t.admin.usersDescription}
      labels={t.admin}
      title={t.admin.users}
    >
      <Suspense fallback={<TableSkeleton />}>
        <AdminUsersTable labels={t} locale={locale} page={page} />
      </Suspense>
    </AdminPage>
  );
}

async function AdminUsersTable({
  labels,
  locale,
  page,
}: {
  labels: Dictionary;
  locale: Locale;
  page: number;
}) {
  const { users, hasNextPage } = await getUsers(page);

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm shadow-zinc-200/70">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-xs font-semibold uppercase tracking-normal text-zinc-500">
              <tr>
                <th className="px-5 py-4">{labels.admin.email}</th>
                <th className="px-5 py-4">{labels.admin.plan}</th>
                <th className="px-5 py-4">{labels.admin.brandProfileCount}</th>
                <th className="px-5 py-4">{labels.admin.toneCheckCount}</th>
                <th className="px-5 py-4">{labels.admin.createdAt}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-4 font-medium text-zinc-950">
                    {user.email ?? labels.common.noEmail}
                  </td>
                  <td className="px-5 py-4 text-zinc-600">{user.plan}</td>
                  <td className="px-5 py-4 text-zinc-600">
                    {user._count.brandProfiles}
                  </td>
                  <td className="px-5 py-4 text-zinc-600">
                    {user._count.checks}
                  </td>
                  <td className="px-5 py-4 text-zinc-600">
                    {formatDateTime(user.createdAt, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 ? (
          <div className="p-5">
            <EmptyState
              description={labels.admin.emptyUsersDescription}
              title={labels.admin.emptyUsers}
            />
          </div>
        ) : null}
      </div>

      <AdminPagination
        basePath="/admin/users"
        hasNextPage={hasNextPage}
        labels={labels.common}
        page={page}
      />
    </>
  );
}
