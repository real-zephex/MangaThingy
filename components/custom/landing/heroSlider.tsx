"use client"

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { Manga, Results } from "@/lib/services/manga.types";
import { ImageProxy } from "@/lib/services/image.proxy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Layers, Play, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TrackManga } from "./tracker";

const HeroSlider = ({ data }: { data: { mangapill: Results<Manga>; asurascans: Results<Manga> } }) => {

  const mangapillResults = data.mangapill.results.map((i) => { return { ...i, source: "mangapill" } })
  const asurascansResults = data.asurascans.results.map((i) => { return { ...i, source: "asurascans" } })

  const combinedResults = [...mangapillResults, ...asurascansResults];

  return (
    <Swiper
      pagination={{ type: 'bullets', clickable: true }}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      modules={[Autoplay, Pagination]}
      loop={true}
      className="h-[400px] md:h-[550px] select-none bg-background rounded-2xl overflow-hidden shadow-2xl"
    >
      {
        combinedResults.filter(i => i.image).map((manga, idx) => {
          const sourceColor = manga.source === "asurascans" ? "bg-orange-500" : "bg-blue-500";
          return (
            <SwiperSlide key={idx}>
              <div className="w-full h-full relative overflow-hidden group">
                {/* Background Image */}
                <Image
                  src={ImageProxy(manga.image)}
                  alt={manga.title}
                  fill
                  className="object-cover md:object-bottom absolute inset-0 group-hover:scale-105 transition-transform duration-700"
                  priority={idx === 0}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-background via-background/60 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10"></div>

                {/* Content Container */}
                <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 text-foreground z-20">
                  <div className="max-w-2xl space-y-6">
                    <div className="flex flex-wrap items-center gap-2">
                      {manga.source && (
                        <Badge className={cn("text-xs px-2 py-0.5 uppercase font-bold border-none text-white shadow-lg", sourceColor)}>
                          {manga.source}
                        </Badge>
                      )}
                      {manga.status && (
                        <Badge className="flex items-center gap-1 bg-primary text-primary-foreground font-bold uppercase text-[10px]">
                          <BookOpen size={12} />
                          {manga.status}
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl md:text-6xl font-black line-clamp-2 leading-tight tracking-tighter">
                      {manga.title}
                    </h2>

                    {/* Description */}
                    {manga.description && (
                      <p className="text-sm md:text-lg text-muted-foreground line-clamp-3 leading-relaxed max-w-xl">
                        {manga.description}
                      </p>
                    )}

                    {/* Action Buttons */}
                      <div className="flex items-center gap-4 pt-2">
                        <Link href={`/manga/${manga.source}/${manga.id}`}>
                          <Button size="lg" className="flex items-center gap-2 bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-none font-bold px-8 shadow-xl shadow-orange-500/20 transition-all duration-300">
                            <Play size={20} fill="currentColor" />
                            Read Now
                          </Button>
                        </Link>
                        <TrackManga data={manga}>
                          <Button size="lg" variant="outline" className="hidden sm:flex items-center gap-2 border-2 font-bold px-8 hover:bg-primary/5 transition-all duration-300">
                            <Plus size={20} />
                            Add to Library
                          </Button>
                        </TrackManga>
                      </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )
        })
      }
    </Swiper>
  )
}

export default HeroSlider;