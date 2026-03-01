"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth, useUser } from "@clerk/nextjs";
import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

const MAX_LENGTH = 2000;

interface CommentReplyFormProps {
  parentCommentId: Id<"manga_comments">;
  parentAuthorName: string;
  onCancel: () => void;
}

export function CommentReplyForm({
  parentCommentId,
  parentAuthorName,
  onCancel,
}: CommentReplyFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const toast = useToast();
  const addReply = useMutation(api.functions.comments.addReply);

  const charCount = content.length;
  const isOverLimit = charCount > MAX_LENGTH;
  const canSubmit = content.trim().length > 0 && !isOverLimit && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit || !isSignedIn || !userId || !user) return;

    setIsSubmitting(true);
    try {
      const result = await addReply({
        parent_comment_id: parentCommentId,
        user_id: userId,
        user_name:
          user.fullName || user.username || user.firstName || "Anonymous",
        user_avatar: user.imageUrl,
        content: content.trim(),
      });
      if (!result.success) {
        toast.error(result.error ?? "Failed to post reply");
        return;
      }
      setContent("");
      toast.success("Reply posted");
      onCancel();
    } catch {
      toast.error("Failed to post reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-2 pl-10 mt-3">
      <p className="text-xs text-muted-foreground">
        Replying to{" "}
        <span className="font-semibold text-foreground">
          {parentAuthorName}
        </span>
      </p>
      <Textarea
        placeholder="Write a reply..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-16 resize-none bg-card/50 border-border/50 focus-visible:border-brand-start/50 text-sm"
        disabled={isSubmitting}
        autoFocus
      />
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-xs tabular-nums",
            isOverLimit ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {charCount}/{MAX_LENGTH}
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
            className="gap-1 text-xs h-8"
          >
            <X size={12} />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="gap-1 text-xs h-8"
          >
            <Send size={12} />
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
}
