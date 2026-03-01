import { query } from "../_generated/server";
import { v } from "convex/values";

// Get all reading history for a specific user
export const getReadingHistory = query({
  args: {
    user_id: v.string(),
  },
  handler: async (ctx, args) => {
    const history = await ctx.db
      .query("reading_history")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .collect();
    return history;
  },
});

// Check if a specific manga entry exists for a user (with optional provider for composite key)
export const getExistingEntry = query({
  args: {
    user_id: v.string(),
    manga_id: v.string(),
    provider: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.provider) {
      const entry = await ctx.db
        .query("reading_history")
        .withIndex("by_user_manga", (q) =>
          q
            .eq("user_id", args.user_id)
            .eq("id", args.manga_id)
            .eq("provider", args.provider!),
        )
        .first();
      return entry;
    }

    // Fallback: lookup by user + manga id only
    const entry = await ctx.db
      .query("reading_history")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .filter((q) => q.eq(q.field("id"), args.manga_id))
      .first();
    return entry;
  },
});

// Get a specific manga's reading history across all users
export const getMangaHistory = query({
  args: {
    manga_id: v.string(),
  },
  handler: async (ctx, args) => {
    const history = await ctx.db
      .query("reading_history")
      .withIndex("by_manga", (q) => q.eq("id", args.manga_id))
      .collect();
    return history;
  },
});

// Get multiple entries by user_id and manga_ids (batch check)
export const checkExistingEntries = query({
  args: {
    user_id: v.string(),
    manga_ids: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existingEntries = await ctx.db
      .query("reading_history")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .collect();

    // Create a map of manga_id to entry for quick lookup
    const entriesMap = new Map();
    for (const entry of existingEntries) {
      if (args.manga_ids.includes(entry.id)) {
        entriesMap.set(entry.id, entry);
      }
    }

    return entriesMap;
  },
});

// Get all chapters read for a specific manga by a user
export const getChapterHistory = query({
  args: {
    user_id: v.string(),
    manga_id: v.string(),
  },
  handler: async (ctx, args) => {
    const chapters = await ctx.db
      .query("chapter_history")
      .withIndex("by_user_manga", (q) =>
        q.eq("user_id", args.user_id).eq("manga_id", args.manga_id),
      )
      .collect();
    return chapters;
  },
});

// Check if a specific chapter has been read
export const isChapterRead = query({
  args: {
    user_id: v.string(),
    manga_id: v.string(),
    chapter_id: v.string(),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db
      .query("chapter_history")
      .withIndex("by_user_manga_chapter", (q) =>
        q
          .eq("user_id", args.user_id)
          .eq("manga_id", args.manga_id)
          .eq("chapter_id", args.chapter_id),
      )
      .first();
    return entry !== null;
  },
});
