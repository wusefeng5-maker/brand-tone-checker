import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { canCreateBrandProfile, type PlanName } from "@/lib/brand-profile-rules";
import { BrandProfileCard } from "@/components/profiles/brand-profile-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getDictionary } from "@/lib/i18n/server";

async function getBrandProfiles() {
  const { userId } = await auth.protect();
  const userProfile = await prisma.userProfile.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: {
      brandProfiles: {
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  });

  return {
    plan: userProfile?.plan ?? "FREE",
    profiles: userProfile?.brandProfiles ?? [],
  };
}

export default async function BrandProfilesPage() {
  const [{ plan, profiles }, { locale, t }] = await Promise.all([
    getBrandProfiles(),
    getDictionary(),
  ]);
  const canCreate = canCreateBrandProfile(plan as PlanName, profiles.length);

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            {t.profiles.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950">
            {t.profiles.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            {t.profiles.description}
          </p>
        </div>
        {canCreate ? (
          <Link
            className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            href="/profiles/new"
          >
            {t.profiles.newProfile}
          </Link>
        ) : (
          <span className="rounded-full border border-orange-200 bg-orange-50 px-5 py-3 text-sm font-semibold text-orange-800">
            {t.profiles.freeLimit}
          </span>
        )}
      </div>

      <div className="mt-8 space-y-5">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <BrandProfileCard
              key={profile.id}
              labels={t}
              locale={locale}
              profile={profile}
            />
          ))
        ) : (
          <EmptyState
            actionHref="/profiles/new"
            actionLabel={t.profiles.emptyAction}
            description={t.profiles.emptyDescription}
            title={t.profiles.emptyTitle}
          />
        )}
      </div>
    </section>
  );
}
