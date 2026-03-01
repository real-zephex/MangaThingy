"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth, useUser } from "@clerk/nextjs";
import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils";

const MAX_LENGTH = 2000;

interface CommentFormProps {
  mangaId: string;
  provider: string;
}

export function CommentForm({ mangaId, provider }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const toast = useToast();
  const addComment = useMutation(api.functions.comments.addComment);

  const charCount = content.length;
  const isOverLimit = charCount > MAX_LENGTH;
  const canSubmit = content.trim().length > 0 && !isOverLimit && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit || !isSignedIn || !userId || !user) return;

    setIsSubmitting(true);
    try {
      await addComment({
        manga_id: mangaId,
        provider,
        user_id: userId,
        user_name:
          user.fullName || user.username || user.firstName || "Anonymous",
        user_avatar: user.imageUrl,
        content: content.trim(),
      });
      setContent("");
      toast.success("Comment posted");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to post comment";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="rounded-lg border border-border/50 bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Sign in to join the discussion
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Share your thoughts about this manga..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-24 resize-none bg-card/50 border-border/50 focus-visible:border-brand-start/50"
        disabled={isSubmitting}
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
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="gap-2"
        >
          <Send size={14} />
          Post Comment
        </Button>
      </div>
    </div>
  );
}
