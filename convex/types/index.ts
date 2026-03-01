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

// ============ Comment Types ============

export const commentObject = v.object({
  manga_id: v.string(),
  provider: v.string(),
  user_id: v.string(),
  user_name: v.string(),
  user_avatar: v.optional(v.string()),
  content: v.string(),
  is_deleted: v.boolean(),
  created_at: v.number(),
  updated_at: v.number(),
  is_edited: v.boolean(),
  likes_count: v.number(),
  reply_count: v.number(),
});

export type CommentObject = Infer<typeof commentObject>;

export const commentReplyObject = v.object({
  parent_comment_id: v.id("manga_comments"),
  manga_id: v.string(),
  provider: v.string(),
  user_id: v.string(),
  user_name: v.string(),
  user_avatar: v.optional(v.string()),
  content: v.string(),
  is_deleted: v.boolean(),
  created_at: v.number(),
  updated_at: v.number(),
  is_edited: v.boolean(),
  likes_count: v.number(),
});

export type CommentReplyObject = Infer<typeof commentReplyObject>;

export const commentLikeObject = v.object({
  target_id: v.string(),
  target_type: v.union(v.literal("comment"), v.literal("reply")),
  user_id: v.string(),
  created_at: v.number(),
});

export type CommentLikeObject = Infer<typeof commentLikeObject>;

export const commentRateLimitObject = v.object({
  user_id: v.string(),
  last_comment_time: v.number(),
});

export type CommentRateLimitObject = Infer<typeof commentRateLimitObject>;
