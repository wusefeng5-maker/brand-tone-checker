import { ListSkeleton, PageSkeleton } from "@/components/ui/skeleton";

export default function ChecksLoading() {
  return (
    <PageSkeleton>
      <ListSkeleton count={4} />
    </PageSkeleton>
  );
}
