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
    <section className="w-full">
      <div className=" h-full">
        <ul className="h-full w-full">
          <p className="text-center text-xl text-gray-500 font-semibold pb-2">
            {displayText}
          </p>
          <Swiper
            // navigation
            pagination={{ type: "progressbar", clickable: true }}
            autoplay={true}
            loop={true}
            modules={[Autoplay, Pagination]}
          >
            {data &&
              data.results.map((item, index) => (
                <SwiperSlide key={index}>
                  <Link href={`/read/manganato/${item.id}`}>
                    <div className="flex flex-row items-center p-1 bg-slate-700/50 shadow-2xl">
                      <Image
                        src={item.img}
                        width={200}
                        height={250}
                        alt="Manga Poster"
                        className="h-64 w-44 rounded-md drop-shadow-2xl border-zinc-700 border-4"
                      />
                      <section className="ml-1 w-full">
                        <p className="font-semibold text-xl">{item.title}</p>
                        <div className="flex flex-col">
                          <div className="badge badge-accent badge-outline">
                            {item.date}
                          </div>
                          <p className="ml-1 my-1 text-sm font-semibold text-info">
                            Author:{" "}
                            <span className="font-normal text-white">
                              {item.author}
                            </span>
                          </p>
                        </div>
                        <p className="ml-1 text-sm hidden lg:flex">
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
