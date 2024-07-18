"use server";

import {
  FlamescansPopular,
  Search,
  MangaInfo,
  GogoanimeSearch,
  GogoanimeInfo,
  GogoanimeVideo,
} from "./types";

const proxy = process.env.PROXY_URL;
const consumet = process.env.CONSUMET_URL;

export const FlamescansPopularData = async (type: string) => {
  var url = "";
  if (type == "update") {
    url = "https://mscrapers.vercel.app/manganato/latest/";
  } else if (type == "popular") {
    url = "https://mscrapers.vercel.app/manganato/hottest/";
  } else if (type == "added")
    url = "https://mscrapers.vercel.app/manganato/newest/";

  const res = await fetch(url, { next: { revalidate: 21600 } });
  const content: FlamescansPopular = await res.json();
  return content;
};

export const SearchMangas = async (provider: string, title: string) => {
  const res = await fetch(
    `https://manga-scrapers.onrender.com/${provider}/search/${title}`,
    {
      next: { revalidate: 21600 },
    }
  );
  const content: Search = await res.json();
  return content;
};

export const MangaInfoFetcher = async (provider: string, id: string) => {
  const res = await fetch(
    `https://manga-scrapers.onrender.com/${provider}/info/${id}`,
    { next: { revalidate: 21600 } }
  );
  const content: MangaInfo = await res.json();
  return content;
};

export const imageFetcher = async (id: string, provider: string) => {
  const res = await fetch(
    `https://mscrapers.vercel.app/${provider}/pages/${id}`,
    { cache: "force-cache" }
  );
  const data = await res.json();
  return data;
};

// ANIME RELATED REQUESTS
export const animeTypeSearch = async (type: string) => {
  const url = `${consumet}/anime/gogoanime/${type}`;
  const res = await fetch(url, {
    next: { revalidate: 21600 },
  });
  const data: GogoanimeSearch = await res.json();
  return data;
};

export const animeInfo = async (id: string) => {
  const url = `${consumet}/anime/gogoanime/info/${id}`;
  const res = await fetch(url, {
    next: { revalidate: 21600 },
  });
  const data: GogoanimeInfo = await res.json();
  return data;
};

export const animeVideoLink = async (id: string) => {
  const url = `${consumet}/anime/gogoanime/watch/${id}`;
  const res = await fetch(url, { cache: "force-cache" });
  const data: GogoanimeVideo = await res.json();
  return data;
};
