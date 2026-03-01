import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const SkeletonCard = ({ className }: { className?: string }) => {
  return (
    <div className={cn("overflow-hidden border border-border/20 bg-card flex flex-col", className)}>
      <div className="relative aspect-[2/3] overflow-hidden skeleton-shimmer bg-muted border-b border-border/20" />
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <div className="h-4 w-12 skeleton-shimmer rounded-[4px]" />
            <div className="h-4 w-12 skeleton-shimmer rounded-[4px]" />
          </div>
          <div className="h-5 w-3/4 skeleton-shimmer rounded-[4px]" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid = ({
  count = 8,
  className,
}: {
  count?: number;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
