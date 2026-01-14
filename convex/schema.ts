import { defineSchema, defineTable } from "convex/server";
import { trackObject } from "./types";

export default defineSchema({
  reading_history: defineTable(trackObject)
    .index("by_user", ["user_id"])
    .index("by_manga", ["id"]),
});
