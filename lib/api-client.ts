import {
  MangaSearchResult,
  MangaInfo,
  AsuraScansSearchResult,
  AsuraScansInfo,
  ScraperResponse,
} from "@/lib/scrapers/types";

const API_BASE = "/api";

// Helper function to make API calls
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.results || `API Error: ${response.statusText}`);
  }

  return response.json();
}

// ============ Mangapill API Client ============
export const mangapillAPI = {
  async search(query: string): Promise<ScraperResponse<MangaSearchResult[]>> {
    return fetchAPI(`/mangapill/search/${encodeURIComponent(query)}`);
  },

  async info(id: string): Promise<ScraperResponse<MangaInfo>> {
    return fetchAPI(`/mangapill/info/${encodeURIComponent(id)}`);
  },

  async pages(id: string): Promise<ScraperResponse<string[]>> {
    return fetchAPI(`/mangapill/pages/${encodeURIComponent(id)}`);
  },

  async newest(): Promise<ScraperResponse<MangaSearchResult[]>> {
    return fetchAPI("/mangapill/newest");
  },

  async recent(): Promise<ScraperResponse<MangaSearchResult[]>> {
    return fetchAPI("/mangapill/recent");
  },

  getImageUrl(imageUrl: string): string {
    return `${API_BASE}/mangapill/images/${encodeURIComponent(imageUrl)}`;
  },
};

// ============ Asurascans API Client ============
export const asurascansAPI = {
  async search(query: string): Promise<ScraperResponse<AsuraScansSearchResult[]>> {
    return fetchAPI(`/asurascans/search/${encodeURIComponent(query)}`);
  },

  async info(id: string): Promise<ScraperResponse<AsuraScansInfo>> {
    return fetchAPI(`/asurascans/info/${encodeURIComponent(id)}`);
  },

  async pages(id: string): Promise<ScraperResponse<string[]>> {
    return fetchAPI(`/asurascans/pages/${encodeURIComponent(id)}`);
  },

  async popular(): Promise<ScraperResponse<AsuraScansSearchResult[]>> {
    return fetchAPI("/asurascans/popular");
  },

  async latest(page: string = "1"): Promise<ScraperResponse<AsuraScansSearchResult[]>> {
    return fetchAPI(`/asurascans/latest/${encodeURIComponent(page)}`);
  },

  async genres(type: string): Promise<ScraperResponse<AsuraScansSearchResult[]>> {
    return fetchAPI(`/asurascans/genres/${encodeURIComponent(type)}`);
  },

  getGenreList(): string[] {
    return ["action", "adventure", "comedy", "romance"];
  },
};

// ============ Combined API Client ============
export const scrapersAPI = {
  mangapill: mangapillAPI,
  asurascans: asurascansAPI,

  async getAPIStatus(): Promise<{
    message: string;
    available_providers: string[];
  }> {
    return fetchAPI("/");
  },
};

export type { ScraperResponse, MangaSearchResult, MangaInfo, AsuraScansSearchResult, AsuraScansInfo };
