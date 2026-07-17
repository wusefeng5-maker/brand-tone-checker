import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { AdminPage, AdminStatCard } from "@/components/admin/admin-page";
import { Suspense } from "react";
import { CardGridSkeleton } from "@/components/ui/skeleton";

async function getAdminStats() {
  const [
    totalUsers,
    totalBrandProfiles,
    totalToneChecks,
    totalAiRequests,
    totalFailedAiRequests,
  ] = await Promise.all([
    prisma.userProfile.count(),
    prisma.brandProfile.count(),
    prisma.check.count(),
    prisma.aiCallLog.count(),
    prisma.aiCallLog.count({
      where: {
        status: "FAILED",
      },
    }),
  ]);

  return {
    totalUsers,
    totalBrandProfiles,
    totalToneChecks,
    totalAiRequests,
    totalFailedAiRequests,
  };
}

export default async function AdminOverviewPage() {
  await requireAdmin();

  return (
    <AdminPage
      description="Read-only platform totals for the current MVP."
      title="Admin overview"
    >
      <Suspense fallback={<CardGridSkeleton count={5} />}>
        <AdminStatsGrid />
      </Suspense>
    </AdminPage>
  );
}

async function AdminStatsGrid() {
  const stats = await getAdminStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <AdminStatCard label="Total Users" value={stats.totalUsers} />
      <AdminStatCard
        label="Total Brand Profiles"
        value={stats.totalBrandProfiles}
      />
      <AdminStatCard label="Total Tone Checks" value={stats.totalToneChecks} />
      <AdminStatCard label="Total AI Requests" value={stats.totalAiRequests} />
      <AdminStatCard
        label="Total Failed AI Requests"
        value={stats.totalFailedAiRequests}
      />
    </div>
  );
}
