import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { AdminPage, AdminStatCard } from "@/components/admin/admin-page";
import { Suspense } from "react";
import { CardGridSkeleton } from "@/components/ui/skeleton";
import type { Dictionary } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/server";

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
  const [, { t }] = await Promise.all([requireAdmin(), getDictionary()]);

  return (
    <AdminPage
      description={t.admin.overviewDescription}
      labels={t.admin}
      title={t.admin.overview}
    >
      <Suspense fallback={<CardGridSkeleton count={5} />}>
        <AdminStatsGrid labels={t.admin} />
      </Suspense>
    </AdminPage>
  );
}

async function AdminStatsGrid({ labels }: { labels: Dictionary["admin"] }) {
  const stats = await getAdminStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <AdminStatCard label={labels.totalUsers} value={stats.totalUsers} />
      <AdminStatCard
        label={labels.totalBrandProfiles}
        value={stats.totalBrandProfiles}
      />
      <AdminStatCard label={labels.totalToneChecks} value={stats.totalToneChecks} />
      <AdminStatCard label={labels.totalAiRequests} value={stats.totalAiRequests} />
      <AdminStatCard
        label={labels.totalFailedAiRequests}
        value={stats.totalFailedAiRequests}
      />
    </div>
  );
}
