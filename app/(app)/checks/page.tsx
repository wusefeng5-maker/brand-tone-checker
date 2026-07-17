import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { readToneCheckResultFromCheck } from "@/lib/check-history";
import { EmptyState } from "@/components/ui/empty-state";

async function getChecks() {
  const { userId } = await auth.protect();
  const userProfile = await prisma.userProfile.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: {
      checks: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          brandProfile: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return userProfile?.checks ?? [];
}

export default async function ChecksPage() {
  const checks = await getChecks();

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-orange-600">History</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950">
            Tone check history
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            Review saved tone checks and open the full report when you need to
            compare past copy decisions.
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          href="/check"
        >
          New check
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {checks.length > 0 ? (
          checks.map((check) => {
            const result = readToneCheckResultFromCheck(check);

            return (
              <Link
                className="block rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-200/70 transition hover:border-zinc-200 hover:shadow-md"
                href={`/checks/${check.id}`}
                key={check.id}
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-500">
                      {check.brandProfile?.name ?? "Deleted brand profile"}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold tracking-normal text-zinc-950">
                      {result.summary || "Saved tone check"}
                    </h2>
                    <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-zinc-600">
                      {check.inputText}
                    </p>
                    <p className="mt-4 text-xs font-medium text-zinc-400">
                      {check.createdAt.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-xl font-semibold text-white">
                    {check.score}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <EmptyState
            actionHref="/check"
            actionLabel="Start first check"
            description="Run your first tone check to create a saved report here."
            title="No checks yet"
          />
        )}
      </div>
    </section>
  );
}
