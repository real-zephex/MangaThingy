import { MangaCard } from "@/components/custom/landing/cards";
// import { AsurascansService } from "@/lib/services/manga.actions";
import { ChevronRight, Zap } from "lucide-react";
import Link from "next/link";

export const LatestSection = async () => {
  // const asurascansLatest = await AsurascansService.getLatest();

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-start">
            <Zap size={18} aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Fresh Updates
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Latest <span className="text-brand-start">Releases</span>
          </h2>
        </div>
        {/* <Link
          href="/browse?provider=asurascans"
          className="text-sm font-semibold flex items-center gap-1 text-muted-foreground hover:text-brand-start transition-colors"
        >
          View All <ChevronRight size={16} aria-hidden="true" />
        </Link> */}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {/* {asurascansLatest.results.slice(0, 10).map((manga) => (
          <MangaCard
            key={`as-lat-${manga.id}`}
            manga={{ ...manga, source: "asurascans" }}
            variant="default"
          />
        ))} */}
      </div>
    </section>
  );
};
