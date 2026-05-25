import { Suspense } from "react";
import dynamic from "next/dynamic";
import { RecentlyRead } from "@/components/custom/landing/recently-read";
import { PopularSection } from "@/components/custom/landing/popular-section";
import { FeaturedSection } from "@/components/custom/landing/featured-section";
import { LatestSection } from "@/components/custom/landing/latest-section";
import { SkeletonHero } from "@/components/custom/ui/skeleton-hero";
import { SkeletonGrid } from "@/components/custom/ui/skeleton-card";
import { MangapillService } from "@/lib/services/manga.actions";
import { FadeIn } from "@/components/custom/ui/fade-in";

// Dynamically import HeroSlider only when needed (saves 50KB bundle)
const HeroSlider = dynamic(
  () => import("@/components/custom/landing/heroSlider"),
  {
    loading: () => <SkeletonHero />,
    ssr: true, // SSR enabled for initial page load
  },
);

const HeroSection = async () => {
  const mangapillNewest = await MangapillService.getNewest();

  return (
    <section>
      <HeroSlider data={{ mangapill: mangapillNewest }} />
    </section>
  );
};

const Home = () => {
  return (
    <main className="container mx-auto px-4 py-8 flex flex-col gap-12 md:gap-16">
      <h1 className="sr-only">Otaku Oasis - Manga Reader</h1>

      {/* Hero Carousel */}
      <FadeIn delay={0}>
        <section>
          <Suspense fallback={<SkeletonHero />}>
            <HeroSection />
          </Suspense>
        </section>
      </FadeIn>

      <div className="h-px bg-border/20 w-full" />

      {/* Recently Read — prominent full-width strip */}
      <FadeIn delay={0.1}>
        <RecentlyRead />
      </FadeIn>

      <div className="h-px bg-border/20 w-full" />

      {/* Popular Section */}
      <FadeIn delay={0.2}>
        <Suspense fallback={<SkeletonGrid count={10} />}>
          <PopularSection />
        </Suspense>
      </FadeIn>

      {/* Featured Section */}
      {/*
      <FadeIn delay={0.3}>
        <Suspense
          fallback={
            <div className="bg-muted/30 -mx-4 px-4 py-12 rounded-lg border border-border/20">
              <SkeletonGrid count={4} />
            </div>
          }
        >
          <FeaturedSection />
        </Suspense>
      </FadeIn>
      */}

      <div className="h-px bg-border/20 w-full" />

      {/* Latest Releases 
      <FadeIn delay={0.4}>
        <Suspense fallback={<SkeletonGrid count={10} />}>
          <LatestSection />
        </Suspense>
      </FadeIn>
*/}
    </main>
  );
};

export default Home;
