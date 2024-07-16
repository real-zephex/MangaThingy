"use server";

import Image from "next/image";
import { Key } from "react";
import { ImageUrls } from "../data/types";

const ImageDisplay = async (data: ImageUrls, provider: string) => {
  var mangapillCondition: boolean;
  if (provider == "mangapill" || provider == "manganato") {
    mangapillCondition = true;
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
            src={
              mangapillCondition
                ? `/api/?provider=${provider}&imageUrl=${encodeURIComponent(
                    item
                  )}`
                : `/api/?imageUrl=${encodeURIComponent(item)}`
            }
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
