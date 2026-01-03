import { MangaCard } from "@/components/custom/landing/cards";
import HeroSlider from "@/components/custom/landing/heroSlider";
import {
  AsurascansService,
  MangapillService,
} from "@/lib/services/manga.actions";

const Home = async () => {
  const [mangapillNewest, asurascansPopular, asurascansLatest] =
    await Promise.all([
      MangapillService.getNewest(),
      AsurascansService.getPopular(),
      AsurascansService.getLatest(),
    ]);

  return (
    <main className="container mx-auto px-4">
      {/* <HeroSlider
        data={{ mangapill: mangapillNewest, asurascans: asurascansPopular }}
      /> */}
      {/* <hr className="bg-linear-to-r from-transparent via-white/20 to-transparent my-10" /> */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <div className="space-y-2 mb-6">
            <h2 className="text-2xl font-bold">
              Popular Mangas
            </h2>
            <div className="h-1 w-16 bg-linear-to-r from-orange-500 to-pink-500 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mangapillNewest.results.map((manga, idx) => (
              <MangaCard
                key={idx}
                manga={{ ...manga, source: "mangapill" }}
                variant="default"
              />
            ))}
          </div>
          <div className="mt-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">
                Popular Mangas (more)
              </h2>
              <div className="h-1 w-16 bg-linear-to-r from-orange-500 to-pink-500 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {asurascansPopular.results.map((manga, idx) => (
                <MangaCard
                  key={idx}
                  manga={{ ...manga, source: "asurascans" }}
                  variant="featured"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-0 md:col-span-1">
          <div className="space-y-2 mb-6">
            <h2 className="text-2xl font-bold ">
              Latest Mangas
            </h2>
            <div className="h-1 w-16 bg-linear-to-r from-orange-500 to-pink-500 rounded-full" />
          </div>
          <div className="grid grid-cols-1 gap-4">
            {asurascansLatest.results.map((manga, idx) => (
              <MangaCard
                key={idx}
                manga={{ ...manga, source: "asurascans" }}
                variant="featured"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
