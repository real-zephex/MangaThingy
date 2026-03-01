"use client";

import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Pencil, Trash2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/providers/toast-provider";
import { Id } from "@/convex/_generated/dataModel";

const MAX_LENGTH = 2000;

interface CommentReplyCardProps {
  reply: {
    _id: Id<"comment_replies">;
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
  };
  currentUserId: string | null;
}

export function CommentReplyCard({
  reply,
  currentUserId,
}: CommentReplyCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);
  const [isLiking, setIsLiking] = useState(false);

  const toast = useToast();
  const updateReply = useMutation(api.functions.comments.updateReply);
  const deleteReply = useMutation(api.functions.comments.deleteReply);
  const toggleLike = useMutation(api.functions.comments.toggleLike);

  const isOwner = currentUserId === reply.user_id;
  const initials = reply.user_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleEdit = async () => {
    if (!currentUserId || editContent.trim().length === 0) return;
    try {
      await updateReply({
        reply_id: reply._id,
        user_id: currentUserId,
        content: editContent.trim(),
      });
      setIsEditing(false);
      toast.success("Reply updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update reply",
      );
    }
  };

  const handleDelete = async () => {
    if (!currentUserId) return;
    try {
      await deleteReply({
        reply_id: reply._id,
        user_id: currentUserId,
      });
      toast.success("Reply deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete reply",
      );
    }
  };

  const handleLike = async () => {
    if (!currentUserId || isLiking) return;
    setIsLiking(true);
    try {
      await toggleLike({
        target_id: reply._id,
        target_type: "reply",
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
    const posted = formatDistanceToNow(reply.created_at, {
      addSuffix: true,
    });
    if (reply.is_edited) {
      const edited = formatDistanceToNow(reply.updated_at, {
        addSuffix: true,
      });
      return `${posted} · Edited ${edited}`;
    }
    return posted;
  };

  // Deleted reply placeholder
  if (reply.is_deleted) {
    return (
      <div className="flex gap-3 py-3 opacity-60">
        <Avatar className="size-7 shrink-0">
          <AvatarFallback className="text-[10px] bg-muted">?</AvatarFallback>
        </Avatar>
        <p className="text-xs text-muted-foreground italic">[deleted by user]</p>
      </div>
    );
  }

  return (
    <div className="flex gap-3 py-3">
      <Avatar className="size-7 shrink-0">
        {reply.user_avatar && (
          <AvatarImage src={reply.user_avatar} alt={reply.user_name} />
        )}
        <AvatarFallback className="text-[10px] bg-brand-start/10 text-brand-start font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold">{reply.user_name}</span>
          <span className="text-[11px] text-muted-foreground">
            {formatTimestamp()}
          </span>
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="mt-1.5 space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-12 resize-none bg-card/50 border-border/50 text-xs"
              autoFocus
            />
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-[10px] tabular-nums",
                  editContent.length > MAX_LENGTH
                    ? "text-destructive"
                    : "text-muted-foreground",
                )}
              >
                {editContent.length}/{MAX_LENGTH}
              </span>
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(reply.content);
                  }}
                  className="gap-1 text-[10px] h-6 px-2"
                >
                  <X size={10} />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleEdit}
                  disabled={
                    editContent.trim().length === 0 ||
                    editContent.length > MAX_LENGTH
                  }
                  className="gap-1 text-[10px] h-6 px-2"
                >
                  <Check size={10} />
                  Save
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs mt-0.5 whitespace-pre-wrap break-words text-foreground/90">
            {reply.content}
          </p>
        )}

        {/* Actions */}
        {!isEditing && (
          <div className="flex items-center gap-0.5 mt-1 -ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={!currentUserId || isLiking}
              className={cn(
                "gap-1 text-[11px] h-6 px-1.5",
                reply.user_liked
                  ? "text-red-500 hover:text-red-600"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Heart
                size={11}
                className={cn(reply.user_liked && "fill-current")}
              />
              {reply.likes_count > 0 && (
                <span className="tabular-nums">{reply.likes_count}</span>
              )}
            </Button>

            {isOwner && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(true);
                    setEditContent(reply.content);
                  }}
                  className="gap-1 text-[11px] h-6 px-1.5 text-muted-foreground hover:text-foreground"
                >
                  <Pencil size={10} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="gap-1 text-[11px] h-6 px-1.5 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={10} />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
