import { CardGridSkeleton, PageSkeleton } from "@/components/ui/skeleton";

export default function MarketingLoading() {
  return (
    <main className="min-h-screen bg-[#f6f7fb] text-zinc-950">
      <PageSkeleton>
        <CardGridSkeleton count={3} />
      </PageSkeleton>
    </main>
  );
}
