import { SkeletonGrid } from "@/components/custom/ui/skeleton-card";

export default function BrowseLoading() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      {/* Header + Search */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded skeleton-shimmer" />
              <div className="h-8 w-52 rounded-md skeleton-shimmer" />
            </div>
            <div className="h-4 w-72 rounded skeleton-shimmer" />
          </div>
          <div className="relative w-full md:w-80">
            <div className="h-10 w-full rounded-lg skeleton-shimmer" />
          </div>
        </div>

        {/* Segmented provider control */}
        <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg w-fit border border-border/30">
          <div className="h-9 w-28 rounded-md skeleton-shimmer" />
          <div className="h-9 w-28 rounded-md skeleton-shimmer" />
        </div>
      </div>

      {/* Results grid */}
      <SkeletonGrid
        count={10}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      />
    </main>
  );
}
