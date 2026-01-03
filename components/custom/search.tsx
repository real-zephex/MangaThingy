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
import Link from "next/link";

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
    router.push(`/manga/${source}/${id}`);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="h-4 w-4 xl:mr-2" aria-hidden="true" />
        <span className="hidden xl:inline-flex text-muted-foreground text-sm">Search manga...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
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
                <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
                  Mangapill
                </div>
                <CommandGroup>
                  {mangapillResults.length > 0 ? (
                    mangapillResults.map((manga, idx) => (
                      <Link href={`/manga/mangapill/${manga.id}`} key={idx}>
                        <MangaSearchItem
                          key={`mp-${manga.id}`}
                          manga={manga}
                        />
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-muted-foreground">No results from Mangapill</div>
                  )}
                </CommandGroup>
              </div>
              <div className="flex flex-col">
                <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
                  Asurascans
                </div>
                <CommandGroup>
                  {asurascansResults.length > 0 ? (
                    asurascansResults.map((manga, idx) => (
                      <Link href={`/manga/asurascans/${manga.id}`} key={idx}>
                        <MangaSearchItem
                          key={`as-${manga.id}`}
                          manga={manga}
                        />
                      </Link>
                    ))
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

interface MangaSearchItemProps {
  manga: Manga;
}

const MangaSearchItem = ({ manga }: MangaSearchItemProps) => {
  return (
    <CommandItem
      className="flex items-center gap-3 p-2 cursor-pointer"
    >
      <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-sm border border-border">
        <Image
          src={ImageProxy(manga.image)}
          alt={manga.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-1">{manga.title}</h4>
        <div className="flex items-center gap-2 mt-1">
          {manga.year && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
              <Calendar size={10} />
              {manga.year}
            </span>
          )}
          {manga.status && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 capitalize">
              <BookOpen size={10} />
              {manga.status}
            </span>
          )}
        </div>

      </div>
    </CommandItem>
  );
};

export default SearchManga;