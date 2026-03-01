export const SkeletonHero = () => {
  return (
    <div className="w-full h-96 bg-gradient-to-r from-muted to-muted/50 rounded-2xl overflow-hidden relative skeleton-shimmer flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />
      <div className="relative z-10 text-center space-y-4">
        <div className="h-8 w-64 skeleton-shimmer rounded mx-auto" />
        <div className="h-6 w-48 skeleton-shimmer rounded mx-auto" />
      </div>
      
      {/* Pagination dots skeleton */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-full skeleton-shimmer ${
              i === 0 ? "w-8 h-2" : "w-2 h-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
