import { Id } from "@/convex/_generated/dataModel";

// ============ Comment Types ============

export interface MangaComment {
  _id: Id<"manga_comments">;
  manga_id: string;
  provider: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  is_deleted: boolean;
  created_at: number;
  updated_at: number;
  is_edited: boolean;
  likes_count: number;
  reply_count: number;
  user_liked?: boolean;
}

export interface CommentReply {
  _id: Id<"comment_replies">;
  parent_comment_id: Id<"manga_comments">;
  manga_id: string;
  provider: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  is_deleted: boolean;
  created_at: number;
  updated_at: number;
  is_edited: boolean;
  likes_count: number;
  user_liked?: boolean;
}

export interface CommentWithReplies extends MangaComment {
  replies: CommentReply[];
}

export interface CommentsPayload {
  comments: MangaComment[];
  hasMore: boolean;
  nextCursor: string | null;
}

export type CommentSortOption = "newest" | "oldest" | "likes";
