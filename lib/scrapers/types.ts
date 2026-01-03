import { z } from "zod";

// ============ Shared Types ============
export const MangaChapterSchema = z.object({
  title: z.string(),
  id: z.string(),
  date: z.string().optional(),
});

export type MangaChapter = z.infer<typeof MangaChapterSchema>;

export const MangaSearchResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string(),
  subheading: z.string().optional(),
  type: z.string().optional(),
  year: z.string().optional(),
  status: z.string().optional(),
  chapters: z.string().optional(),
});

export type MangaSearchResult = z.infer<typeof MangaSearchResultSchema>;

export const MangaInfoSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string(),
  description: z.string(),
  type: z.string(),
  status: z.string(),
  year: z.string(),
  genres: z.array(z.string()),
  chapters: z.array(MangaChapterSchema),
  author: z.string().optional(),
  artists: z.string().optional(),
  serialization: z.string().optional(),
});

export type MangaInfo = z.infer<typeof MangaInfoSchema>;

export const ScraperResponseSchema = z.object({
  status: z.number(),
  results: z.any(),
});

export type ScraperResponse<T> = {
  status: number;
  results: T | string | unknown;
};

// ============ Mangapill Specific ============
export const MangapillSearchResultSchema = MangaSearchResultSchema;
export type MangapillSearchResult = MangaSearchResult;

export const MangapillInfoSchema = MangaInfoSchema;
export type MangapillInfo = MangaInfo;

// ============ Asurascans Specific ============
export const AsuraScansSearchResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string(),
  chapters: z.string(),
});

export type AsuraScansSearchResult = z.infer<
  typeof AsuraScansSearchResultSchema
>;

export const AsuraScansInfoSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string(),
  description: z.string(),
  status: z.string(),
  type: z.string(),
  year: z.string(),
  author: z.array(z.string()).optional(),
  artists: z.array(z.string()).optional(),
  serialization: z.array(z.string()).optional(),
  genres: z.string(),
  chapters: z.array(MangaChapterSchema),
});

export type AsuraScansInfo = z.infer<typeof AsuraScansInfoSchema>;

// ============ API Response Types ============
export const APIErrorResponseSchema = z.object({
  status: z.number(),
  results: z.string(),
});

export type APIErrorResponse = z.infer<typeof APIErrorResponseSchema>;
