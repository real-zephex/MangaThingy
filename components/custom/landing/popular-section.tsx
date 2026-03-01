import { MangaCard } from "@/components/custom/landing/cards";
import { MangapillService } from "@/lib/services/manga.actions";
import { ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export const PopularSection = async () => {
  const mangapillNewest = await MangapillService.getNewest();

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-start">
            <TrendingUp size={18} aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Trending Now
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Popular <span className="text-brand-start">Manga</span>
          </h2>
        </div>
        <Link
          href="/browse"
          className="text-sm font-semibold flex items-center gap-1 text-muted-foreground hover:text-brand-start transition-colors"
        >
          View All <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {mangapillNewest.results.slice(0, 10).map((manga) => (
          <MangaCard
            key={`mp-${manga.id}`}
            manga={{ ...manga, source: "mangapill" }}
            variant="default"
          />
        ))}
      </div>
    </section>
  );
};
