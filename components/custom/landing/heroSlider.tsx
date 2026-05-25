"use client";

import { A11y, Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperClass } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { Manga, Results } from "@/lib/services/manga.types";
import { ImageProxy } from "@/lib/services/image.proxy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Pause, Play, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TrackManga } from "./tracker";
import { useRef, useState } from "react";

const HeroSlider = ({
  data,
}: {
  // data: { mangapill: Results<Manga>; asurascans: Results<Manga> };
  data: { mangapill: Results<Manga> };
}) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const mangapillResults = data.mangapill.results.map((i) => ({
    ...i,
    source: "mangapill",
  }));
  // const asurascansResults = data.asurascans.results.map((i) => ({
  //   ...i,
  //   source: "asurascans",
  // }));

  // const combinedResults = [...mangapillResults, ...asurascansResults].filter(
  //   (i) => i.image,
  // );
  const combinedResults = mangapillResults.filter((i) => i.image);

  const toggleAutoplay = () => {
    if (!swiperRef.current) return;
    if (isPaused) {
      swiperRef.current.autoplay.start();
    } else {
      swiperRef.current.autoplay.stop();
    }
    setIsPaused(!isPaused);
  };

  return (
    <div
      className="relative border border-border/20 bg-background"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured manga carousel"
    >
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        pagination={{ type: "bullets", clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        modules={[A11y, Autoplay, Pagination]}
        a11y={{
          prevSlideMessage: "Previous slide",
          nextSlideMessage: "Next slide",
          paginationBulletMessage: "Go to slide {{index}}",
        }}
        loop={true}
        className="h-[420px] md:h-[500px] select-none"
      >
        {combinedResults.map((manga, idx) => {
           // const sourceColor =
             // manga.source === "asurascans" ? "bg-brand-start" : "bg-brand-end";
           const sourceColor = "bg-brand-end";
          return (
            <SwiperSlide
              key={`hero-${manga.source}-${manga.id}`}
              aria-roledescription="slide"
            >
              <div className="w-full h-full relative overflow-hidden flex flex-col justify-end">
                {/* Background Image Container */}
                <div className="absolute inset-0 md:left-1/3 md:w-2/3 bg-muted border-l border-border/20">
                  <Image
                    src={ImageProxy(manga.image)}
                    alt={manga.title}
                    fill
                    className="object-cover object-top opacity-60 md:opacity-100"
                    priority={idx === 0}
                  />
                  {/* Subtle fade for mobile; stark edge for desktop */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background md:hidden" />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent hidden md:block w-[40%]" />
                </div>

                {/* Content */}
                <div className="relative z-20 w-full md:w-1/2 lg:w-[45%] h-full flex flex-col justify-end md:justify-center p-6 md:p-12 pb-16 bg-gradient-to-t from-background via-background/90 md:via-background/0 md:bg-none">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <div
                        className={cn("w-2 h-2 rounded-sm", sourceColor)}
                        title={manga.source}
                      />
                      {manga.source && (
                        <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                          {manga.source}
                        </span>
                      )}
                      {manga.status && (
                        <>
                          <span className="text-[10px] text-muted-foreground">•</span>
                          <span className="text-[10px] uppercase font-mono tracking-wider text-foreground">
                            {manga.status}
                          </span>
                        </>
                      )}
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold line-clamp-2 leading-tight tracking-tight">
                      {manga.title}
                    </h2>

                    {manga.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed max-w-lg md:pr-6">
                        {manga.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 pt-4">
                      <Link href={`/manga/${manga.source}/${manga.id}`}>
                        <Button
                          size="lg"
                          className="flex items-center gap-2 bg-foreground hover:bg-foreground/90 text-background font-medium px-8 h-12 rounded-sm transition-colors duration-200"
                        >
                          <Play
                            size={16}
                            fill="currentColor"
                            aria-hidden="true"
                          />
                          Read Now
                        </Button>
                      </Link>
                      <TrackManga data={manga}>
                        <Button
                          size="lg"
                          variant="outline"
                          className="hidden sm:flex items-center gap-2 border border-border/40 font-medium px-6 h-12 rounded-sm bg-background hover:bg-muted transition-colors duration-200"
                        >
                          <Plus size={16} aria-hidden="true" />
                          Add to Library
                        </Button>
                      </TrackManga>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Bottom controls: slide counter + pause */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-8 z-30 flex items-center gap-3 border border-border/20 bg-background/80 backdrop-blur-md px-3 py-1.5 shadow-sm">
        <span className="text-xs font-mono font-medium tracking-widest text-foreground">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(combinedResults.length).padStart(2, "0")}
        </span>
        <div className="w-px h-3 bg-border/40" />
        <button
          onClick={toggleAutoplay}
          aria-label={
            isPaused ? "Resume carousel autoplay" : "Pause carousel autoplay"
          }
          className="text-foreground hover:text-brand-start transition-colors"
        >
          {isPaused ? (
            <Play size={12} fill="currentColor" aria-hidden="true" />
          ) : (
            <Pause size={12} fill="currentColor" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
};

export default HeroSlider;
