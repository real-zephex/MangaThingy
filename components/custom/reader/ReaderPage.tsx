"use client";

import { ImageProxy } from "@/lib/services/image.proxy";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ChevronUp,
  Maximize2,
  Minimize2,
  Settings2,
  Rows2,
  Columns2,
  Check,
  List,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface ReaderViewProps {
  pages: string[];
  error: string | null;
  provider: string;
  chapterId: string;
  chapterTitle: string;
  mangaId?: string;
  mangaTitle?: string;
  chapters?: { id: string; title: string }[];
}

export const ReaderView = ({
  pages,
  error,
  provider,
  chapterTitle,
  chapterId,
  mangaId,
  mangaTitle,
  chapters = [],
}: ReaderViewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [layoutMode, setLayoutMode] = useState<"webtoon" | "classic">(
    "webtoon",
  );
  const [filterMode, setFilterMode] = useState<"none" | "dim" | "sepia">(
    "none",
  );

  // Smart Preloading
  useEffect(() => {
    if (pages.length === 0) return;
    const preloadCount = 3;
    const startIdx = currentPage; // Index of the next page (since currentPage is 1-indexed)
    const endIdx = Math.min(startIdx + preloadCount, pages.length);

    for (let i = startIdx; i < endIdx; i++) {
      const img = new window.Image();
      img.src = ImageProxy(pages[i]);
    }
  }, [currentPage, pages]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key) {
        case "ArrowRight":
        case "d":
        case "D":
          window.scrollBy({
            top: window.innerHeight * 0.8,
            behavior: "smooth",
          });
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          window.scrollBy({
            top: -window.innerHeight * 0.8,
            behavior: "smooth",
          });
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Track scroll position for auto-hiding top bar and page counter
  // Debounced to reduce state updates from 60/sec (every scroll event) to ~7/sec
  useEffect(() => {
    let lastScroll = 0;
    let debounceTimer: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Clear existing timer to debounce
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Set a new timer to update state after 150ms of no scroll events
      debounceTimer = setTimeout(() => {
        setShowTopBar(scrollY < 100 || scrollY < lastScroll);
        setShowScrollTop(scrollY > 600);

        // Estimate current page from scroll position
        if (pages.length > 0) {
          const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight > 0) {
            const progress = scrollY / docHeight;
            setCurrentPage(
              Math.min(
                Math.max(1, Math.ceil(progress * pages.length)),
                pages.length,
              ),
            );
          }
        }

        lastScroll = scrollY;
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [pages.length]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Build back link to the manga info page
  const backHref = mangaId ? `/manga/${provider}/${mangaId}` : "/";

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-bold">Failed to Load</h1>
          <p className="text-sm text-muted-foreground max-w-sm">{error}</p>
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-start hover:underline"
          >
            <ArrowLeft size={14} />
            Go back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-black transition-all duration-500",
        filterMode === "dim" && "brightness-75",
        filterMode === "sepia" && "sepia-[.3] brightness-90 contrast-95",
      )}
    >
      {/* Floating top bar */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-transform duration-300",
          showTopBar ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <div className="flex items-center justify-between px-4 py-2.5 bg-background/90 backdrop-blur-md border-b border-border/30">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={backHref}
              className="shrink-0 p-1.5 rounded-md hover:bg-accent transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{chapterTitle}</p>
              {mangaTitle && (
                <p className="text-[11px] text-muted-foreground truncate">
                  {mangaTitle}
                </p>
              )}
            </div>
          </div>

          {/* Top navigation center - Chapter Select */}
          {chapters.length > 0 && (
            <div className="hidden md:flex flex-1 justify-center items-center px-4">
              <Select
                value={decodeURIComponent(chapterId)}
                onValueChange={(val) => {
                  const selected = chapters.find((c) => c.id === val);
                  if (selected) {
                    window.location.href = `/read/${provider}/${encodeURIComponent(val)}?mangaId=${mangaId}&mangaTitle=${mangaTitle}&title=${encodeURIComponent(selected.title)}`;
                  }
                  console.log(chapters);
                  console.log(chapterId);
                }}
              >
                <SelectTrigger className="w-55 h-8 text-xs font-semibold">
                  <SelectValue placeholder={chapterTitle} />
                </SelectTrigger>
                <SelectContent>
                  {chapters.map((chap) => (
                    <SelectItem key={chap.id} value={chap.id}>
                      {chap.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center gap-4 shrink-0">
            {/* Page counter */}
            <span className="text-xs font-mono font-medium text-muted-foreground tracking-widest bg-muted/40 px-2 py-1 rounded-sm border border-border/20">
              {String(currentPage).padStart(2, "0")} /{" "}
              {String(pages.length).padStart(2, "0")}
            </span>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-sm hover:bg-accent border border-transparent hover:border-border/30 transition-all text-muted-foreground hover:text-foreground"
              aria-label={isExpanded ? "Fit to width" : "Full width"}
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1.5 rounded-sm hover:bg-accent border border-transparent hover:border-border/30 transition-all text-muted-foreground hover:text-foreground"
                  aria-label="Reader Settings"
                >
                  <Settings2 size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 font-sans border-border/40"
              >
                <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Reading Mode
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/30" />
                <DropdownMenuItem
                  onClick={() => setLayoutMode("webtoon")}
                  className="flex items-center justify-between cursor-pointer rounded-sm py-2"
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Rows2 size={14} className="text-muted-foreground" />{" "}
                    Webtoon
                  </div>
                  {layoutMode === "webtoon" && (
                    <Check size={14} className="text-brand-start" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLayoutMode("classic")}
                  className="flex items-center justify-between cursor-pointer rounded-sm py-2"
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Columns2 size={14} className="text-muted-foreground" />{" "}
                    Classic Page
                  </div>
                  {layoutMode === "classic" && (
                    <Check size={14} className="text-brand-start" />
                  )}
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-border/30" />
                <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Color Filter
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/30" />
                <DropdownMenuItem
                  onClick={() => setFilterMode("none")}
                  className="flex items-center justify-between cursor-pointer rounded-sm"
                >
                  <span className="text-sm font-medium">None</span>
                  {filterMode === "none" && (
                    <Check size={14} className="text-brand-start" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterMode("dim")}
                  className="flex items-center justify-between cursor-pointer rounded-sm"
                >
                  <span className="text-sm font-medium">Dim (Night Mode)</span>
                  {filterMode === "dim" && (
                    <Check size={14} className="text-brand-start" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterMode("sepia")}
                  className="flex items-center justify-between cursor-pointer rounded-sm"
                >
                  <span className="text-sm font-medium">Sepia (Eye Care)</span>
                  {filterMode === "sepia" && (
                    <Check size={14} className="text-brand-start" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Pages */}
      <main className="flex flex-col items-center select-none pt-12">
        {pages.map((imageUrl, index) => (
          <div
            key={index}
            className={cn(
              "relative flex justify-center",
              isExpanded ? "w-full max-w-none" : "w-full max-w-4xl px-4",
              layoutMode === "classic"
                ? "mb-12 bg-zinc-950/50 p-2 sm:p-4 border border-white/5 rounded-sm shadow-xl"
                : "",
            )}
          >
            <Image
              src={ImageProxy(imageUrl)}
              alt={`Page ${index + 1}`}
              width={1200}
              height={1800}
              className="w-full h-auto object-contain"
              loading={index < 3 ? "eager" : "lazy"}
              priority={index < 2}
            />
          </div>
        ))}

        {/* End marker */}
        <div className="w-full py-12 text-center bg-background border-t border-border/30">
          <p className="text-xs text-muted-foreground/50 font-medium mb-3">
            End of Chapter
          </p>
        </div>
      </main>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-6 right-6 z-50 p-2.5 rounded-lg bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg transition-all duration-300",
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none",
        )}
        aria-label="Scroll to top"
      >
        <ChevronUp size={18} />
      </button>
    </div>
  );
};
