import { defineSchema, defineTable } from "convex/server";
import { trackObject, chapterHistoryObject } from "./types";

export default defineSchema({
  reading_history: defineTable(trackObject)
    .index("by_user", ["user_id"])
    .index("by_manga", ["id"])
    .index("by_user_manga", ["user_id", "id", "provider"]),

  chapter_history: defineTable(chapterHistoryObject)
    .index("by_user_manga", ["user_id", "manga_id"])
    .index("by_user_manga_chapter", ["user_id", "manga_id", "chapter_id"]),
});
