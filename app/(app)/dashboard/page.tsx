import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { CardGridSkeleton } from "@/components/ui/skeleton";

async function DashboardCard() {
  const user = await currentUser();
  const displayName =
    user?.firstName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "Welcome back";

  return (
    <div className="rounded-[2rem] border border-zinc-100 bg-white p-8 shadow-sm shadow-zinc-200/70">
      <p className="text-sm font-semibold text-orange-600">Dashboard</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950">
        {displayName}, authentication is connected
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
        This is the protected app placeholder page. Brand profiles, AI checks,
        history, and business data are available through the app navigation.
      </p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <Suspense fallback={<CardGridSkeleton count={1} />}>
        <DashboardCard />
      </Suspense>
    </section>
  );
}
