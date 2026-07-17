import { CardGridSkeleton, PageSkeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <PageSkeleton>
      <CardGridSkeleton count={5} />
    </PageSkeleton>
  );
}
