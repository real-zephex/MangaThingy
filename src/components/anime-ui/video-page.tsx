"use client";
import { GogoanimeEpisodes } from "../data/types";
import { useState, useEffect } from "react";
import { animeVideoLink } from "../data/requests";
import loadVideoPlayer from "./video-loader";

const AnimeVideoPage = ({ data }: { data: GogoanimeEpisodes[] }) => {
  const [currentIndex, setIndex] = useState<number>(0);
  const [videoPlayer, setVideoPlayer] = useState<JSX.Element>(
    <div className="flex flex-col gap-4 justify-center">
      <div className="skeleton h-72 w-full"></div>
    </div>
  );

  useEffect(() => {
    const getFirstVidLink = async (id: string) => {
      const data = await animeVideoLink(id);
      const url = data.sources[data.sources.length - 2].url;
      const vidPlay = loadVideoPlayer(url, "Episode 1");
      setVideoPlayer(vidPlay);
    };

    getFirstVidLink(data[0].id);
  }, []);

  async function getVidLink(index: number) {
    setVideoPlayer(
      <div className="flex flex-col gap-4 justify-center">
        <div className="skeleton h-72 w-full"></div>
      </div>
    );
    const vidId = data[index].id;
    const res = await animeVideoLink(vidId);
    const url = res.sources[res.sources.length - 2].url;
    const vidPlay = loadVideoPlayer(url, `Episode ${index + 1}`);
    setVideoPlayer(vidPlay);
  }

  return (
    <main>
      <div className="flex flex-col overflow-x-hidden h-full">
        <div>{videoPlayer}</div>
        <div className="flex flex-row justify-center items-center mb-1">
          <button
            className="btn btn-warning"
            disabled={currentIndex === 0}
            onClick={() => {
              const newIndex = currentIndex - 1;
              setIndex(newIndex);
              getVidLink(newIndex);
            }}
          >
            Previous
          </button>
          <div className="divider divider-horizontal">OR</div>
          <button
            className="btn btn-success"
            disabled={currentIndex === data.length - 1}
            onClick={() => {
              const newIndex = currentIndex + 1;
              setIndex(newIndex);
              getVidLink(newIndex);
            }}
          >
            Next
          </button>
        </div>
        <div className="bg-base-300 flex flex-col overflow-auto h-auto rounded-md">
          <section className="ml-2 my-2">
            <p className="font-semibold text-2xl text-secondary">Episodes</p>
          </section>
          <div className="flex flex-col h-60 overflow-auto p-1">
            {data.map((item, index) => (
              <button
                className="btn mb-2"
                key={index}
                onClick={() => {
                  setIndex(index);
                  getVidLink(index);
                }}
              >
                Episode {item.number.toString()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AnimeVideoPage;
