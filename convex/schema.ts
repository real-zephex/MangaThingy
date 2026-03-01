import { defineSchema, defineTable } from "convex/server";
import {
  trackObject,
  chapterHistoryObject,
  commentObject,
  commentReplyObject,
  commentLikeObject,
  commentRateLimitObject,
} from "./types";

export default defineSchema({
  reading_history: defineTable(trackObject)
    .index("by_user", ["user_id"])
    .index("by_manga", ["id"])
    .index("by_user_manga", ["user_id", "id", "provider"]),

  chapter_history: defineTable(chapterHistoryObject)
    .index("by_user_manga", ["user_id", "manga_id"])
    .index("by_user_manga_chapter", ["user_id", "manga_id", "chapter_id"]),

  // ============ Commenting System ============
  manga_comments: defineTable(commentObject)
    .index("by_manga", ["manga_id", "provider"])
    .index("by_user", ["user_id"])
    .index("by_manga_created", ["manga_id", "provider", "created_at"]),

  comment_replies: defineTable(commentReplyObject)
    .index("by_parent", ["parent_comment_id"])
    .index("by_parent_created", ["parent_comment_id", "created_at"])
    .index("by_user", ["user_id"]),

  comment_likes: defineTable(commentLikeObject)
    .index("by_target", ["target_id", "target_type"])
    .index("by_user_target", ["user_id", "target_id", "target_type"]),

  comment_rate_limits: defineTable(commentRateLimitObject)
    .index("by_user", ["user_id"]),
});
