import { ListSkeleton, PageSkeleton } from "@/components/ui/skeleton";

export default function ProfilesLoading() {
  return (
    <PageSkeleton>
      <ListSkeleton count={3} />
    </PageSkeleton>
  );
}
