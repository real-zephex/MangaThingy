"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/providers/toast-provider";
import { useState, useEffect, useId, useMemo } from "react";
import { Manga } from "@/lib/services/manga.types";
import { ProgressTracker } from "@/lib/progress/tracker";
import { Trash, Star, BookmarkPlus } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

export function TrackManga({
  data,
  children,
}: {
  data: Manga & { source?: string };
  children?: React.ReactNode;
}) {
  const toast = useToast();
  const id = useId();
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

  function existenceCheck() {
    return tracker.getOne(data.id);
  }

  useEffect(() => {
    function fetchStatus() {
      const result = existenceCheck();
      if (result) {
        setStatus(result.status);
        setRating(result.rating ?? 0);
      }
    }
    fetchStatus();
  }, []);

  async function handleChange(e: string) {
    const provider = data.source || "unknown";
    const contents = {
      id: data.id,
      title: data.title,
      image: data.image || data.images,
      status: e,
      provider,
    };
    if (!existenceCheck()) {
      tracker.addSingle(contents);
    } else {
      tracker.update(contents);
    }

    setStatus(e);
    toast.info(`Manga ${data.title} has been marked as ${e}`);

    // Immediate write to Convex for signed-in users
    if (isLoaded && isSignedIn && userId) {
      try {
        const existing = tracker.getOne(data.id);
        await upsertMutation({
          entry: {
            user_id: userId,
            id: data.id,
            title: data.title,
            image: data.image || data.images,
            status: e,
            provider,
            chapter: existing?.chapter,
            chapterId: existing?.chapterId,
            chapterTitle: existing?.chapterTitle,
            totalChapter: existing?.totalChapter,
            rating: existing?.rating,
            updatedAt: Date.now(),
          },
        });
      } catch (error) {
        console.error("[TrackManga] Error syncing to Convex:", error);
      }
    }
  }

  async function handleRating(value: number) {
    const newRating = value === rating ? 0 : value;
    setRating(newRating);

    const existing = existenceCheck();
    if (existing) {
      tracker.update({ ...existing, rating: newRating });
    }

    if (isLoaded && isSignedIn && userId && existing) {
      try {
        await ratingMutation({
          user_id: userId,
          manga_id: data.id,
          provider: data.source || "unknown",
          rating: newRating,
        });
      } catch (error) {
        console.error("[TrackManga] Error updating rating:", error);
      }
    }
  }

  async function deleteItem() {
    const provider = data.source;
    tracker.remove(data.id, provider);
    setStatus("");
    setRating(0);

    if (isLoaded && isSignedIn && userId) {
      try {
        const result = await deleteMutation({
          user_id: userId,
          manga_id: data.id,
          provider,
        });
        if (result.success) {
          toast.info(
            `Manga ${data.title} has been removed from your tracking list in db.`,
          );
        }
      } catch (error) {
        console.error("[TrackManga] Error deleting from Convex:", error);
      }
    }

    toast.success(`Manga ${data.title} has been untracked`);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children || (
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full border-2 transition-all",
              status ? "bg-brand-start text-white border-brand-start" : "hover:border-brand-start hover:text-brand-start"
            )}
            aria-label={status ? `Tracking as ${status}` : "Add to library"}
          >
            {status ? <Star size={14} fill="currentColor" /> : <BookmarkPlus size={14} />}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 shadow-2xl border-border/50 bg-background/95 backdrop-blur-md">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-bold text-lg">Track Manga</h4>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
              Update Reading Status
            </p>
          </div>
          <div className="grid gap-4">
            <RadioGroup onValueChange={handleChange} value={status} className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 bg-accent/30 p-2 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="Planning" id={`plan-${id}`} />
                <Label htmlFor={`plan-${id}`} className="text-sm font-medium cursor-pointer flex-1">Planning</Label>
              </div>
              <div className="flex items-center gap-2 bg-accent/30 p-2 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="Reading" id={`read-${id}`} />
                <Label htmlFor={`read-${id}`} className="text-sm font-medium cursor-pointer flex-1 text-green-500">Reading</Label>
              </div>
              <div className="flex items-center gap-2 bg-accent/30 p-2 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="Completed" id={`comp-${id}`} />
                <Label htmlFor={`comp-${id}`} className="text-sm font-medium cursor-pointer flex-1 text-brand-end">Completed</Label>
              </div>
              <div className="flex items-center gap-2 bg-accent/30 p-2 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="Halted" id={`halt-${id}`} />
                <Label htmlFor={`halt-${id}`} className="text-sm font-medium cursor-pointer flex-1 text-amber-500">On Hold</Label>
              </div>
            </RadioGroup>

            {status && (
              <div className="pt-2 border-t border-border/50 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Rating</Label>
                  {rating > 0 && (
                    <span className="text-xs font-black text-brand-start">
                      {rating}/5
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-1" role="group" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-all hover:scale-125 active:scale-95"
                      aria-label={`Rate ${star} out of 5 stars`}
                      aria-pressed={rating === star}
                    >
                      <Star
                        size={24}
                        className={cn(
                          "transition-all duration-300",
                          (hoverRating || rating) >= star
                            ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
                            : "text-muted-foreground/20",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              className="flex flex-row items-center mt-2 text-xs font-bold uppercase tracking-widest gap-2 active:scale-95 transition-all h-10 border-2"
              variant="outline"
              onClick={deleteItem}
              disabled={!existenceCheck()}
            >
              <Trash size={14} className="text-destructive" />
              Untrack
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
