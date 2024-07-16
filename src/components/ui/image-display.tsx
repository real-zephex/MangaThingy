"use server";

import Image from "next/image";
import { Key } from "react";
import { ImageUrls } from "../data/types";

const proxy = "https://sup-proxy.zephex0-f6c.workers.dev/api-content?url=";

const ImageDisplay = async (data: ImageUrls, provider: string) => {
  var mangapillCondition: boolean;
  var referer: string = "";
  var refererCollection = {
    mangapill: "https://mangapill.com/",
    manganato: "https://chapmanganato.to/",
  };

  if (provider == "mangapill" || provider == "manganato") {
    mangapillCondition = true;
    referer = refererCollection[provider];
  }

  return (
    <div className="mt-1 flex flex-col items-center w-full">
      {data &&
        data.results.length > 0 &&
        data.results.map((item: string, index: Key | null | undefined) => (
          <Image
            width={1080}
            height={4000}
            key={index}
            src={`${proxy}${item}&headers="${referer}"`}
            alt="Manga Page"
            className="w-full h-full"
            priority
            unoptimized
          ></Image>
        ))}
    </div>
  );
};

export default ImageDisplay;
