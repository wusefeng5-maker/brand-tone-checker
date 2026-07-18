import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readToneCheckResultFromCheck } from "@/lib/check-history";
import { ToneCheckResultView } from "@/components/check/tone-check-result";
import { formatDateTime } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/server";

type CheckDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CheckDetailPage({
  params,
}: CheckDetailPageProps) {
  const { id } = await params;
  const { userId } = await auth.protect();
  const [{ locale, t }, check] = await Promise.all([
    getDictionary(),
    prisma.check.findFirst({
      where: {
        id,
        user: {
          clerkUserId: userId,
        },
      },
      include: {
        brandProfile: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  if (!check) {
    notFound();
  }

  const result = readToneCheckResultFromCheck(check);

  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <Link
        className="text-sm font-semibold text-zinc-500 hover:text-zinc-950"
        href="/checks"
      >
        {t.history.back}
      </Link>

      <div className="mt-6 grid gap-6">
        <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-200/70 sm:p-8">
          <p className="text-sm font-semibold text-orange-600">
            {t.history.savedReport}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950">
            {check.brandProfile?.name ?? t.history.deletedBrand}
          </h1>
          <p className="mt-3 text-sm font-medium text-zinc-400">
            {formatDateTime(check.createdAt, locale)}
          </p>

          <div className="mt-8">
            <h2 className="text-sm font-semibold text-zinc-950">
              {t.history.originalCopy}
            </h2>
            <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-zinc-50 px-4 py-4 text-base leading-7 text-zinc-700">
              {check.inputText}
            </p>
          </div>
        </div>

        <ToneCheckResultView labels={t} locale={locale} result={result} />
      </div>
    </section>
  );
}
