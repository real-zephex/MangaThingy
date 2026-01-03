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
import { BookOpen, Calendar, Layers, Play } from "lucide-react";

const HeroSlider = ({ data }: { data: { mangapill: Results<Manga>; asurascans: Results<Manga> } }) => {

  const mangapillResults = data.mangapill.results.map((i) => { return { ...i, source: "mangapill" } })
  const asurascansResults = data.asurascans.results.map((i) => { return { ...i, source: "asurascans" } })

  const combinedResults = [...mangapillResults, ...asurascansResults];

  return (
    <Swiper
      pagination={{ type: 'bullets', clickable: true }}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      modules={[Autoplay, Pagination]}
      loop={true}
      className="h-125 md:h-150 select-none bg-[#181818]"
    >
      {
        combinedResults.filter(i => i.image).map((manga, idx) => {
          return (
            <SwiperSlide key={idx}>
              <div className="w-full h-full relative overflow-hidden group">
                {/* Background Image */}
                <Image
                  src={ImageProxy(manga.image)}
                  alt={manga.title}
                  fill
                  className="object-bottom absolute inset-0 group-hover:scale-105 transition-transform duration-500"
                  priority={idx === 0}
                />

                {/* Gradient Overlay - bottom to top */}
                <div className="absolute inset-0 bg-linear-to-r from-black via-black/50 to-transparent opacity-80"></div>

                {/* Content Container */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-white">
                  <div className="max-w-2xl space-y-4">
                    {/* Title */}
                    <h2 className="text-3xl md:text-5xl font-bold line-clamp-2 drop-shadow-lg">
                      {manga.title}
                    </h2>

                    {/* Badges */}
                    {manga.status && (
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="flex items-center gap-1 bg-red-600 hover:bg-red-700">
                          <BookOpen size={14} />
                          {manga.status.substring(0, 1).toUpperCase() + manga.status.substring(1)}
                        </Badge>
                        <Badge variant={"secondary"} className="flex items-center gap-1">
                          <Layers size={14} />
                          {manga.type}
                        </Badge>
                        <Badge variant={"secondary"} className="flex items-center gap-1">
                          <Calendar size={14} />
                          {manga.year}
                        </Badge>
                      </div>
                    )}

                    {/* Description */}
                    {manga.description && (
                      <p className="text-sm md:text-base text-gray-200 line-clamp-3 drop-shadow-md">
                        {manga.description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4">
                      <Button className="flex items-center gap-2 bg-white text-black hover:bg-gray-200">
                        <Play size={18} />
                        Read Now
                      </Button>
                      <Button variant="outline" className="border-white text-white hover:bg-white/20">
                        Add to Library
                      </Button>
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