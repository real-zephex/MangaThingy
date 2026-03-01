"use client";

import { useState, useMemo } from "react";
import { ProgressTracker, Progress } from "@/lib/progress/tracker";
import { MangaCard } from "@/components/custom/landing/cards";
import {
  Library,
  BookOpen,
  Clock,
  CheckCircle2,
  Bookmark,
  Search,
  ArrowUpDown,
  Star,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useTracking } from "@/providers/TrackingProvider";
import { useAuth } from "@clerk/nextjs";

type SortOption = "updatedAt" | "title" | "rating";

export default function LibraryPage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("updatedAt");
  const [sortAsc, setSortAsc] = useState(false);
  const tracker = useMemo(() => new ProgressTracker(), []);

  const { isSignedIn } = useAuth();
  const { historyData } = useTracking();

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

    // Sort
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

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-start">
            <Library className="w-6 h-6" />
            <h1 className="text-3xl font-black tracking-tight">My Library</h1>
          </div>
          <p className="text-muted-foreground">
            Track your reading progress and manage your collection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="library-search" className="sr-only">Search your library</label>
            <Input
              id="library-search"
              placeholder="Search your library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl border-2 focus-visible:ring-brand-start"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-accent/30 rounded-2xl p-4 text-center border border-border/50">
          <div className="text-3xl font-black text-brand-start">{stats.all}</div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">Tracked</div>
        </div>
        <div className="bg-accent/30 rounded-2xl p-4 text-center border border-border/50">
          <div className="text-3xl font-black text-green-500">{stats.reading}</div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">Reading</div>
        </div>
        <div className="bg-accent/30 rounded-2xl p-4 text-center border border-border/50">
          <div className="text-3xl font-black text-brand-end">{stats.completed}</div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">Completed</div>
        </div>
        <div className="bg-accent/30 rounded-2xl p-4 text-center border border-border/50">
          <div className="text-3xl font-black text-amber-500">{stats.plan_to_read}</div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">Planning</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
          <TabsList className="bg-muted/50 p-1 h-auto flex-wrap justify-start gap-1">
            <TabsTrigger
              value="all"
              className="px-6 py-2 rounded-lg font-bold"
            >
              All ({stats.all})
            </TabsTrigger>
            <TabsTrigger
              value="Reading"
              className="px-6 py-2 rounded-lg font-bold flex items-center gap-2"
            >
              <BookOpen size={14} /> Reading ({stats.reading})
            </TabsTrigger>
            <TabsTrigger
              value="Planning"
              className="px-6 py-2 rounded-lg font-bold flex items-center gap-2"
            >
              <Bookmark size={14} /> Plan to Read ({stats.plan_to_read})
            </TabsTrigger>
            <TabsTrigger
              value="Completed"
              className="px-6 py-2 rounded-lg font-bold flex items-center gap-2"
            >
              <CheckCircle2 size={14} /> Completed ({stats.completed})
            </TabsTrigger>
            <TabsTrigger
              value="Halted"
              className="px-6 py-2 rounded-lg font-bold flex items-center gap-2"
            >
              <Clock size={14} /> On Hold ({stats.on_hold})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg font-medium gap-2"
            onClick={cycleSortBy}
          >
            <ArrowUpDown size={14} />
            {sortLabel[sortBy]}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-lg font-medium px-2"
            onClick={() => setSortAsc(!sortAsc)}
          >
            {sortAsc ? "Asc" : "Desc"}
          </Button>
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
                variant="default"
              />
              {(item.rating ?? 0) > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute top-3 left-3 z-30 flex items-center gap-1 bg-yellow-500/90 text-white shadow-md"
                >
                  <Star size={10} className="fill-white" />
                  <span className="text-xs font-bold">
                    {item.rating}/5
                  </span>
                </Badge>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
          <div className="relative">
            <div className="p-8 bg-accent/50 rounded-full ring-2 ring-brand-start/20">
              <Library size={64} className="text-muted-foreground" />
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-brand-start rounded-full text-white shadow-lg">
              <Search size={20} />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black">Your library is empty</h3>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              {searchQuery
                ? "No manga in your library matches your search."
                : "Start adding manga to your library to track your progress and manage your collection!"}
            </p>
          </div>
          {!searchQuery && (
            <Button
              asChild
              className="font-bold px-10 h-12 bg-linear-to-r from-brand-start to-brand-end hover:opacity-90 border-none shadow-xl shadow-brand-shadow transition-all"
            >
              <Link href="/browse">Browse Manga</Link>
            </Button>
          )}
        </div>
      )}
    </main>
  );
}
