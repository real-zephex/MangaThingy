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
        // Check if an entry already exists for this user and manga
        const existingEntry = await ctx.db
          .query("reading_history")
          .withIndex("by_user", (q) => q.eq("user_id", item.user_id))
          .filter((q) => q.eq(q.field("id"), item.id))
          .first();

        if (existingEntry) {
          // Update existing entry
          await ctx.db.patch(existingEntry._id, {
            title: item.title,
            image: item.image,
            provider: item.provider,
            status: item.status,
            chapter: item.chapter,
            totalChapter: item.totalChapter,
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
      throw new ConvexError(`Error syncing reading history: ${(error as Error).message}`);
    }
  },
});

// Optional: Add a mutation to update a single entry
export const updateReadingHistory = mutation({
  args: {
    user_id: v.string(),
    manga_id: v.string(),
    updates: v.object({
      title: v.optional(v.string()),
      image: v.optional(v.string()),
      provider: v.optional(v.string()),
      status: v.optional(v.string()),
      chapter: v.optional(v.string()),
      totalChapter: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    try {
      const existingEntry = await ctx.db
        .query("reading_history")
        .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
        .filter((q) => q.eq(q.field("id"), args.manga_id))
        .first();

      if (!existingEntry) {
        throw new Error("Entry not found");
      }

      await ctx.db.patch(existingEntry._id, args.updates);
      return { success: true, id: existingEntry._id };
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Error updating reading history: ${errorMessage}`);
    }
  },
});

// Optional: Add a mutation to delete an entry
export const deleteReadingHistory = mutation({
  args: {
    user_id: v.string(),
    manga_id: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const existingEntry = await ctx.db
        .query("reading_history")
        .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
        .filter((q) => q.eq(q.field("id"), args.manga_id))
        .first();

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
