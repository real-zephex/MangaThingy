"use client";

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { GogoanimeSearch } from "../data/types";

const SwiperContainer = ({
  data,
  displayText,
}: {
  data: GogoanimeSearch;
  displayText: string;
}) => {
  const dataMemoized = useMemo(() => data, [data]);

  return (
    <section className="w-full" aria-label="Anime Swiper Section">
      <div className="h-full">
        <ul className="h-full w-full">
          <p
            className="text-center text-xl text-gray-500 font-semibold pb-2"
            aria-label="Display Text"
          >
            {displayText}
          </p>
          <Swiper
            pagination={{ type: "fraction", clickable: true }}
            autoplay={true}
            loop={true}
            modules={[Autoplay, Pagination]}
            aria-label="Anime Swiper"
          >
            {dataMemoized &&
              dataMemoized.results.map((item, index) => (
                <SwiperSlide key={index} aria-label={`Slide ${index + 1}`}>
                  <Link
                    href={`/anime/${item.id}`}
                    aria-label={`Link to ${item.title}`}
                    title={`Link to ${item.title}`}
                  >
                    <div
                      className="flex flex-row items-center p-1 bg-slate-700/50 shadow-2xl"
                      aria-label="Anime Item"
                    >
                      <Image
                        src={item.image}
                        width={200}
                        height={250}
                        alt={`${item.title} Poster`}
                        className="lg:h-60 lg:w-40 h-48 w-32 rounded-md drop-shadow-2xl border-zinc-700 border-4"
                        aria-label={`${item.title} Poster`}
                      />
                      <section
                        className="ml-1 w-full"
                        aria-label="Anime Details"
                      >
                        <p
                          className="font-semibold text-xl flex md:hidden"
                          aria-label="Anime Title"
                        >
                          {item.title.length > 25
                            ? item.title.slice(0, 25) + "..."
                            : item.title}
                        </p>
                        <p
                          className="font-semibold text-xl hidden md:flex"
                          aria-label="Anime Title"
                        >
                          {item.title}
                        </p>
                        <div
                          className="flex flex-col"
                          aria-label="Anime Metadata"
                        >
                          {item.releaseDate && (
                            <div
                              className="badge badge-accent badge-outline"
                              aria-label="Anime Release Date"
                            >
                              Release year: {item.releaseDate}
                            </div>
                          )}
                          {item.episodeNumber && (
                            <div
                              className="badge badge-accent badge-outline"
                              aria-label="Anime Latest Episode"
                            >
                              Latest: Episode {item.episodeNumber}
                            </div>
                          )}
                        </div>
                      </section>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
          </Swiper>
        </ul>
      </div>
    </section>
  );
};

export default SwiperContainer;
