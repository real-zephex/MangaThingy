import { SkeletonGrid } from "@/components/custom/ui/skeleton-card";

const Loading = () => {
  return (
    <main className="container mx-auto px-4 py-8 space-y-14">
      {/* Hero Skeleton */}
      <div className="w-full h-[420px] md:h-[560px] skeleton-shimmer rounded-2xl" />

      {/* Recently Read Skeleton */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 skeleton-shimmer rounded" />
          <div className="h-4 w-28 skeleton-shimmer rounded" />
        </div>
        <div className="flex gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-20 h-28 skeleton-shimmer rounded-lg shrink-0" />
          ))}
        </div>
      </section>

      {/* Popular Section Skeleton */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="h-4 w-24 skeleton-shimmer rounded" />
            <div className="h-8 w-48 skeleton-shimmer rounded" />
          </div>
        </div>
        <SkeletonGrid count={10} />
      </section>

      {/* Featured Section Skeleton */}
      <section className="bg-muted/30 -mx-4 px-4 py-12 rounded-2xl border border-border/30">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="h-4 w-24 skeleton-shimmer rounded" />
            <div className="h-8 w-48 skeleton-shimmer rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-80 md:h-96 skeleton-shimmer rounded-xl" />
          ))}
        </div>
      </section>

      {/* Latest Releases Skeleton */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="h-4 w-24 skeleton-shimmer rounded" />
            <div className="h-8 w-48 skeleton-shimmer rounded" />
          </div>
        </div>
        <SkeletonGrid count={10} />
      </section>
    </main>
  );
};

export default Loading;
