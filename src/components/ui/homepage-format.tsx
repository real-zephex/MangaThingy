"use client";
import { FlamescansPopular } from "../data/types";

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";
import Link from "next/link";
const SwiperContainer = ({
  data,
  displayText,
}: {
  data: FlamescansPopular;
  displayText: string;
}) => {
  return (
    <section className="w-full" aria-label="Manga Swiper Section">
      <div className=" h-full">
        <ul className="h-full w-full">
          <p
            className="text-center text-xl text-gray-500 font-semibold pb-2"
            aria-label="Display Text"
          >
            {displayText}
          </p>
          <Swiper
            // navigation
            pagination={{ type: "fraction", clickable: true }}
            autoplay={true}
            loop={true}
            modules={[Autoplay, Pagination]}
            aria-label="Manga Swiper"
          >
            {data &&
              data.results.map((item, index) => (
                <SwiperSlide key={index} aria-label={`Slide ${index + 1}`}>
                  <Link
                    href={`/read/manganato/${item.id}`}
                    aria-label={`Link to ${item.title}`}
                  >
                    <div
                      className="flex flex-row items-center p-1 bg-slate-700/50 shadow-2xl"
                      aria-label="Manga Item"
                    >
                      <Image
                        src={item.img}
                        width={200}
                        height={250}
                        alt="Manga Poster"
                        className="lg:h-60 lg:w-40 h-48 w-32 rounded-md drop-shadow-2xl border-zinc-700 border-4"
                        aria-label={`${item.title} Poster`}
                      />
                      <section
                        className="ml-1 w-full"
                        aria-label="Manga Details"
                      >
                        <p
                          className="font-semibold text-xl flex md:hidden"
                          aria-label="Manga Title"
                        >
                          {item.title.length > 25
                            ? item.title.slice(0, 25) + "..."
                            : item.title}
                        </p>
                        <p
                          className="font-semibold text-xl hidden md:flex"
                          aria-label="Manga Title"
                        >
                          {item.title}
                        </p>
                        <div
                          className="flex flex-col"
                          aria-label="Manga Metadata"
                        >
                          <div
                            className="badge badge-accent badge-outline"
                            aria-label="Manga Date"
                          >
                            {item.date}
                          </div>
                          <p
                            className="ml-1 my-1 text-sm font-semibold text-info"
                            aria-label="Manga Author"
                          >
                            Author:{" "}
                            <span className="font-normal text-white">
                              {item.author}
                            </span>
                          </p>
                        </div>
                        <p
                          className="ml-1 text-sm hidden lg:flex"
                          aria-label="Manga Description"
                        >
                          {item.description ? item.description : "?"}...
                        </p>
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
