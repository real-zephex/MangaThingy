import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const SkeletonCompact = ({ className }: { className?: string }) => {
  return (
    <Card
      className={cn(
        "overflow-hidden bg-card border-border/50 p-3",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="shrink-0 w-14 h-18 rounded-lg skeleton-shimmer" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 w-3/4 skeleton-shimmer rounded" />
          <div className="flex items-center gap-2">
            <div className="h-3 w-10 skeleton-shimmer rounded" />
            <div className="w-1.5 h-1.5 rounded-full skeleton-shimmer" />
          </div>
        </div>
        <div className="shrink-0 w-8 h-8 rounded-full skeleton-shimmer" />
      </div>
    </Card>
  );
};

export const SkeletonCompactList = ({ count = 10 }: { count?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCompact key={i} />
      ))}
    </div>
  );
};
