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
    <section className="w-full">
      <div className=" h-full">
        <ul className="h-full w-full">
          <p className="text-center text-xl text-gray-500 font-semibold pb-2">
            {displayText}
          </p>
          <Swiper
            pagination={{ type: "progressbar", clickable: true }}
            autoplay={true}
            loop={true}
            modules={[Autoplay, Pagination]}
          >
            {dataMemoized &&
              dataMemoized.results.map((item, index) => (
                <SwiperSlide key={index}>
                  <Link href={`/anime/${item.id}`}>
                    <div className="flex flex-row items-center p-1 bg-slate-700/50 shadow-2xl">
                      <Image
                        src={item.image}
                        width={200}
                        height={250}
                        alt="Manga Poster"
                        className="h-64 w-44 rounded-md drop-shadow-2xl border-zinc-700 border-4"
                      />
                      <section className="ml-1 w-full">
                        <p className="font-semibold text-xl">{item.title}</p>
                        <div className="flex flex-col">
                          {item.releaseDate && (
                            <div className="badge badge-accent badge-outline">
                              Release year: {item.releaseDate}
                            </div>
                          )}
                          {item.episodeNumber && (
                            <div className="badge badge-accent badge-outline">
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
