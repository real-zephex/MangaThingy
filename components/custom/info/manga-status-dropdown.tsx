"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgressTracker } from "@/lib/progress/tracker";
import { MangaInfo } from "@/lib/services/manga.types";
import { useToast } from "@/components/providers/toast-provider";
import { useState, useEffect, useMemo } from "react";
import {
  Trash2,
  Bookmark,
  PlayCircle,
  CheckCircle2,
  PauseCircle,
  Plus,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";

interface MangaStatusDropdownProps {
  manga: MangaInfo;
  provider: string;
}

const statusConfig = {
  Planning: { icon: Bookmark, color: "text-blue-500", bg: "bg-blue-500/10" },
  Reading: {
    icon: PlayCircle,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  Completed: {
    icon: CheckCircle2,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  Halted: {
    icon: PauseCircle,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
};

export function MangaStatusDropdown({
  manga,
  provider,
}: MangaStatusDropdownProps) {
  const toast = useToast();
  const [status, setStatus] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const tracker = useMemo(() => new ProgressTracker(), []);
  const { isLoaded, isSignedIn, userId } = useAuth();
  const deleteMutation = useMutation(
    api.functions.mutations.deleteReadingHistory,
  );
  const upsertMutation = useMutation(
    api.functions.mutations.upsertReadingHistory,
  );
  const ratingMutation = useMutation(api.functions.mutations.updateRating);

  const initialData = useMemo(
    () => tracker.getOne(manga.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [manga.id],
  );

  useEffect(() => {
    if (initialData) {
      setStatus(initialData.status);
      setRating(initialData.rating ?? 0);
    }
  }, [initialData]);

  const handleStatusChange = async (value: string) => {
    if (value === "untrack") {
      tracker.remove(manga.id, provider);
      setStatus("");
      setRating(0);
      toast.success(`Manga ${manga.title} has been untracked`);

      if (isLoaded && isSignedIn && userId) {
        try {
          const result = await deleteMutation({
            user_id: userId,
            manga_id: manga.id,
            provider,
          });
          if (result.success) {
            toast.info(
              `Manga ${manga.title} has been removed from your tracking list in db.`,
            );
          }
        } catch (error) {
          console.error(
            "[MangaStatusDropdown] Error deleting from Convex:",
            error,
          );
        }
      }
      return;
    }

    const currentProgress = tracker.getOne(manga.id);
    const contents = {
      id: manga.id,
      title: manga.title || "N.A.",
      image: manga.image || manga.images,
      status: value,
      provider: provider,
      chapter: currentProgress?.chapter || "0",
      chapterId: currentProgress?.chapterId,
      chapterTitle: currentProgress?.chapterTitle,
      totalChapter: manga.chapters.length.toString(),
      rating: currentProgress?.rating,
    };

    if (!currentProgress) {
      tracker.addSingle(contents);
    } else {
      tracker.update(contents);
    }

    setStatus(value);
    toast.info(`Manga ${manga.title} marked as ${value}`);

    if (isLoaded && isSignedIn && userId) {
      try {
        await upsertMutation({
          entry: {
            user_id: userId,
            id: manga.id,
            title: manga.title || "N.A.",
            image: manga.image || manga.images,
            status: value,
            provider: provider,
            chapter: currentProgress?.chapter || "0",
            chapterId: currentProgress?.chapterId,
            chapterTitle: currentProgress?.chapterTitle,
            totalChapter: manga.chapters.length.toString(),
            rating: currentProgress?.rating,
            updatedAt: Date.now(),
          },
        });
      } catch (error) {
        console.error(
          "[MangaStatusDropdown] Error syncing to Convex:",
          error,
        );
      }
    }
  };

  const handleRating = async (value: number) => {
    const newRating = value === rating ? 0 : value;
    setRating(newRating);

    const existing = tracker.getOne(manga.id);
    if (existing) {
      tracker.update({ ...existing, rating: newRating });
    }

    if (isLoaded && isSignedIn && userId && existing) {
      try {
        await ratingMutation({
          user_id: userId,
          manga_id: manga.id,
          provider: provider,
          rating: newRating,
        });
      } catch (error) {
        console.error(
          "[MangaStatusDropdown] Error updating rating:",
          error,
        );
      }
    }
  };

  const CurrentIcon = status
    ? statusConfig[status as keyof typeof statusConfig]?.icon || Plus
    : Plus;

  return (
    <div className="flex flex-col gap-2.5">
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger
          className={cn(
            "w-full sm:w-52 h-10 rounded-lg font-semibold text-sm transition-all duration-200",
            status
              ? "bg-brand-start text-white border-brand-start hover:opacity-90"
              : "bg-card border-border/50 hover:border-brand-start/50",
          )}
        >
          <div className="flex items-center gap-2">
            <CurrentIcon
              size={16}
              className={status ? "text-white" : "text-brand-start"}
            />
            <SelectValue placeholder="Add to Library" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-lg border border-border/50 p-1">
          {Object.entries(statusConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <SelectItem
                key={key}
                value={key}
                className="rounded-md focus:bg-accent cursor-pointer py-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn("p-1 rounded-sm", config.bg)}>
                    <Icon size={14} className={config.color} />
                  </div>
                  <span className="font-medium text-sm">{key}</span>
                </div>
              </SelectItem>
            );
          })}
          {status && (
            <>
              <div className="h-px bg-border my-1 mx-1" />
              <SelectItem
                value="untrack"
                className="rounded-md focus:bg-destructive/10 focus:text-destructive cursor-pointer py-2 text-destructive"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-sm bg-destructive/10">
                    <Trash2 size={14} />
                  </div>
                  <span className="font-medium text-sm">
                    Remove from Library
                  </span>
                </div>
              </SelectItem>
            </>
          )}
        </SelectContent>
      </Select>

      {status && (
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">Rate:</span>
          <div
            className="flex items-center gap-0.5"
            role="group"
            aria-label="Rating"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 transition-transform hover:scale-110"
                aria-label={`Rate ${star} out of 5 stars`}
                aria-pressed={rating === star}
              >
                <Star
                  size={14}
                  className={cn(
                    "transition-colors",
                    (hoverRating || rating) >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/40",
                  )}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="text-[11px] text-muted-foreground ml-1">
                {rating}/5
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
