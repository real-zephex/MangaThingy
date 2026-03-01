"use client";

import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  MessageSquare,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/providers/toast-provider";
import { Id } from "@/convex/_generated/dataModel";
import { CommentReplyForm } from "./comment-reply-form";
import { CommentReplies } from "./comment-replies";

const MAX_LENGTH = 2000;

interface CommentCardProps {
  comment: {
    _id: Id<"manga_comments">;
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
  };
  currentUserId: string | null;
}

export function CommentCard({ comment, currentUserId }: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const toast = useToast();
  const updateComment = useMutation(api.functions.comments.updateComment);
  const deleteComment = useMutation(api.functions.comments.deleteComment);
  const toggleLike = useMutation(api.functions.comments.toggleLike);

  const isOwner = currentUserId === comment.user_id;
  const initials = comment.user_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleEdit = async () => {
    if (!currentUserId || editContent.trim().length === 0) return;
    try {
      await updateComment({
        comment_id: comment._id,
        user_id: currentUserId,
        content: editContent.trim(),
      });
      setIsEditing(false);
      toast.success("Comment updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update comment",
      );
    }
  };

  const handleDelete = async () => {
    if (!currentUserId) return;
    try {
      await deleteComment({
        comment_id: comment._id,
        user_id: currentUserId,
      });
      toast.success("Comment deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete comment",
      );
    }
  };

  const handleLike = async () => {
    if (!currentUserId || isLiking) return;
    setIsLiking(true);
    try {
      await toggleLike({
        target_id: comment._id,
        target_type: "comment",
        user_id: currentUserId,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to toggle like",
      );
    } finally {
      setIsLiking(false);
    }
  };

  const formatTimestamp = () => {
    const posted = formatDistanceToNow(comment.created_at, {
      addSuffix: true,
    });
    if (comment.is_edited) {
      const edited = formatDistanceToNow(comment.updated_at, {
        addSuffix: true,
      });
      return `${posted} · Edited ${edited}`;
    }
    return posted;
  };

  // Deleted comment placeholder
  if (comment.is_deleted) {
    return (
      <div className="flex gap-3 py-4 opacity-60">
        <Avatar className="size-9 shrink-0">
          <AvatarFallback className="text-xs bg-muted">?</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground italic">
            [deleted by user]
          </p>
          {comment.reply_count > 0 && (
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                className="gap-1.5 text-xs h-7 text-muted-foreground hover:text-foreground"
              >
                <MessageSquare size={12} />
                {comment.reply_count}{" "}
                {comment.reply_count === 1 ? "reply" : "replies"}
              </Button>
              {showReplies && (
                <CommentReplies
                  commentId={comment._id}
                  currentUserId={currentUserId}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 py-4">
      <Avatar className="size-9 shrink-0">
        {comment.user_avatar && (
          <AvatarImage src={comment.user_avatar} alt={comment.user_name} />
        )}
        <AvatarFallback className="text-xs bg-brand-start/10 text-brand-start font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold">{comment.user_name}</span>
          <span className="text-xs text-muted-foreground">
            {formatTimestamp()}
          </span>
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="mt-2 space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-16 resize-none bg-card/50 border-border/50 text-sm"
              autoFocus
            />
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-xs tabular-nums",
                  editContent.length > MAX_LENGTH
                    ? "text-destructive"
                    : "text-muted-foreground",
                )}
              >
                {editContent.length}/{MAX_LENGTH}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="gap-1 text-xs h-7"
                >
                  <X size={12} />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleEdit}
                  disabled={
                    editContent.trim().length === 0 ||
                    editContent.length > MAX_LENGTH
                  }
                  className="gap-1 text-xs h-7"
                >
                  <Check size={12} />
                  Save
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm mt-1 whitespace-pre-wrap break-words text-foreground/90">
            {comment.content}
          </p>
        )}

        {/* Actions */}
        {!isEditing && (
          <div className="flex items-center gap-1 mt-2 -ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={!currentUserId || isLiking}
              className={cn(
                "gap-1.5 text-xs h-7 px-2",
                comment.user_liked
                  ? "text-red-500 hover:text-red-600"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Heart
                size={13}
                className={cn(comment.user_liked && "fill-current")}
              />
              {comment.likes_count > 0 && (
                <span className="tabular-nums">{comment.likes_count}</span>
              )}
            </Button>

            {currentUserId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(!isReplying)}
                className="gap-1.5 text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                <MessageSquare size={13} />
                Reply
              </Button>
            )}

            {comment.reply_count > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                className="gap-1.5 text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                <MessageSquare size={13} />
                {comment.reply_count}{" "}
                {comment.reply_count === 1 ? "reply" : "replies"}
              </Button>
            )}

            {isOwner && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(true);
                    setEditContent(comment.content);
                  }}
                  className="gap-1 text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
                >
                  <Pencil size={12} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="gap-1 text-xs h-7 px-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={12} />
                </Button>
              </>
            )}
          </div>
        )}

        {/* Reply Form */}
        {isReplying && (
          <CommentReplyForm
            parentCommentId={comment._id}
            parentAuthorName={comment.user_name}
            onCancel={() => setIsReplying(false)}
          />
        )}

        {/* Replies Thread */}
        {showReplies && (
          <CommentReplies
            commentId={comment._id}
            currentUserId={currentUserId}
          />
        )}
      </div>
    </div>
  );
}
