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
  data: { mangapill: Results<Manga>; asurascans: Results<Manga> };
}) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const mangapillResults = data.mangapill.results.map((i) => ({
    ...i,
    source: "mangapill",
  }));
  const asurascansResults = data.asurascans.results.map((i) => ({
    ...i,
    source: "asurascans",
  }));

  const combinedResults = [...mangapillResults, ...asurascansResults].filter(
    (i) => i.image,
  );

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
      className="relative"
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
        className="h-[420px] md:h-[560px] select-none bg-card rounded-2xl overflow-hidden shadow-xl"
      >
        {combinedResults.map((manga, idx) => {
          const sourceColor =
            manga.source === "asurascans" ? "bg-brand-start" : "bg-brand-end";
          return (
            <SwiperSlide
              key={`hero-${manga.source}-${manga.id}`}
              aria-roledescription="slide"
            >
              <div className="w-full h-full relative overflow-hidden group">
                {/* Background Image */}
                <Image
                  src={ImageProxy(manga.image)}
                  alt={manga.title}
                  fill
                  className="object-cover md:object-bottom absolute inset-0 group-hover:scale-[1.03] transition-transform duration-700"
                  priority={idx === 0}
                />

                {/* Gradient Overlays — stronger for readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14 pb-16 md:pb-20 text-foreground z-20">
                  <div className="max-w-lg space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {manga.source && (
                        <Badge
                          className={cn(
                            "text-[10px] px-2 py-0.5 uppercase font-bold border-none text-white shadow-md",
                            sourceColor,
                          )}
                        >
                          {manga.source}
                        </Badge>
                      )}
                      {manga.status && (
                        <Badge className="flex items-center gap-1 bg-foreground/10 backdrop-blur-sm text-foreground font-bold uppercase text-[10px] border-none">
                          <BookOpen size={10} aria-hidden="true" />
                          {manga.status}
                        </Badge>
                      )}
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black line-clamp-2 leading-tight tracking-tight">
                      {manga.title}
                    </h2>

                    {manga.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed max-w-md">
                        {manga.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 pt-1">
                      <Link href={`/manga/${manga.source}/${manga.id}`}>
                        <Button
                          size="lg"
                          className="flex items-center gap-2 bg-brand-start hover:bg-brand-start/90 text-white border-none font-semibold px-7 shadow-lg shadow-brand-shadow transition-colors duration-200"
                        >
                          <Play
                            size={18}
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
                          className="hidden sm:flex items-center gap-2 border-2 border-border/50 font-semibold px-7 bg-background/30 backdrop-blur-sm hover:bg-background/50 transition-colors duration-200"
                        >
                          <Plus size={18} aria-hidden="true" />
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
      <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2">
        <span className="text-xs font-mono text-foreground/60 bg-background/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(combinedResults.length).padStart(2, "0")}
        </span>
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleAutoplay}
          aria-label={
            isPaused ? "Resume carousel autoplay" : "Pause carousel autoplay"
          }
          className="rounded-full shadow-md bg-background/60 backdrop-blur-sm hover:bg-background/80 h-8 w-8"
        >
          {isPaused ? (
            <Play size={14} aria-hidden="true" />
          ) : (
            <Pause size={14} aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default HeroSlider;
