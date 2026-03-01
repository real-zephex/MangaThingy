import { useQuery } from "convex/react";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { CommentSortOption } from "@/lib/types/comments";

export function GetHistoryFromDatabase({ user_id }: { user_id: string }) {
  const data = useQuery(api.functions.query.getReadingHistory, { user_id });
  return data;
}

export function GetChapterHistory({
  user_id,
  manga_id,
}: {
  user_id: string;
  manga_id: string;
}) {
  const data = useQuery(api.functions.query.getChapterHistory, {
    user_id,
    manga_id,
  });
  return data;
}

export function GetExistingEntry({
  user_id,
  manga_id,
  provider,
}: {
  user_id: string;
  manga_id: string;
  provider?: string;
}) {
  const data = useQuery(api.functions.query.getExistingEntry, {
    user_id,
    manga_id,
    provider,
  });
  return data;
}

// ============ Comment Hooks ============

export function useComments({
  manga_id,
  provider,
  sort,
  cursor,
  user_id,
}: {
  manga_id: string;
  provider: string;
  sort?: CommentSortOption;
  cursor?: number;
  user_id?: string;
}) {
  const data = useQuery(api.functions.comments.getCommentsByManga, {
    manga_id,
    provider,
    sort,
    cursor,
    user_id,
  });
  return data;
}

export function useCommentReplies({
  comment_id,
  user_id,
}: {
  comment_id: Id<"manga_comments">;
  user_id?: string;
}) {
  const data = useQuery(api.functions.comments.getRepliesByComment, {
    comment_id,
    user_id,
  });
  return data;
}

export function useCommentStats({
  manga_id,
  provider,
}: {
  manga_id: string;
  provider: string;
}) {
  const data = useQuery(api.functions.comments.getCommentStats, {
    manga_id,
    provider,
  });
  return data;
}
