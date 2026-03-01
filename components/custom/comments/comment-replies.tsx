"use client";

import { useCommentReplies } from "@/convex/functions/retrieve";
import { Id } from "@/convex/_generated/dataModel";
import { CommentReplyCard } from "./comment-reply-card";
import { Skeleton } from "@/components/ui/skeleton";

interface CommentRepliesProps {
  commentId: Id<"manga_comments">;
  currentUserId: string | null;
}

export function CommentReplies({
  commentId,
  currentUserId,
}: CommentRepliesProps) {
  const replies = useCommentReplies({
    comment_id: commentId,
    user_id: currentUserId ?? undefined,
  });

  if (replies === undefined) {
    return (
      <div className="pl-10 mt-2 space-y-3 border-l-2 border-border/30 ml-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-3 py-2">
            <Skeleton className="size-7 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (replies.length === 0) return null;

  return (
    <div className="pl-10 mt-2 border-l-2 border-border/30 ml-4">
      {replies.map((reply) => (
        <CommentReplyCard
          key={reply._id}
          reply={reply}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
