import { MangaCard } from "@/components/custom/landing/cards";
import { AsurascansService } from "@/lib/services/manga.actions";
import { Sparkles } from "lucide-react";

export const FeaturedSection = async () => {
  const asurascansPopular = await AsurascansService.getPopular();

  return (
    <section className="bg-muted/30 -mx-4 px-4 py-12 rounded-2xl border border-border/30">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-start">
            <Sparkles size={18} aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Handpicked for you
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Featured <span className="text-brand-start">Series</span>
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {asurascansPopular.results.slice(0, 4).map((manga) => (
          <MangaCard
            key={`as-feat-${manga.id}`}
            manga={{ ...manga, source: "asurascans" }}
            variant="featured"
          />
        ))}
      </div>
    </section>
  );
};
