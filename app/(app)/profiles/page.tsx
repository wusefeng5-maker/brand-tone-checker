import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { canCreateBrandProfile, type PlanName } from "@/lib/brand-profile-rules";
import { BrandProfileCard } from "@/components/profiles/brand-profile-card";

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
  const { plan, profiles } = await getBrandProfiles();
  const canCreate = canCreateBrandProfile(plan as PlanName, profiles.length);

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-orange-600">Brand Profiles</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950">
            Brand profiles
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            Maintain brand voice, forbidden words, required words, and example
            copy. Future tone checks will use these profiles as the source of
            truth.
          </p>
        </div>
        {canCreate ? (
          <Link
            className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            href="/profiles/new"
          >
            New brand profile
          </Link>
        ) : (
          <span className="rounded-full border border-orange-200 bg-orange-50 px-5 py-3 text-sm font-semibold text-orange-800">
            Free plan allows 1 brand profile
          </span>
        )}
      </div>

      <div className="mt-8 space-y-5">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <BrandProfileCard key={profile.id} profile={profile} />
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-8 text-center">
            <h2 className="text-xl font-semibold text-zinc-950">
              No brand profiles yet
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-600">
              Create the first profile to record the basic rules for this brand
              voice.
            </p>
            <Link
              className="mt-6 inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              href="/profiles/new"
            >
              Create first brand profile
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
