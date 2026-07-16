import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateBrandProfileAction } from "@/app/(app)/profiles/actions";
import { BrandProfileForm } from "@/components/profiles/brand-profile-form";

type EditBrandProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBrandProfilePage({
  params,
}: EditBrandProfilePageProps) {
  const { id } = await params;
  const { userId } = await auth.protect();
  const profile = await prisma.brandProfile.findFirst({
    where: {
      id,
      user: {
        clerkUserId: userId,
      },
    },
  });

  if (!profile) {
    notFound();
  }

  const updateAction = updateBrandProfileAction.bind(null, profile.id);

  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <Link
        className="text-sm font-semibold text-zinc-500 hover:text-zinc-950"
        href="/profiles"
      >
        Back to brand profiles
      </Link>
      <div className="mt-6 rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-200/70 sm:p-8">
        <p className="text-sm font-semibold text-orange-600">Edit Profile</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950">
          Edit brand profile
        </h1>
        <div className="mt-8">
          <BrandProfileForm
            action={updateAction}
            initialValues={profile}
            submitLabel="Save changes"
          />
        </div>
      </div>
    </section>
  );
}
