import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const SkeletonCard = ({ className }: { className?: string }) => {
  return (
    <div className={cn("space-y-0", className)}>
      <Card className="overflow-hidden bg-card border-border/50 relative">
        <div className="relative aspect-2/3 overflow-hidden skeleton-shimmer" />
        <div className="p-3.5 space-y-2.5">
          <div className="space-y-1.5">
            <div className="flex gap-1">
              <div className="h-4 w-10 skeleton-shimmer rounded" />
              <div className="h-4 w-10 skeleton-shimmer rounded" />
            </div>
            <div className="h-5 w-3/4 skeleton-shimmer rounded" />
          </div>
          <div className="h-8 w-full skeleton-shimmer rounded-lg" />
        </div>
      </Card>
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
