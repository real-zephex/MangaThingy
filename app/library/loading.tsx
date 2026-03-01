import { SkeletonGrid } from "@/components/custom/ui/skeleton-card";

export default function LibraryLoading() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
             <div className="h-8 w-8 bg-muted rounded-md animate-pulse" />
             <div className="h-10 w-48 bg-muted rounded-md animate-pulse" />
          </div>
          <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        </div>

        <div className="relative w-full md:w-80">
          <div className="h-11 w-full bg-muted rounded-xl animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-accent/30 rounded-2xl p-4 h-24 animate-pulse border border-border/50" />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
         <div className="h-12 w-full max-w-2xl bg-muted/50 rounded-lg animate-pulse" />
         <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
      </div>

      <SkeletonGrid count={10} />
    </main>
  );
}
