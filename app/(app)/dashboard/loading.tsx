import { CardGridSkeleton, PageSkeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <PageSkeleton>
      <CardGridSkeleton count={1} />
    </PageSkeleton>
  );
}
