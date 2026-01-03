"use client";

import { useEffect, useState } from "react";
import { ProgressTracker } from "@/lib/progress/tracker";
import { MangaCard } from "@/components/custom/landing/cards";
import { Library, BookOpen, Clock, CheckCircle2, Bookmark, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LibraryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const tracker = new ProgressTracker();

  useEffect(() => {
    setItems(tracker.getAll());
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === "all" || item.status === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    all: items.length,
    reading: items.filter((i) => i.status === "Reading").length,
    completed: items.filter((i) => i.status === "Completed").length,
    on_hold: items.filter((i) => i.status === "Halted").length,
    plan_to_read: items.filter((i) => i.status === "Planning").length,
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Library className="w-6 h-6" />
            <h1 className="text-3xl font-black tracking-tight">My Library</h1>
          </div>
          <p className="text-muted-foreground">
            Track your reading progress and manage your collection.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search your library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl border-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap justify-start gap-1">
          <TabsTrigger value="all" className="px-6 py-2 rounded-lg font-bold">
            All ({stats.all})
          </TabsTrigger>
          <TabsTrigger value="Reading" className="px-6 py-2 rounded-lg font-bold flex items-center gap-2">
            <BookOpen size={14} /> Reading ({stats.reading})
          </TabsTrigger>
          <TabsTrigger value="Planning" className="px-6 py-2 rounded-lg font-bold flex items-center gap-2">
            <Bookmark size={14} /> Plan to Read ({stats.plan_to_read})
          </TabsTrigger>
          <TabsTrigger value="Completed" className="px-6 py-2 rounded-lg font-bold flex items-center gap-2">
            <CheckCircle2 size={14} /> Completed ({stats.completed})
          </TabsTrigger>
          <TabsTrigger value="Halted" className="px-6 py-2 rounded-lg font-bold flex items-center gap-2">
            <Clock size={14} /> On Hold ({stats.on_hold})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredItems.map((item, idx) => (
            <MangaCard
              key={idx}
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
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <div className="p-6 bg-muted rounded-full">
            <Library size={48} className="text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Your library is empty</h3>
            <p className="text-muted-foreground max-w-xs">
              {searchQuery 
                ? "No manga in your library matches your search."
                : "Start adding manga to your library to track your progress!"}
            </p>
          </div>
          {!searchQuery && (
            <Button asChild className="font-bold px-8 bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border-none shadow-lg">
              <Link href="/browse">Browse Manga</Link>
            </Button>
          )}
        </div>
      )}
    </main>
  );
}
