import Image from "next/image";
import { GogoanimeInfo } from "../data/types";
import { useMemo } from "react";

const AnimeInformation = async ({
  animeInfo,
}: {
  animeInfo: GogoanimeInfo;
}) => {
  const info = useMemo(() => animeInfo, [animeInfo]);

  return (
    <main className="w-full mt-2">
      <div className="flex flex-row items-center p-1 bg-slate-700/50 rounded-md">
        <Image
          src={info.image}
          height={200}
          width={150}
          alt="Anime Poster"
          className="rounded-md border-2 border-zinc-700"
        />
        <div className="ml-2\1 flex flex-col">
          <p className="text-2xl font-semibold">{info.title}</p>
          <div className="flex flex-wrap items-center">
            {info.status && (
              <div className="badge badge-info ml-1 ">{info.status}</div>
            )}
          </div>
        </div>
      </div>
      <div role="tablist" className="tabs tabs-boxed mt-2">
        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="Description"
          defaultChecked
        />
        <div role="tabpanel" className="tab-content p-2">
          <p>{info.description}</p>
        </div>

        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="Info"
        />
        <div role="tabpanel" className="tab-content p-2">
          <p>Type: {info.type}</p>
          <p>SUB or DUB: {info.subOrDub}</p>
        </div>
      </div>
    </main>
  );
};

export default AnimeInformation;
