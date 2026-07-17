import { FormSkeleton, PageSkeleton } from "@/components/ui/skeleton";

export default function CheckLoading() {
  return (
    <PageSkeleton>
      <FormSkeleton />
    </PageSkeleton>
  );
}
