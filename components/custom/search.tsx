"use client";

import { SearchIcon, Loader2, BookOpen, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { MangapillService, AsurascansService } from "@/lib/services/manga.actions";
import { Manga } from "@/lib/services/manga.types";
import { ImageProxy } from "@/lib/services/image.proxy";
import { cn } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";

const SearchManga = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mangapillResults, setMangapillResults] = useState<Manga[]>([]);
  const [asurascansResults, setAsurascansResults] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setMangapillResults([]);
      setAsurascansResults([]);
      return;
    }

    setLoading(true);
    try {
      const [mpResults, asResults] = await Promise.all([
        MangapillService.search(searchQuery),
        AsurascansService.search(searchQuery),
      ]);


      setMangapillResults(mpResults?.results || []);
      setAsurascansResults(asResults?.results || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        performSearch(query);
      } else {
        setMangapillResults([]);
        setAsurascansResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const onSelect = (source: string, id: string) => {
    setOpen(false);
    setQuery("");
    setMangapillResults([]);
    setAsurascansResults([]);
    router.push(`/manga/${source}/${id}`);
  };

  const renderResults = (results: Manga[], source: string) => {
    return results.map((manga) => (
      <CommandItem
        key={`${source}-${manga.id}`}
        className="flex items-center gap-3 p-2 cursor-pointer hover:bg-brand-start/5 transition-colors group"
        onSelect={() => onSelect(source, manga.id)}
      >
        <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md border border-border group-hover:border-brand-start transition-colors">
          <Image
            src={ImageProxy(manga.image)}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-bold text-sm line-clamp-1 group-hover:text-brand-start transition-colors">{manga.title}</span>
          <div className="flex items-center gap-2 mt-1">
            {manga.year && (
              <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                <Calendar size={10} aria-hidden="true" />
                {manga.year}
              </span>
            )}
            {manga.status && (
              <span className="text-xs text-muted-foreground flex items-center gap-0.5 capitalize bg-secondary/50 px-1 rounded">
                {manga.status}
              </span>
            )}
          </div>
        </div>
      </CommandItem>
    ));
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 md:h-10 md:w-48 lg:w-60 md:justify-start md:px-3 md:py-2 border-2 hover:border-brand-start/50 transition-all"
        onClick={() => setOpen(true)}
        aria-label="Search manga"
      >
        <SearchIcon className="h-4 w-4 md:mr-2" aria-hidden="true" />
        <span className="hidden md:inline-flex text-muted-foreground text-sm">Search manga...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} className="max-w-[90vw] md:max-w-3xl" shouldFilter={false}>
        <CommandInput
          placeholder="Type to search manga..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[70vh]">
          {loading && (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && query && mangapillResults.length === 0 && asurascansResults.length === 0 && (
            <CommandEmpty>No results found for "{query}".</CommandEmpty>
          )}

          {!loading && (mangapillResults.length > 0 || asurascansResults.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="flex flex-col">
                <div className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
                  Mangapill
                </div>
                <CommandGroup>
                  {mangapillResults.length > 0 ? (
                    renderResults(mangapillResults, "mangapill")
                  ) : (
                    <div className="p-4 text-center text-xs text-muted-foreground">No results from Mangapill</div>
                  )}
                </CommandGroup>
              </div>
              <div className="flex flex-col">
                <div className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
                  Asurascans
                </div>
                <CommandGroup>
                  {asurascansResults.length > 0 ? (
                    renderResults(asurascansResults, "asurascans")
                  ) : (
                    <div className="p-4 text-center text-xs text-muted-foreground">No results from Asurascans</div>
                  )}
                </CommandGroup>
              </div>
            </div>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchManga;