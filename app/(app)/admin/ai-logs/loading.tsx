import { PageSkeleton, TableSkeleton } from "@/components/ui/skeleton";

export default function AdminAiLogsLoading() {
  return (
    <PageSkeleton>
      <TableSkeleton />
    </PageSkeleton>
  );
}
