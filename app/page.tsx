import { Suspense } from "react";
import dynamic from "next/dynamic";
import { RecentlyRead } from "@/components/custom/landing/recently-read";
import { PopularSection } from "@/components/custom/landing/popular-section";
import { FeaturedSection } from "@/components/custom/landing/featured-section";
import { LatestSection } from "@/components/custom/landing/latest-section";
import { SkeletonHero } from "@/components/custom/ui/skeleton-hero";
import { SkeletonGrid } from "@/components/custom/ui/skeleton-card";
import {
  AsurascansService,
  MangapillService,
} from "@/lib/services/manga.actions";

// Dynamically import HeroSlider only when needed (saves 50KB bundle)
const HeroSlider = dynamic(
  () => import("@/components/custom/landing/heroSlider"),
  {
    loading: () => <SkeletonHero />,
    ssr: true, // SSR enabled for initial page load
  },
);

const HeroSection = async () => {
  const [mangapillNewest, asurascansPopular] = await Promise.all([
    MangapillService.getNewest(),
    AsurascansService.getPopular(),
  ]);

  return (
    <section>
      <HeroSlider
        data={{ mangapill: mangapillNewest, asurascans: asurascansPopular }}
      />
    </section>
  );
};

const Home = () => {
  return (
    <main className="container mx-auto px-4 py-8 space-y-14">
      <h1 className="sr-only">Otaku Oasis - Manga Reader</h1>

      {/* Hero Carousel */}
      <Suspense fallback={<SkeletonHero />}>
        <HeroSection />
      </Suspense>

      {/* Recently Read — prominent full-width strip */}
      <RecentlyRead />

      {/* Popular Section */}
      <Suspense fallback={<SkeletonGrid count={10} />}>
        <PopularSection />
      </Suspense>

      {/* Featured Section */}
      <Suspense
        fallback={
          <div className="bg-muted/30 -mx-4 px-4 py-12 rounded-2xl border border-border/30">
            <SkeletonGrid count={4} />
          </div>
        }
      >
        <FeaturedSection />
      </Suspense>

      {/* Latest Releases */}
      <Suspense fallback={<SkeletonGrid count={10} />}>
        <LatestSection />
      </Suspense>
    </main>
  );
};

export default Home;
