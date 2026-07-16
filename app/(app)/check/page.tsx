import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ToneCheckForm } from "@/components/check/tone-check-form";

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
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return userProfile?.brandProfiles ?? [];
}

export default async function ToneCheckPage() {
  const brandProfiles = await getBrandProfiles();

  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold text-orange-600">Tone Check</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950">
          AI tone check
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
          Select a brand profile, paste copy, and get the first MVP tone report.
        </p>
      </div>

      <ToneCheckForm brandProfiles={brandProfiles} />
    </section>
  );
}
