import { cache } from "react";
import { fetchWrapper } from "./manga.service";
import { Results, Manga, MangaInfo, MangaInfoResults } from "./manga.types";

export const MangapillService = {
  search: cache((query: string): Promise<Results<Manga>> =>
    fetchWrapper(`/mangapill/search/${encodeURIComponent(query)}`)),
  getInfo: cache((id: string): Promise<MangaInfoResults<MangaInfo>> =>
    fetchWrapper(`/mangapill/info/${encodeURIComponent(id)}`)),
  getPages: cache((chapterId: string): Promise<Results<string>> =>
    fetchWrapper(`/mangapill/pages/${encodeURIComponent(chapterId)}`)),
  getNewest: cache((): Promise<Results<Manga>> => fetchWrapper("/mangapill/newest")),
};

export const AsurascansService = {
  search: cache((query: string): Promise<Results<Manga>> =>
    fetchWrapper(`/asurascans/search/${encodeURIComponent(query)}`)),
  getInfo: cache((id: string): Promise<MangaInfoResults<MangaInfo>> =>
    fetchWrapper(`/asurascans/info/${encodeURIComponent(id)}`)),
  getPages: cache((chapterId: string): Promise<Results<string>> =>
    fetchWrapper(`/asurascans/pages/${encodeURIComponent(chapterId)}`)),
  getPopular: cache((): Promise<Results<Manga>> =>
    fetchWrapper("/asurascans/popular")),
  getLatest: cache((page: number = 1): Promise<Results<Manga>> =>
    fetchWrapper(`/asurascans/latest/${page}`)),
  getGenres: cache((type: string): Promise<Results<Manga>> =>
    fetchWrapper(`/asurascans/genres/${type}`)),
  getGenreList: cache((): Promise<Results<string>> =>
    fetchWrapper("/asurascans/genre-list")),
};
