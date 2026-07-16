import { requireAdmin } from "@/lib/admin-auth";
import { ADMIN_PAGE_SIZE, parseAdminPage } from "@/lib/admin-rules";
import { prisma } from "@/lib/prisma";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPagination } from "@/components/admin/admin-pagination";

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
  await requireAdmin();
  const params = await searchParams;
  const page = parseAdminPage(params.page);
  const { users, hasNextPage } = await getUsers(page);

  return (
    <AdminPage
      description="Read-only user list with profile and tone check counts."
      title="Users"
    >
      <div className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm shadow-zinc-200/70">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-xs font-semibold uppercase tracking-normal text-zinc-500">
              <tr>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Plan</th>
                <th className="px-5 py-4">Brand Profile Count</th>
                <th className="px-5 py-4">Tone Check Count</th>
                <th className="px-5 py-4">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-4 font-medium text-zinc-950">
                    {user.email ?? "No email"}
                  </td>
                  <td className="px-5 py-4 text-zinc-600">{user.plan}</td>
                  <td className="px-5 py-4 text-zinc-600">
                    {user._count.brandProfiles}
                  </td>
                  <td className="px-5 py-4 text-zinc-600">
                    {user._count.checks}
                  </td>
                  <td className="px-5 py-4 text-zinc-600">
                    {user.createdAt.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm font-medium text-zinc-500">
            No users found.
          </div>
        ) : null}
      </div>

      <AdminPagination
        basePath="/admin/users"
        hasNextPage={hasNextPage}
        page={page}
      />
    </AdminPage>
  );
}
