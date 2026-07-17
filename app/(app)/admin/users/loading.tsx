import { PageSkeleton, TableSkeleton } from "@/components/ui/skeleton";

export default function AdminUsersLoading() {
  return (
    <PageSkeleton>
      <TableSkeleton />
    </PageSkeleton>
  );
}
