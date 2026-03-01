import { query, mutation } from "../_generated/server";
import type { MutationCtx } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { Id } from "../_generated/dataModel";

const RATE_LIMIT_MS = 60_000; // 1 minute
const MAX_COMMENT_LENGTH = 2000;
const COMMENTS_PER_PAGE = 10;

// ============ Rate Limit Helpers ============

async function checkRateLimit(
  ctx: MutationCtx,
  userId: string,
): Promise<{ allowed: boolean; retryAfterMs: number }> {
  const record = await ctx.db
    .query("comment_rate_limits")
    .withIndex("by_user", (q) => q.eq("user_id", userId))
    .first();

  if (!record) {
    return { allowed: true, retryAfterMs: 0 };
  }

  const elapsed = Date.now() - record.last_comment_time;
  if (elapsed >= RATE_LIMIT_MS) {
    return { allowed: true, retryAfterMs: 0 };
  }

  return { allowed: false, retryAfterMs: RATE_LIMIT_MS - elapsed };
}

async function updateRateLimit(
  ctx: MutationCtx,
  userId: string,
): Promise<void> {
  const record = await ctx.db
    .query("comment_rate_limits")
    .withIndex("by_user", (q) => q.eq("user_id", userId))
    .first();

  if (record) {
    await ctx.db.patch(record._id, { last_comment_time: Date.now() });
  } else {
    await ctx.db.insert("comment_rate_limits", {
      user_id: userId,
      last_comment_time: Date.now(),
    });
  }
}

// ============ Queries ============

export const getCommentsByManga = query({
  args: {
    manga_id: v.string(),
    provider: v.string(),
    sort: v.optional(
      v.union(v.literal("newest"), v.literal("oldest"), v.literal("likes")),
    ),
    cursor: v.optional(v.number()),
    limit: v.optional(v.number()),
    user_id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? COMMENTS_PER_PAGE, 50);
    const sort = args.sort ?? "newest";

    const allComments = await ctx.db
      .query("manga_comments")
      .withIndex("by_manga", (q) =>
        q.eq("manga_id", args.manga_id).eq("provider", args.provider),
      )
      .collect();

    // Sort based on preference
    const sorted = [...allComments];
    if (sort === "newest") {
      sorted.sort((a, b) => b.created_at - a.created_at);
    } else if (sort === "oldest") {
      sorted.sort((a, b) => a.created_at - b.created_at);
    } else if (sort === "likes") {
      sorted.sort(
        (a, b) => b.likes_count - a.likes_count || b.created_at - a.created_at,
      );
    }

    // Cursor-based pagination (using index position)
    const startIndex = args.cursor ?? 0;
    const paged = sorted.slice(startIndex, startIndex + limit + 1);
    const hasMore = paged.length > limit;
    const comments = paged.slice(0, limit);

    // Enrich with user_liked info
    const enriched = await Promise.all(
      comments.map(async (comment) => {
        let user_liked = false;
        if (args.user_id) {
          const like = await ctx.db
            .query("comment_likes")
            .withIndex("by_user_target", (q) =>
              q
                .eq("user_id", args.user_id!)
                .eq("target_id", comment._id)
                .eq("target_type", "comment"),
            )
            .first();
          user_liked = !!like;
        }
        return { ...comment, user_liked };
      }),
    );

    return {
      comments: enriched,
      hasMore,
      nextCursor: hasMore ? startIndex + limit : null,
    };
  },
});

export const getRepliesByComment = query({
  args: {
    comment_id: v.id("manga_comments"),
    user_id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const replies = await ctx.db
      .query("comment_replies")
      .withIndex("by_parent_created", (q) =>
        q.eq("parent_comment_id", args.comment_id),
      )
      .collect();

    // Sort oldest first for threaded reading
    replies.sort((a, b) => a.created_at - b.created_at);

    // Enrich with user_liked info
    const enriched = await Promise.all(
      replies.map(async (reply) => {
        let user_liked = false;
        if (args.user_id) {
          const like = await ctx.db
            .query("comment_likes")
            .withIndex("by_user_target", (q) =>
              q
                .eq("user_id", args.user_id!)
                .eq("target_id", reply._id)
                .eq("target_type", "reply"),
            )
            .first();
          user_liked = !!like;
        }
        return { ...reply, user_liked };
      }),
    );

    return enriched;
  },
});

export const getCommentStats = query({
  args: {
    manga_id: v.string(),
    provider: v.string(),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("manga_comments")
      .withIndex("by_manga", (q) =>
        q.eq("manga_id", args.manga_id).eq("provider", args.provider),
      )
      .collect();

    const nonDeletedComments = comments.filter((c) => !c.is_deleted);
    return {
      total_comments: nonDeletedComments.length,
    };
  },
});

// ============ Mutations ============

export const addComment = mutation({
  args: {
    manga_id: v.string(),
    provider: v.string(),
    user_id: v.string(),
    user_name: v.string(),
    user_avatar: v.optional(v.string()),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Validate content length
      if (args.content.length === 0 || args.content.length > MAX_COMMENT_LENGTH) {
        throw new ConvexError(
          `Comment must be between 1 and ${MAX_COMMENT_LENGTH} characters.`,
        );
      }

      // Check rate limit
      const rateLimit = await checkRateLimit(ctx, args.user_id);
      if (!rateLimit.allowed) {
        const seconds = Math.ceil(rateLimit.retryAfterMs / 1000);
        throw new ConvexError(
          `Rate limited. Please wait ${seconds} seconds before posting again.`,
        );
      }

      const now = Date.now();
      const commentId = await ctx.db.insert("manga_comments", {
        manga_id: args.manga_id,
        provider: args.provider,
        user_id: args.user_id,
        user_name: args.user_name,
        user_avatar: args.user_avatar,
        content: args.content.trim(),
        is_deleted: false,
        created_at: now,
        updated_at: now,
        is_edited: false,
        likes_count: 0,
        reply_count: 0,
      });

      // Update rate limit
      await updateRateLimit(ctx, args.user_id);

      return { success: true, id: commentId };
    } catch (error) {
      if (error instanceof ConvexError) throw error;
      throw new ConvexError(
        `Error adding comment: ${(error as Error).message}`,
      );
    }
  },
});

export const updateComment = mutation({
  args: {
    comment_id: v.id("manga_comments"),
    user_id: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const comment = await ctx.db.get(args.comment_id);
      if (!comment) throw new ConvexError("Comment not found.");
      if (comment.user_id !== args.user_id)
        throw new ConvexError("You can only edit your own comments.");
      if (comment.is_deleted)
        throw new ConvexError("Cannot edit a deleted comment.");
      if (args.content.length === 0 || args.content.length > MAX_COMMENT_LENGTH)
        throw new ConvexError(
          `Comment must be between 1 and ${MAX_COMMENT_LENGTH} characters.`,
        );

      await ctx.db.patch(args.comment_id, {
        content: args.content.trim(),
        updated_at: Date.now(),
        is_edited: true,
      });

      return { success: true };
    } catch (error) {
      if (error instanceof ConvexError) throw error;
      throw new ConvexError(
        `Error updating comment: ${(error as Error).message}`,
      );
    }
  },
});

export const deleteComment = mutation({
  args: {
    comment_id: v.id("manga_comments"),
    user_id: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const comment = await ctx.db.get(args.comment_id);
      if (!comment) throw new ConvexError("Comment not found.");
      if (comment.user_id !== args.user_id)
        throw new ConvexError("You can only delete your own comments.");

      await ctx.db.patch(args.comment_id, {
        is_deleted: true,
        content: "",
        updated_at: Date.now(),
      });

      return { success: true };
    } catch (error) {
      if (error instanceof ConvexError) throw error;
      throw new ConvexError(
        `Error deleting comment: ${(error as Error).message}`,
      );
    }
  },
});

export const addReply = mutation({
  args: {
    parent_comment_id: v.id("manga_comments"),
    user_id: v.string(),
    user_name: v.string(),
    user_avatar: v.optional(v.string()),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Validate content length
      if (args.content.length === 0 || args.content.length > MAX_COMMENT_LENGTH) {
        throw new ConvexError(
          `Reply must be between 1 and ${MAX_COMMENT_LENGTH} characters.`,
        );
      }

      // Validate parent exists
      const parent = await ctx.db.get(args.parent_comment_id);
      if (!parent) throw new ConvexError("Parent comment not found.");

      // Check rate limit
      const rateLimit = await checkRateLimit(ctx, args.user_id);
      if (!rateLimit.allowed) {
        const seconds = Math.ceil(rateLimit.retryAfterMs / 1000);
        throw new ConvexError(
          `Rate limited. Please wait ${seconds} seconds before posting again.`,
        );
      }

      const now = Date.now();
      const replyId = await ctx.db.insert("comment_replies", {
        parent_comment_id: args.parent_comment_id,
        manga_id: parent.manga_id,
        provider: parent.provider,
        user_id: args.user_id,
        user_name: args.user_name,
        user_avatar: args.user_avatar,
        content: args.content.trim(),
        is_deleted: false,
        created_at: now,
        updated_at: now,
        is_edited: false,
        likes_count: 0,
      });

      // Increment parent reply_count
      await ctx.db.patch(args.parent_comment_id, {
        reply_count: parent.reply_count + 1,
      });

      // Update rate limit
      await updateRateLimit(ctx, args.user_id);

      return { success: true, id: replyId };
    } catch (error) {
      if (error instanceof ConvexError) throw error;
      throw new ConvexError(
        `Error adding reply: ${(error as Error).message}`,
      );
    }
  },
});

export const updateReply = mutation({
  args: {
    reply_id: v.id("comment_replies"),
    user_id: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const reply = await ctx.db.get(args.reply_id);
      if (!reply) throw new ConvexError("Reply not found.");
      if (reply.user_id !== args.user_id)
        throw new ConvexError("You can only edit your own replies.");
      if (reply.is_deleted)
        throw new ConvexError("Cannot edit a deleted reply.");
      if (args.content.length === 0 || args.content.length > MAX_COMMENT_LENGTH)
        throw new ConvexError(
          `Reply must be between 1 and ${MAX_COMMENT_LENGTH} characters.`,
        );

      await ctx.db.patch(args.reply_id, {
        content: args.content.trim(),
        updated_at: Date.now(),
        is_edited: true,
      });

      return { success: true };
    } catch (error) {
      if (error instanceof ConvexError) throw error;
      throw new ConvexError(
        `Error updating reply: ${(error as Error).message}`,
      );
    }
  },
});

export const deleteReply = mutation({
  args: {
    reply_id: v.id("comment_replies"),
    user_id: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const reply = await ctx.db.get(args.reply_id);
      if (!reply) throw new ConvexError("Reply not found.");
      if (reply.user_id !== args.user_id)
        throw new ConvexError("You can only delete your own replies.");

      await ctx.db.patch(args.reply_id, {
        is_deleted: true,
        content: "",
        updated_at: Date.now(),
      });

      // Decrement parent reply_count
      const parent = await ctx.db.get(reply.parent_comment_id);
      if (parent) {
        await ctx.db.patch(reply.parent_comment_id, {
          reply_count: Math.max(0, parent.reply_count - 1),
        });
      }

      return { success: true };
    } catch (error) {
      if (error instanceof ConvexError) throw error;
      throw new ConvexError(
        `Error deleting reply: ${(error as Error).message}`,
      );
    }
  },
});

export const toggleLike = mutation({
  args: {
    target_id: v.string(),
    target_type: v.union(v.literal("comment"), v.literal("reply")),
    user_id: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Check if user already liked
      const existingLike = await ctx.db
        .query("comment_likes")
        .withIndex("by_user_target", (q) =>
          q
            .eq("user_id", args.user_id)
            .eq("target_id", args.target_id)
            .eq("target_type", args.target_type),
        )
        .first();

      if (existingLike) {
        // Unlike: remove the like
        await ctx.db.delete(existingLike._id);

        // Decrement likes_count on target
        if (args.target_type === "comment") {
          const commentId = args.target_id as Id<"manga_comments">;
          const comment = await ctx.db.get(commentId);
          if (comment) {
            await ctx.db.patch(commentId, {
              likes_count: Math.max(0, comment.likes_count - 1),
            });
          }
        } else {
          const replyId = args.target_id as Id<"comment_replies">;
          const reply = await ctx.db.get(replyId);
          if (reply) {
            await ctx.db.patch(replyId, {
              likes_count: Math.max(0, reply.likes_count - 1),
            });
          }
        }

        return { success: true, liked: false };
      } else {
        // Like: add the like
        await ctx.db.insert("comment_likes", {
          target_id: args.target_id,
          target_type: args.target_type,
          user_id: args.user_id,
          created_at: Date.now(),
        });

        // Increment likes_count on target
        if (args.target_type === "comment") {
          const commentId = args.target_id as Id<"manga_comments">;
          const comment = await ctx.db.get(commentId);
          if (comment) {
            await ctx.db.patch(commentId, {
              likes_count: comment.likes_count + 1,
            });
          }
        } else {
          const replyId = args.target_id as Id<"comment_replies">;
          const reply = await ctx.db.get(replyId);
          if (reply) {
            await ctx.db.patch(replyId, {
              likes_count: reply.likes_count + 1,
            });
          }
        }

        return { success: true, liked: true };
      }
    } catch (error) {
      if (error instanceof ConvexError) throw error;
      throw new ConvexError(
        `Error toggling like: ${(error as Error).message}`,
      );
    }
  },
});
