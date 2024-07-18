"use client";

import { MangaInfo } from "./data/types";
import { imageFetcher } from "./data/requests";
import ImageDisplay from "./ui/image-display";

import { useMemo } from "react";
import { useCallback } from "react";
import { useState, SetStateAction, useEffect } from "react";

const ChapterSelector = ({
  data,
  provider,
}: {
  data: MangaInfo;
  provider: string;
}) => {
  const newData = useMemo(() => data, [data]);
  // Latest chapter load, placing it here significantly improves the performance
  const index = newData.results.chapters?.length! - 1;

  useEffect(() => {
    if (newData.results && newData.results.chapters.length > 0) {
      getImages(newData.results.chapters[0].id);
    }
  }, []);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showImages, setImages] = useState<JSX.Element>(<></>);

  const getImages = useCallback(async (id: string) => {
    const loading = (
      <span className="loading loading-infinity loading-lg mt-2"></span>
    );
    setImages(loading);
    const data = await imageFetcher(id, provider);
    const format = await ImageDisplay(data, provider);
    setImages(format);
  }, []);

  return (
    <main>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Pick a chapter</span>
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
            getImages(selectedKey);
          }}
        >
          <option disabled selected>
            Pick one
          </option>
          {newData.results.chapters?.map((item, index) => (
            <option key={index} value={item.id} data-index={index}>
              {item.title}
            </option>
          ))}
        </select>
        <div className="label w-full flex flex-col items-center justify-center">
          <button
            className="btn btn-warning btn-sm w-full"
            onClick={() => {
              if (newData.results.chapters) {
                setSelectedIndex(index);
                getImages(newData.results.chapters[index].id);
              }
            }}
          >
            Latest
          </button>
          <div className="flex w-full flex-col lg:flex-row items-center justify-center mt-1">
            <button
              className="btn btn-info btn-sm w-5/12"
              disabled={selectedIndex === 0}
              onClick={() => {
                const index = selectedIndex - 1;
                setSelectedIndex(index);
                getImages(newData.results.chapters[index].id);
              }}
            >
              Previous
            </button>
            <div className="divider lg:divider-horizontal">OR</div>
            <button
              className="btn btn-success btn-sm w-5/12"
              disabled={
                selectedIndex == newData.results.chapters?.length! - 1
                  ? true
                  : false
              }
              onClick={() => {
                const index = selectedIndex + 1;
                setSelectedIndex(index);
                getImages(newData.results.chapters[index].id);
              }}
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
        {showImages}
      </div>
      <div className="flex w-full flex-col lg:flex-row items-center justify-center mt-1">
        <button
          className="btn btn-info btn-sm w-5/12"
          disabled={selectedIndex === 0 ? true : false}
          onClick={() => {
            const index = selectedIndex - 1;
            setSelectedIndex(index);
            getImages(newData.results.chapters[index].id);
          }}
        >
          Previous
        </button>
        <div className="divider lg:divider-horizontal">OR</div>
        <button
          className="btn btn-success btn-sm w-5/12"
          disabled={
            selectedIndex == newData.results.chapters?.length! - 1
              ? true
              : false
          }
          onClick={() => {
            const index = selectedIndex + 1;
            setSelectedIndex(index);
            getImages(newData.results.chapters[index].id);
          }}
        >
          Next
        </button>
      </div>
    </main>
  );
};

export default ChapterSelector;
