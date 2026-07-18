import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ToneCheckForm } from "@/components/check/tone-check-form";
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
        select: {
          audience: true,
          exampleCopy: true,
          id: true,
          name: true,
          toneTags: true,
        },
      },
    },
  });

  return userProfile?.brandProfiles ?? [];
}

export default async function ToneCheckPage() {
  const [brandProfiles, { locale, t }] = await Promise.all([
    getBrandProfiles(),
    getDictionary(),
  ]);

  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold text-orange-600">
          {t.check.eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950">
          {t.check.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
          {t.check.description}
        </p>
      </div>

      <ToneCheckForm brandProfiles={brandProfiles} labels={t} locale={locale} />
    </section>
  );
}
