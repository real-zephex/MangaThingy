export interface FlamescansPopular {
  status: Number;
  results: FlamescansPopularEntries[];
}

interface FlamescansPopularEntries {
  img: string;
  title: string;
  id: string;
  date: string;
  author: string;
  description: string;
}

export interface Search {
  status: Number;
  results: SearchResults[];
}

interface SearchResults {
  title: string;
  id: string;
  image: string;
  status: string;
  genres?: string[] | string;
  chapters?: string;
  type?: string;
  author?: string;
  heading?: string;
  updated?: string;
  year?: string;
  subheading?: string;
  releaseDate?: string;
  subOrDub?: string;
}

export interface MangaInfo {
  status: Number;
  results: MangaInfoResults;
}

interface MangaInfoResults {
  title: string;
  image: string;
  description?: string;
  type: string;
  status: string;
  year?: string;
  genres?: string[] | string;
  author?: string | string[];
  chapters: ChapterResults[];
  "alt-title"?: string;
}

interface ChapterResults {
  id: string;
  title: string;
}

export interface ImageUrls {
  status: Number;
  results: string[];
}

export interface GogoanimeSearch {
  currentPage: number;
  hasNextPage: boolean;
  results: GogoAnimeSearchResults[];
}

interface GogoAnimeSearchResults {
  id: string;
  title: string;
  url?: string;
  image: string;
  releaseDate: string;
  subOrDub: string;
  episodeNumber: number;
  status?: string;
  chapters?: string;
}

export interface GogoanimeInfo {
  id: string;
  title: string;
  url: string;
  genres: string[];
  totalEpisodes: number;
  image: string;
  description: string;
  releaseDate: string;
  subOrDub: string;
  type: string;
  status: string;
  episodes: GogoanimeEpisodes[];
}

export interface GogoanimeEpisodes {
  id: string;
  number: Number;
  url: string;
}

export interface GogoanimeVideo {
  headers: { Referer: string };
  sources: GogovideoResults[];
  download: string;
}

interface GogovideoResults {
  url: string;
  isM3U8: string;
  quality: string;
}
