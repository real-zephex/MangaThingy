"use client";

import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import {
  Bookmark,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useToast } from "@/components/providers/toast-provider";
import { SyncStatusPill } from "@/components/custom/info/sync-status-pill";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { ProgressTracker } from "@/lib/progress/tracker";
import { MangaInfo } from "@/lib/services/manga.types";
import { cn } from "@/lib/utils";
import { useTracking } from "@/providers/TrackingProvider";

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

export const MangaStatusDropdown = ({
  manga,
  provider,
}: MangaStatusDropdownProps) => {
  const toast = useToast();
  const [status, setStatus] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [liveMessage, setLiveMessage] = useState<string>("");
  const lastToastAtRef = useRef<number>(0);
  const tracker = useMemo(() => new ProgressTracker(), []);
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { syncState } = useTracking();
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

  const helperText = useMemo(() => {
    if (!status) {
      return "Not tracked yet";
    }

    if (!isSignedIn) {
      return "Tracked locally";
    }

    if (syncState === "loading") {
      return "Sync pending";
    }

    if (syncState === "synced") {
      return "Synced to account";
    }

    if (syncState === "error") {
      return "Sync issue";
    }

    return "Tracked locally";
  }, [isSignedIn, status, syncState]);

  const maybeToast = (message: string) => {
    const now = Date.now();
    if (now - lastToastAtRef.current > 850) {
      toast.info(message);
      lastToastAtRef.current = now;
    }
    setLiveMessage(message);
  };

  const handleStatusChange = async (value: string) => {
    if (value === "untrack") {
      tracker.remove(manga.id, provider);
      setStatus("");
      setRating(0);
      setLiveMessage(`Removed ${manga.title} from library`);
      toast.success(`Manga ${manga.title} has been untracked`);

      if (isLoaded && isSignedIn && userId) {
        try {
          const result = await deleteMutation({
            user_id: userId,
            manga_id: manga.id,
            provider,
          });
          if (result.success) {
            maybeToast(`Removed ${manga.title} from cloud tracking`);
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
    maybeToast(`Manga ${manga.title} marked as ${value}`);

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
        console.error("[MangaStatusDropdown] Error syncing to Convex:", error);
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

    setLiveMessage(
      newRating > 0
        ? `Rating updated to ${newRating} out of 5`
        : "Rating cleared",
    );

    if (isLoaded && isSignedIn && userId && existing) {
      try {
        await ratingMutation({
          user_id: userId,
          manga_id: manga.id,
          provider: provider,
          rating: newRating,
        });
      } catch (error) {
        console.error("[MangaStatusDropdown] Error updating rating:", error);
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
            "h-10 w-full rounded-lg font-semibold text-sm transition-all duration-200 sm:w-52",
            status
              ? "border-brand-start bg-brand-start text-white hover:opacity-90"
              : "border-border/50 bg-card hover:border-brand-start/50",
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
                className="cursor-pointer rounded-md py-2 focus:bg-accent"
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn("rounded-sm p-1", config.bg)}>
                    <Icon size={14} className={config.color} />
                  </div>
                  <span className="text-sm font-medium">{key}</span>
                </div>
              </SelectItem>
            );
          })}
          {status && (
            <>
              <div className="mx-1 my-1 h-px bg-border" />
              <SelectItem
                value="untrack"
                className="cursor-pointer rounded-md bg-destructive/5 py-2 text-destructive focus:bg-destructive/15 focus:text-destructive"
              >
                <div className="flex items-center gap-2.5">
                  <div className="rounded-sm bg-destructive/15 p-1">
                    <Trash2 size={14} />
                  </div>
                  <span className="text-sm font-semibold">Remove from Library</span>
                </div>
              </SelectItem>
            </>
          )}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <p className="text-[11px] text-muted-foreground">{helperText}</p>
        {isSignedIn && <SyncStatusPill syncState={syncState} />}
      </div>

      {status && (
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-muted-foreground">
            Your rating
          </span>
          <div className="flex items-center gap-0.5" role="group" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start"
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
          </div>
          <span className="text-[11px] text-muted-foreground">
            {(hoverRating || rating) > 0 ? `${hoverRating || rating}/5` : "Not rated"}
          </span>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {liveMessage}
      </p>
    </div>
  );
};
