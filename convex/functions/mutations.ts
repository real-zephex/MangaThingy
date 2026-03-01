import { mutation } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { trackObject } from "../types";

export const syncReadingHistory = mutation({
  args: {
    entries: v.array(trackObject),
  },
  handler: async (ctx, args) => {
    try {
      const results = [];

      for (const item of args.entries) {
        // Check if an entry already exists for this user, manga, and provider
        const existingEntry = await ctx.db
          .query("reading_history")
          .withIndex("by_user_manga", (q) =>
            q
              .eq("user_id", item.user_id)
              .eq("id", item.id)
              .eq("provider", item.provider),
          )
          .first();

        if (existingEntry) {
          // Update existing entry
          await ctx.db.patch(existingEntry._id, {
            title: item.title,
            image: item.image,
            provider: item.provider,
            status: item.status,
            chapter: item.chapter,
            chapterId: item.chapterId,
            chapterTitle: item.chapterTitle,
            totalChapter: item.totalChapter,
            rating: item.rating,
            updatedAt: item.updatedAt,
          });
          results.push({ action: "updated", id: existingEntry._id });
        } else {
          const newId = await ctx.db.insert("reading_history", item);
          results.push({ action: "created", id: newId });
        }
      }

      return results;
    } catch (error) {
      console.error(error);
      throw new ConvexError(
        `Error syncing reading history: ${(error as Error).message}`,
      );
    }
  },
});

// Upsert a single entry (immediate write on status/chapter change)
export const upsertReadingHistory = mutation({
  args: {
    entry: trackObject,
  },
  handler: async (ctx, args) => {
    try {
      const { entry } = args;
      const existingEntry = await ctx.db
        .query("reading_history")
        .withIndex("by_user_manga", (q) =>
          q
            .eq("user_id", entry.user_id)
            .eq("id", entry.id)
            .eq("provider", entry.provider),
        )
        .first();

      if (existingEntry) {
        await ctx.db.patch(existingEntry._id, {
          title: entry.title,
          image: entry.image,
          status: entry.status,
          chapter: entry.chapter,
          chapterId: entry.chapterId,
          chapterTitle: entry.chapterTitle,
          totalChapter: entry.totalChapter,
          rating: entry.rating,
          updatedAt: entry.updatedAt,
        });
        return { action: "updated" as const, id: existingEntry._id };
      } else {
        const newId = await ctx.db.insert("reading_history", entry);
        return { action: "created" as const, id: newId };
      }
    } catch (error) {
      console.error(error);
      throw new ConvexError(
        `Error upserting reading history: ${(error as Error).message}`,
      );
    }
  },
});

// Update a single entry's fields
export const updateReadingHistory = mutation({
  args: {
    user_id: v.string(),
    manga_id: v.string(),
    provider: v.optional(v.string()),
    updates: v.object({
      title: v.optional(v.string()),
      image: v.optional(v.string()),
      provider: v.optional(v.string()),
      status: v.optional(v.string()),
      chapter: v.optional(v.string()),
      chapterId: v.optional(v.string()),
      chapterTitle: v.optional(v.string()),
      totalChapter: v.optional(v.string()),
      rating: v.optional(v.number()),
      updatedAt: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    try {
      let existingEntry;

      if (args.provider) {
        existingEntry = await ctx.db
          .query("reading_history")
          .withIndex("by_user_manga", (q) =>
            q
              .eq("user_id", args.user_id)
              .eq("id", args.manga_id)
              .eq("provider", args.provider!),
          )
          .first();
      } else {
        existingEntry = await ctx.db
          .query("reading_history")
          .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
          .filter((q) => q.eq(q.field("id"), args.manga_id))
          .first();
      }

      if (!existingEntry) {
        throw new Error("Entry not found");
      }

      await ctx.db.patch(existingEntry._id, {
        ...args.updates,
        updatedAt: args.updates.updatedAt ?? Date.now(),
      });
      return { success: true, id: existingEntry._id };
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Error updating reading history: ${errorMessage}`);
    }
  },
});

// Update rating for a tracked manga
export const updateRating = mutation({
  args: {
    user_id: v.string(),
    manga_id: v.string(),
    provider: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      const existingEntry = await ctx.db
        .query("reading_history")
        .withIndex("by_user_manga", (q) =>
          q
            .eq("user_id", args.user_id)
            .eq("id", args.manga_id)
            .eq("provider", args.provider),
        )
        .first();

      if (!existingEntry) {
        throw new Error("Entry not found. Track the manga first.");
      }

      await ctx.db.patch(existingEntry._id, {
        rating: args.rating,
        updatedAt: Date.now(),
      });
      return { success: true, id: existingEntry._id };
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Error updating rating: ${errorMessage}`);
    }
  },
});

// Delete a reading history entry
export const deleteReadingHistory = mutation({
  args: {
    user_id: v.string(),
    manga_id: v.string(),
    provider: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      let existingEntry;

      if (args.provider) {
        existingEntry = await ctx.db
          .query("reading_history")
          .withIndex("by_user_manga", (q) =>
            q
              .eq("user_id", args.user_id)
              .eq("id", args.manga_id)
              .eq("provider", args.provider!),
          )
          .first();
      } else {
        existingEntry = await ctx.db
          .query("reading_history")
          .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
          .filter((q) => q.eq(q.field("id"), args.manga_id))
          .first();
      }

      if (!existingEntry) {
        throw new Error("Entry not found");
      }

      await ctx.db.delete(existingEntry._id);
      return { success: true, id: existingEntry._id };
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Error deleting reading history: ${errorMessage}`);
    }
  },
});

// Add a chapter to the read history log
export const addChapterRead = mutation({
  args: {
    user_id: v.string(),
    manga_id: v.string(),
    provider: v.string(),
    chapter_id: v.string(),
    chapter_title: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Check if this chapter was already read (upsert)
      const existing = await ctx.db
        .query("chapter_history")
        .withIndex("by_user_manga_chapter", (q) =>
          q
            .eq("user_id", args.user_id)
            .eq("manga_id", args.manga_id)
            .eq("chapter_id", args.chapter_id),
        )
        .first();

      if (existing) {
        // Update the read_at timestamp
        await ctx.db.patch(existing._id, {
          read_at: Date.now(),
          chapter_title: args.chapter_title,
        });
        return { action: "updated" as const, id: existing._id };
      }

      const id = await ctx.db.insert("chapter_history", {
        user_id: args.user_id,
        manga_id: args.manga_id,
        provider: args.provider,
        chapter_id: args.chapter_id,
        chapter_title: args.chapter_title,
        read_at: Date.now(),
      });
      return { action: "created" as const, id };
    } catch (error) {
      console.error(error);
      throw new ConvexError(
        `Error adding chapter read: ${(error as Error).message}`,
      );
    }
  },
});
