function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-zinc-200/80 ${className}`} />;
}

export function PageHeaderSkeleton() {
  return (
    <div>
      <SkeletonBlock className="h-4 w-24" />
      <SkeletonBlock className="mt-4 h-9 w-72 max-w-full" />
      <SkeletonBlock className="mt-4 h-5 w-[36rem] max-w-full" />
    </div>
  );
}

export function CardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-200/70"
          key={index}
        >
          <SkeletonBlock className="h-4 w-28" />
          <SkeletonBlock className="mt-5 h-10 w-20" />
          <SkeletonBlock className="mt-5 h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-200/70"
          key={index}
        >
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="mt-4 h-6 w-2/3" />
          <SkeletonBlock className="mt-4 h-4 w-full" />
          <SkeletonBlock className="mt-3 h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-200/70 sm:p-8">
      <div className="space-y-6">
        <SkeletonBlock className="h-12 w-full" />
        <SkeletonBlock className="h-56 w-full" />
        <SkeletonBlock className="h-11 w-28" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm shadow-zinc-200/70">
      <div className="space-y-1 p-5">
        {Array.from({ length: rows }).map((_, index) => (
          <div className="grid grid-cols-5 gap-4 py-3" key={index}>
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <PageHeaderSkeleton />
      <div className="mt-8">{children}</div>
    </section>
  );
}
