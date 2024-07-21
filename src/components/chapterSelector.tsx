"use client";

import { MangaInfo } from "./data/types";
import { imageFetcher } from "./data/requests";
import ImageDisplay from "./ui/image-display";

import { useMemo } from "react";
import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { useState, SetStateAction, useEffect } from "react";

// Auth Related Imports
import { useSession } from "next-auth/react";

// Database Related Imports
import { QueryDatabase } from "@/database/query";
import { UpdateDatabase, WriteDatabase } from "@/database/write";

interface dbResults {
  name: string;
  chapterNumber: number;
  image: string;
}

const ChapterSelector = ({
  data,
  provider,
}: {
  data: MangaInfo;
  provider: string;
}) => {
  const { data: session, status } = useSession();
  const mangaId = usePathname();

  const newData = useMemo(() => data, [data]);
  // Latest chapter load, placing it here significantly improves the performance
  const index = newData.results.chapters?.length! - 1;

  useEffect(() => {
    if (newData.results && newData.results.chapters.length > 0) {
      getImages(newData.results.chapters[0].id);
    }
  }, []);

  useEffect(() => {
    async function GetLatestRead() {
      if (!session) {
        return;
      }

      const lastReadChapter: dbResults[] = await QueryDatabase(
        session?.user?.email!
      );
      if (lastReadChapter.length == 0) {
        setDbIndex(0);
        return;
      }

      for (let items of lastReadChapter) {
        if (items.name === mangaId) {
          setDbIndex(items.chapterNumber);
          break;
        }
      }
    }

    GetLatestRead();
  }, [session]);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showImages, setImages] = useState<JSX.Element>(<></>);
  const [dbIndex, setDbIndex] = useState<number>(0);

  const loading = (
    <span className="loading loading-infinity loading-lg mt-2"></span>
  );

  const getImages = useCallback(async (id: string) => {
    setImages(loading);
    const data = await imageFetcher(id, provider);
    const format = await ImageDisplay(data, provider);
    setImages(format);
  }, []);

  // Debounce Function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Create a debounced version of getImages
  const debouncedGetImages = useMemo(
    () => debounce(getImages, 300),
    [getImages]
  );

  // Navigation Handler
  const handleNavigation = (direction: "next" | "prev") => {
    const newIndex =
      direction === "next" ? selectedIndex + 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    debouncedGetImages(newData.results.chapters[newIndex].id);
    DatabaseHandler(newIndex);
  };

  // Database Handler
  async function DatabaseHandler(id: number) {
    if (!session) {
      return;
    }
    const email = session.user?.email!;
    console.log("Session found, proceeding!");

    const jsonFormat = {
      name: mangaId,
      chapterNumber: id,
      image: data.results.image,
    };
    setSelectedIndex(id);
    const new_data: dbResults[] = await QueryDatabase(email);
    if (new_data.length == 0) {
      await WriteDatabase(email, [jsonFormat]);
      return;
    }
    var found = false;
    for (let items of new_data) {
      if (items.name === mangaId) {
        const index = new_data.indexOf(items);
        new_data[index] = jsonFormat;
        found = true;
        break;
      }
    }
    if (!found) {
      new_data.push(jsonFormat);
    }
    await UpdateDatabase(email, new_data);
  }

  // Prevent unwanted actions on presses
  const preventUnwantedActions = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <main>
      <label className="form-control w-full">
        <div className="label" onClick={preventUnwantedActions}>
          <button
            className="btn btn-xs no-animation btn-accent"
            type="button"
            disabled={dbIndex == 0}
            onClick={() => {
              debouncedGetImages(data.results.chapters[dbIndex].id);
              setSelectedIndex(dbIndex);
            }}
          >
            Resume Reading
            <div className="badge badge-neutral">{dbIndex.toString()}</div>
          </button>
          <span className="label-text-alt">
            {newData.results.chapters?.length} chapters found
          </span>
        </div>
        <select
          className="select select-bordered w-full"
          onChange={async (event) => {
            const selectedKey: SetStateAction<string> = event.target.value;
            const selectedOption =
              event.target.options[event.target.selectedIndex];
            const index = Number(selectedOption.dataset.index);
            setSelectedIndex(index);
            debouncedGetImages(selectedKey);
            DatabaseHandler(index);
          }}
          value={newData.results.chapters[selectedIndex]?.id} // Was looking for this for so long :>
        >
          <option disabled aria-label="Disabled option key">
            Pick one
          </option>
          {newData.results.chapters?.map((item, index) => (
            <option
              key={index}
              value={item.id}
              data-index={index}
              aria-label={item.title}
            >
              {item.title}
            </option>
          ))}
        </select>
        <div className="label w-full flex flex-col items-center justify-center">
          <button
            className="btn btn-warning btn-sm w-full"
            type="button"
            onClick={() => {
              if (newData.results.chapters) {
                setSelectedIndex(index);
                debouncedGetImages(newData.results.chapters[index].id);
                DatabaseHandler(index);
              }
            }}
            aria-label="Latest chapter button"
          >
            Latest
          </button>
          <div
            className="flex w-full flex-col lg:flex-row items-center justify-center mt-1"
            onClick={preventUnwantedActions}
          >
            <button
              onClick={() => handleNavigation("prev")}
              type="button"
              disabled={selectedIndex === 0}
              className="btn btn-info btn-sm w-5/12"
              aria-label="Previous chapter button"
            >
              Previous
            </button>
            <div className="divider lg:divider-horizontal">OR</div>
            <button
              onClick={() => handleNavigation("next")}
              type="button"
              disabled={selectedIndex === newData.results.chapters?.length! - 1}
              className="btn btn-success btn-sm w-5/12"
              aria-label="Next chapter button"
            >
              Next
            </button>
          </div>
        </div>
      </label>
      <div className="flex items-center flex-col justify-center">
        <p className="mb-2">
          {newData.results.chapters.length > 0
            ? newData.results.chapters[selectedIndex].title
            : ""}
        </p>
        <section
          className="w-full flex  justify-center"
          onClick={(event) => {
            event.preventDefault();
            window.scrollBy({
              top: 800,
              behavior: "smooth",
            });
          }}
          onContextMenu={(event) => {
            event.preventDefault();
            window.scrollBy({
              top: -800,
              behavior: "smooth",
            });
          }}
        >
          {showImages}
        </section>
      </div>
      <div
        className="flex w-full flex-col lg:flex-row items-center justify-center mt-1"
        onClick={preventUnwantedActions}
      >
        <button
          onClick={() => handleNavigation("prev")}
          type="button"
          disabled={selectedIndex === 0}
          className="btn btn-info btn-sm w-5/12"
          aria-label="Previous chapter button"
        >
          Previous
        </button>
        <div className="divider lg:divider-horizontal">OR</div>
        <button
          onClick={() => handleNavigation("next")}
          type="button"
          disabled={selectedIndex === newData.results.chapters?.length! - 1}
          className="btn btn-success btn-sm w-5/12"
          aria-label="Next chapter button"
        >
          Next
        </button>
      </div>
    </main>
  );
};

export default ChapterSelector;
