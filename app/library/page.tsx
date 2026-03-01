"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowUpDown,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Clock,
  Library,
  Search,
  Star,
} from "lucide-react";

import { MangaCard } from "@/components/custom/landing/cards";
import { SyncStatusPill, TrackingSyncState } from "@/components/custom/info/sync-status-pill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress, ProgressTracker } from "@/lib/progress/tracker";
import { useTracking } from "@/providers/TrackingProvider";

type SortOption = "updatedAt" | "title" | "rating";
type CardLayoutOption = "compact" | "default" | "featured";

const cardLayoutLabel: Record<CardLayoutOption, string> = {
  compact: "Compact",
  default: "Hybrid",
  featured: "Media",
};

export default function LibraryPage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("updatedAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [cardLayout, setCardLayout] = useState<CardLayoutOption>("default");
  const tracker = useMemo(() => new ProgressTracker(), []);

  const { isSignedIn } = useAuth();
  const { historyData, syncState } = useTracking();

  // For signed-in users, prefer live Convex data; for guests, read localStorage directly
  const items: Progress[] = useMemo(() => {
    if (isSignedIn && historyData && historyData.length > 0) {
      return historyData.map((item) => ({
        id: item.id,
        title: item.title,
        image: item.image,
        status: item.status,
        chapter: item.chapter,
        chapterId: item.chapterId,
        chapterTitle: item.chapterTitle,
        provider: item.provider,
        totalChapter: item.totalChapter,
        rating: item.rating,
        updatedAt: item.updatedAt,
      }));
    }
    return tracker.getAll();
  }, [isSignedIn, historyData, tracker]);

  const filteredItems = useMemo(() => {
    const filtered = items.filter((item) => {
      const matchesFilter = filter === "all" || item.status === filter;
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    filtered.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "updatedAt":
          cmp = (a.updatedAt ?? 0) - (b.updatedAt ?? 0);
          break;
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "rating":
          cmp = (a.rating ?? 0) - (b.rating ?? 0);
          break;
      }
      return sortAsc ? cmp : -cmp;
    });

    return filtered;
  }, [items, filter, searchQuery, sortBy, sortAsc]);

  const stats = {
    all: items.length,
    reading: items.filter((i) => i.status === "Reading").length,
    completed: items.filter((i) => i.status === "Completed").length,
    on_hold: items.filter((i) => i.status === "Halted").length,
    plan_to_read: items.filter((i) => i.status === "Planning").length,
  };

  const cycleSortBy = () => {
    const options: SortOption[] = ["updatedAt", "title", "rating"];
    const currentIndex = options.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % options.length;
    setSortBy(options[nextIndex]);
  };

  const sortLabel = {
    updatedAt: "Last Updated",
    title: "Title",
    rating: "Rating",
  };

  const gridClassName =
    cardLayout === "compact"
      ? "grid grid-cols-1 gap-3"
      : cardLayout === "featured"
        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6";

  const effectiveSyncState: TrackingSyncState = isSignedIn ? syncState : "idle";

  return (
    <main className="container mx-auto space-y-8 px-4 py-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-start">
            <Library className="h-6 w-6" />
            <h1 className="text-3xl font-black tracking-tight">My Library</h1>
            <SyncStatusPill syncState={effectiveSyncState} className="ml-1" />
          </div>
          <p className="text-muted-foreground">
            Track your reading progress and manage your collection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <label htmlFor="library-search" className="sr-only">
              Search your library
            </label>
            <Input
              id="library-search"
              placeholder="Search your library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 rounded-xl border-2 pl-10 focus-visible:ring-brand-start"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border/50 bg-accent/30 p-4 text-center">
          <div className="text-3xl font-black text-brand-start">{stats.all}</div>
          <div className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Tracked
          </div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-accent/30 p-4 text-center">
          <div className="text-3xl font-black text-green-500">{stats.reading}</div>
          <div className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Reading
          </div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-accent/30 p-4 text-center">
          <div className="text-3xl font-black text-brand-end">{stats.completed}</div>
          <div className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Completed
          </div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-accent/30 p-4 text-center">
          <div className="text-3xl font-black text-amber-500">{stats.plan_to_read}</div>
          <div className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Planning
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
          <TabsList className="h-auto flex-wrap justify-start gap-1 bg-muted/50 p-1">
            <TabsTrigger value="all" className="rounded-lg px-6 py-2 font-bold">
              All ({stats.all})
            </TabsTrigger>
            <TabsTrigger
              value="Reading"
              className="flex items-center gap-2 rounded-lg px-6 py-2 font-bold"
            >
              <BookOpen size={14} /> Reading ({stats.reading})
            </TabsTrigger>
            <TabsTrigger
              value="Planning"
              className="flex items-center gap-2 rounded-lg px-6 py-2 font-bold"
            >
              <Bookmark size={14} /> Plan to Read ({stats.plan_to_read})
            </TabsTrigger>
            <TabsTrigger
              value="Completed"
              className="flex items-center gap-2 rounded-lg px-6 py-2 font-bold"
            >
              <CheckCircle2 size={14} /> Completed ({stats.completed})
            </TabsTrigger>
            <TabsTrigger
              value="Halted"
              className="flex items-center gap-2 rounded-lg px-6 py-2 font-bold"
            >
              <Clock size={14} /> On Hold ({stats.on_hold})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-lg font-medium"
            onClick={cycleSortBy}
          >
            <ArrowUpDown size={14} />
            {sortLabel[sortBy]}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-lg px-2 font-medium"
            onClick={() => setSortAsc(!sortAsc)}
          >
            {sortAsc ? "Asc" : "Desc"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Card layout
        </p>
        {(Object.keys(cardLayoutLabel) as CardLayoutOption[]).map((layout) => (
          <Button
            key={layout}
            type="button"
            size="sm"
            variant={cardLayout === layout ? "default" : "outline"}
            className="h-8 rounded-full px-4"
            onClick={() => setCardLayout(layout)}
          >
            {cardLayoutLabel[layout]}
          </Button>
        ))}
      </div>

      {filteredItems.length > 0 ? (
        <div className={gridClassName}>
          {filteredItems.map((item, idx) => (
            <div key={`${item.provider}-${item.id}-${idx}`} className="relative">
              <MangaCard
                manga={{
                  id: item.id,
                  title: item.title,
                  image: item.image,
                  images: item.image,
                  status: item.status,
                  source: item.provider,
                }}
                variant={cardLayout}
              />
              {(item.rating ?? 0) > 0 && cardLayout !== "compact" && (
                <Badge
                  variant="secondary"
                  className="absolute top-3 left-3 z-30 flex items-center gap-1 bg-yellow-500/90 text-white shadow-md"
                >
                  <Star size={10} className="fill-white" />
                  <span className="text-xs font-bold">{item.rating}/5</span>
                </Badge>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-6 py-20 text-center">
          <div className="relative">
            <div className="rounded-full bg-accent/50 p-8 ring-2 ring-brand-start/20">
              <Library size={64} className="text-muted-foreground" />
            </div>
            <div className="absolute -bottom-2 -right-2 rounded-full bg-brand-start p-2 text-white shadow-lg">
              <Search size={20} />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black">Your library is empty</h3>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {searchQuery
                ? "No manga in your library matches your search."
                : "Start adding manga to your library to track your progress and manage your collection!"}
            </p>
          </div>
          {!searchQuery && (
            <Button
              asChild
              className="h-12 border-none bg-linear-to-r from-brand-start to-brand-end px-10 font-bold shadow-xl shadow-brand-shadow transition-all hover:opacity-90"
            >
              <Link href="/browse">Browse Manga</Link>
            </Button>
          )}
        </div>
      )}
    </main>
  );
}
