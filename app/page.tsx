import { MangaCard } from "@/components/custom/landing/cards";
import HeroSlider from "@/components/custom/landing/heroSlider";
import { RecentlyRead } from "@/components/custom/landing/recently-read";
import { Button } from "@/components/ui/button";
import {
  AsurascansService,
  MangapillService,
} from "@/lib/services/manga.actions";
import { ChevronRight, Sparkles, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

const Home = async () => {
  const [mangapillNewest, asurascansPopular, asurascansLatest] =
    await Promise.all([
      MangapillService.getNewest(),
      AsurascansService.getPopular(),
      AsurascansService.getLatest(),
    ]);

  return (
    <main className="container mx-auto px-4 py-8 space-y-14">
      <h1 className="sr-only">Otaku Oasis - Manga Reader</h1>

      {/* Hero Carousel */}
      <section>
        <HeroSlider
          data={{ mangapill: mangapillNewest, asurascans: asurascansPopular }}
        />
      </section>

      {/* Recently Read — prominent full-width strip */}
      <RecentlyRead />

      {/* Popular Section */}
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

      {/* Featured Section */}
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

      {/* Latest Releases — was in sidebar, now full-width */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-brand-start">
              <Zap size={18} aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Fresh Updates
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              Latest <span className="text-brand-start">Releases</span>
            </h2>
          </div>
          <Link
            href="/browse?provider=asurascans"
            className="text-sm font-semibold flex items-center gap-1 text-muted-foreground hover:text-brand-start transition-colors"
          >
            View All <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {asurascansLatest.results.slice(0, 10).map((manga) => (
            <MangaCard
              key={`as-lat-${manga.id}`}
              manga={{ ...manga, source: "asurascans" }}
              variant="default"
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
