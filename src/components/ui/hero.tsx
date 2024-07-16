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
    <div className="flex flex-row items-center p-1 bg-slate-700/50 rounded-lg">
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
      />
      <div className="ml-1 w-full">
        <p className="text-xl lg:text-2xl font-semibold">
          {data.results.title}
        </p>
        <div className="flex flex-wrap lg:flex-row items-center">
          {data.results.status && (
            <div className="badge badge-info badge-outline gap-2">
              {data.results.status}
            </div>
          )}
          {data.results.year && (
            <div className="badge badge-warning badge-outline gap-2 ml-1">
              {data.results.year}
            </div>
          )}
          {data.results.type && (
            <div className="badge badge-success badge-outline gap-2 ml-1">
              {data.results.type}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
