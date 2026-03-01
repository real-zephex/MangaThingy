"use client";

import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressTracker } from "@/lib/progress/tracker";
import {
  Chapter,
  MangaInfo,
  MangaInfoResults,
} from "@/lib/services/manga.types";
import { cn } from "@/lib/utils";
import {
  ArrowUpDown,
  CheckCircle2,
  ExternalLink,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const ChapterButton = ({
  chapter,
  provider,
  data,
}: {
  chapter: Chapter[];
  provider: "asurascans" | "mangapill";
  data: MangaInfoResults<MangaInfo>;
}) => {
  const [count] = useState(30);
  const [toggled, setToggled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isReversed, setIsReversed] = useState(provider === "asurascans");

  const toast = useToast();
  const router = useRouter();
  const tracker = new ProgressTracker();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const upsertMutation = useMutation(
    api.functions.mutations.upsertReadingHistory,
  );
  const addChapterReadMutation = useMutation(
    api.functions.mutations.addChapterRead,
  );

  const chapterHistory = useQuery(
    api.functions.query.getChapterHistory,
    userId ? { user_id: userId, manga_id: data.results.id } : "skip",
  );

  const readChapterIds = new Set(
    chapterHistory?.map((ch) => ch.chapter_id) ?? [],
  );

  const updateProgress = async (chapterObj: Chapter, chapterIndex: number) => {
    const getEntry = tracker.getOne(data.results.id);
    const chapterNumber = (chapterIndex + 1).toString();

    if (getEntry) {
      const entries = {
        ...getEntry,
        chapter: chapterNumber,
        chapterId: chapterObj.id,
        chapterTitle: chapterObj.title,
      };
      tracker.update(entries);
      toast.info(`Manga ${data.results.title} has been updated.`);
    } else {
      const entries = {
        id: data.results.id,
        title: data.results.title || "N.A.",
        image: data.results.image || data.results.images,
        status: "Reading",
        provider,
        chapter: chapterNumber,
        chapterId: chapterObj.id,
        chapterTitle: chapterObj.title,
        totalChapter: data.results.chapters.length.toString(),
      };
      tracker.addSingle(entries);
      toast.info(`Manga ${data.results.title} has been added.`);
    }

    if (isLoaded && isSignedIn && userId) {
      try {
        const existing = tracker.getOne(data.results.id);
        await upsertMutation({
          entry: {
            user_id: userId,
            id: data.results.id,
            title: data.results.title || "N.A.",
            image: data.results.image || data.results.images,
            status: existing?.status || "Reading",
            provider,
            chapter: chapterNumber,
            chapterId: chapterObj.id,
            chapterTitle: chapterObj.title,
            totalChapter: data.results.chapters.length.toString(),
            rating: existing?.rating,
            updatedAt: Date.now(),
          },
        });

        await addChapterReadMutation({
          user_id: userId,
          manga_id: data.results.id,
          provider,
          chapter_id: chapterObj.id,
          chapter_title: chapterObj.title,
        });
      } catch (error) {
        console.error("[viewPages] Error syncing to Convex:", error);
      }
    }
  };

  const handleChapterClick = (chap: { id: string; title: string; index: number }) => {
    updateProgress(chap, chap.index);

    // Navigate to the full-screen reader
    const params = new URLSearchParams({
      title: chap.title,
      mangaId: data.results.id,
      mangaTitle: data.results.title || "",
    });
    router.push(`/read/${provider}/${encodeURIComponent(chap.id)}?${params.toString()}`);
  };

  const filteredChapters = chapter
    .map((i, idx) => ({ ...i, index: idx }))
    .filter((chap) =>
      chap.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => (isReversed ? b.index - a.index : a.index - b.index));

  const displayedChapters = toggled
    ? filteredChapters
    : filteredChapters.slice(0, count);

  return (
    <div className="flex flex-col space-y-4">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            aria-hidden="true"
          />
          <label htmlFor="chapter-search" className="sr-only">
            Search chapters
          </label>
          <Input
            id="chapter-search"
            placeholder="Search chapters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 rounded-lg border-border/50 bg-card text-sm"
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          onClick={() => setIsReversed(!isReversed)}
        >
          <ArrowUpDown size={14} aria-hidden="true" />
          {isReversed ? "Newest first" : "Oldest first"}
        </Button>
      </div>

      {/* Chapter list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/30 rounded-lg overflow-hidden border border-border/40">
        {displayedChapters.map((chap) => {
          const isRead = readChapterIds.has(chap.id);
          return (
            <div
              key={chap.id}
              role="button"
              tabIndex={0}
              aria-label={`Read ${chap.title}`}
              onClick={() => handleChapterClick(chap)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleChapterClick(chap);
                }
              }}
              className={cn(
                "group relative flex items-center gap-3 px-4 py-3 bg-card cursor-pointer transition-colors duration-150 hover:bg-accent/50",
                isRead && "border-l-2 border-l-green-500",
                !isRead && "border-l-2 border-l-transparent",
              )}
            >
              {/* Chapter number */}
              <span className="text-[11px] font-bold text-muted-foreground/60 tabular-nums w-8 shrink-0 text-right">
                {chap.index + 1}
              </span>

              {/* Title + date */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium truncate group-hover:text-brand-start transition-colors",
                    isRead && "text-muted-foreground",
                  )}
                >
                  {chap.title}
                </p>
                {chap.date && (
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                    {chap.date}
                  </p>
                )}
              </div>

              {/* Status indicators */}
              <div className="flex items-center gap-2 shrink-0">
                {isRead && (
                  <CheckCircle2
                    size={14}
                    className="text-green-500"
                    aria-label="Read"
                  />
                )}
                <ExternalLink
                  size={14}
                  className="text-muted-foreground/30 group-hover:text-brand-start transition-colors"
                  aria-hidden="true"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more / less */}
      {filteredChapters.length > count && (
        <Button
          variant="ghost"
          size="sm"
          className="mx-auto text-xs font-medium text-muted-foreground hover:text-foreground"
          onClick={() => setToggled(!toggled)}
          aria-expanded={toggled}
        >
          {toggled
            ? "Show less"
            : `Show all ${filteredChapters.length} chapters`}
        </Button>
      )}
    </div>
  );
};

export default ChapterButton;
