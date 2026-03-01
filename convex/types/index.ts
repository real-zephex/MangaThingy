import { Infer, v } from "convex/values";

export const trackObject = v.object({
  user_id: v.string(),
  id: v.string(),
  title: v.string(),
  image: v.string(),
  provider: v.optional(v.string()),
  status: v.string(),
  chapter: v.optional(v.string()),
  chapterId: v.optional(v.string()),
  chapterTitle: v.optional(v.string()),
  totalChapter: v.optional(v.string()),
  rating: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
});

export type TrackObject = Infer<typeof trackObject>;

export const chapterHistoryObject = v.object({
  user_id: v.string(),
  manga_id: v.string(),
  provider: v.string(),
  chapter_id: v.string(),
  chapter_title: v.string(),
  read_at: v.number(),
});

export type ChapterHistoryObject = Infer<typeof chapterHistoryObject>;
