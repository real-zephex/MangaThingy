import { MangaCard } from "@/components/custom/landing/cards";
import HeroSlider from "@/components/custom/landing/heroSlider";
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
    <main className="container mx-auto px-4 py-8 space-y-12">
      <section>
        <HeroSlider
          data={{ mangapill: mangapillNewest, asurascans: asurascansPopular }}
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-12">
          {/* Popular Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-orange-500">
                  <TrendingUp size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Trending Now
                  </span>
                </div>
                <h2 className="text-3xl font-black tracking-tight">
                  Popular <span className="text-primary">Mangas</span>
                </h2>
              </div>
              <Link
                href="/browse"
                className="text-sm font-bold flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
              >
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {mangapillNewest.results.slice(0, 8).map((manga, idx) => (
                <MangaCard
                  key={idx}
                  manga={{ ...manga, source: "mangapill" }}
                  variant="default"
                />
              ))}
            </div>
          </section>

          {/* Featured Section */}
          <section className="bg-muted/30 -mx-4 px-4 py-12 rounded-3xl">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-pink-500">
                  <Sparkles size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Handpicked for you
                  </span>
                </div>
                <h2 className="text-3xl font-black tracking-tight">
                  Featured <span className="text-primary">Series</span>
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {asurascansPopular.results.slice(0, 4).map((manga, idx) => (
                <MangaCard
                  key={idx}
                  manga={{ ...manga, source: "asurascans" }}
                  variant="featured"
                />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar / Latest Updates */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-yellow-500">
                  <Zap size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Fresh Updates
                  </span>
                </div>
                <h2 className="text-2xl font-black tracking-tight">
                  Latest <span className="text-primary">Releases</span>
                </h2>
              </div>
            </div>
            <div className="space-y-4">
              {asurascansLatest.results.slice(0, 10).map((manga, idx) => (
                <MangaCard
                  key={idx}
                  manga={{ ...manga, source: "asurascans" }}
                  variant="compact"
                />
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full mt-6 font-bold border-2"
            >
              Load More Updates
            </Button>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Home;
