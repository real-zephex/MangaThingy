import { fetchWrapper } from "./manga.service";
import { Results, Manga, MangaInfo, MangaInfoResults } from "./manga.types";


export const MangapillService = {
    search: (query: string): Promise<Results<Manga>> => fetchWrapper(`/mangapill/search/${encodeURIComponent(query)}`),
    getInfo: (id: string): Promise<MangaInfoResults<MangaInfo>> => fetchWrapper(`/mangapill/info/${id}`),
    getPages: (chapterId: string): Promise<Results<string>> => fetchWrapper(`/mangapill/pages/${chapterId}`),
    getNewest: (): Promise<Results<Manga>> => fetchWrapper('/mangapill/newest'),
};

export const AsurascansService = {
    search: (query: string): Promise<Results<Manga>> => fetchWrapper(`/asurascans/search/${encodeURIComponent(query)}`),
    getInfo: (id: string): Promise<MangaInfoResults<MangaInfo>> => fetchWrapper(`/asurascans/info/${id}`),
    getPages: (chapterId: string): Promise<Results<string>> => fetchWrapper(`/asurascans/pages/${chapterId}`),
    getPopular: (): Promise<Results<Manga>> => fetchWrapper('/asurascans/popular'),
    getLatest: (page: number = 1): Promise<Results<Manga>> => fetchWrapper(`/asurascans/latest/${page}`),
    getGenres: (type: string): Promise<Results<Manga>> => fetchWrapper(`/asurascans/genres/${type}`),
    getGenreList: (): Promise<Results<string>> => fetchWrapper('/asurascans/genre-list'),
};
