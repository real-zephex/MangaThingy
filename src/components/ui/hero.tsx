"use server";

import { MangaInfo } from "../data/types";
import Image from "next/image";

const HeroSection = async ({
  data,
  provider,
}: {
  data: MangaInfo;
  provider: string;
}) => {
  return (
    <div
      className="flex flex-row items-center p-1 bg-slate-700/50 rounded-lg"
      aria-label="Hero Section"
    >
      <Image
        src={
          provider == "mangapill"
            ? `https://manga-scrapers.onrender.com/mangapill/images/${data.results.image}`
            : data.results.image
        }
        width={200}
        height={250}
        alt="Manga Poster Image"
        className="border-4 border-zinc-700 rounded-md h-full w-44"
        aria-label="Manga Poster Image"
      />
      <div className="ml-1 w-full" aria-label="Manga Details">
        <p
          className="text-xl lg:text-2xl font-semibold"
          aria-label="Manga Title"
          title={data.results.title}
        >
          {data.results.title}
        </p>
        <div
          className="flex flex-wrap lg:flex-row items-center"
          aria-label="Manga Metadata"
        >
          {data.results.status && (
            <div
              className="badge badge-info badge-outline gap-2"
              aria-label="Manga Status"
              title={`Status: ${data.results.status}`}
            >
              {data.results.status}
            </div>
          )}
          {data.results.year && (
            <div
              className="badge badge-warning badge-outline gap-2 ml-1"
              aria-label="Manga Year"
              title={`Year: ${data.results.year}`}
            >
              {data.results.year}
            </div>
          )}
          {data.results.type && (
            <div
              className="badge badge-success badge-outline gap-2 ml-1"
              aria-label="Manga Type"
              title={`Type: ${data.results.type}`}
            >
              {data.results.type}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
