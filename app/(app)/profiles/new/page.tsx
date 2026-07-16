import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createBrandProfileAction } from "@/app/(app)/profiles/actions";
import { BrandProfileForm } from "@/components/profiles/brand-profile-form";
import { canCreateBrandProfile, type PlanName } from "@/lib/brand-profile-rules";

async function getCreateAvailability() {
  const { userId } = await auth.protect();
  const userProfile = await prisma.userProfile.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: {
      _count: {
        select: {
          brandProfiles: true,
        },
      },
    },
  });

  const plan = userProfile?.plan ?? "FREE";
  const profileCount = userProfile?._count.brandProfiles ?? 0;

  return canCreateBrandProfile(plan as PlanName, profileCount);
}

export default async function NewBrandProfilePage() {
  const canCreate = await getCreateAvailability();

  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <Link
        className="text-sm font-semibold text-zinc-500 hover:text-zinc-950"
        href="/profiles"
      >
        Back to brand profiles
      </Link>
      <div className="mt-6 rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-200/70 sm:p-8">
        <p className="text-sm font-semibold text-orange-600">New Profile</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950">
          New brand profile
        </h1>
        {canCreate ? (
          <div className="mt-8">
            <BrandProfileForm
              action={createBrandProfileAction}
              submitLabel="Create brand profile"
            />
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-5 text-orange-900">
            <h2 className="font-semibold">
              Free plan allows 1 brand profile
            </h2>
            <p className="mt-2 text-sm leading-6">
              You already have a brand profile. Payments and upgrades are not
              part of this MVP phase, so edit the existing profile for now.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
