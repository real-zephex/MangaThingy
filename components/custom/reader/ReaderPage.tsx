"use client";

import { ImageProxy } from "@/lib/services/image.proxy";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ChevronUp,
  Maximize2,
  Minimize2,
} from "lucide-react";
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
}

export const ReaderView = ({
  pages,
  error,
  provider,
  chapterTitle,
  mangaId,
  mangaTitle,
}: ReaderViewProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showTopBar, setShowTopBar] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
  const backHref = mangaId
    ? `/manga/${provider}/${mangaId}`
    : "/";

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
    <div className="min-h-screen bg-black">
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

          <div className="flex items-center gap-2 shrink-0">
            {/* Page counter */}
            <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
              {currentPage} / {pages.length}
            </span>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-md hover:bg-accent transition-colors"
              aria-label={isExpanded ? "Fit to width" : "Full width"}
            >
              {isExpanded ? (
                <Minimize2 size={16} />
              ) : (
                <Maximize2 size={16} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Pages */}
      <main className="flex flex-col items-center select-none pt-12">
        {pages.map((imageUrl, index) => (
          <div
            key={index}
            className={cn(
              "relative w-full flex justify-center",
              isExpanded ? "max-w-none" : "max-w-4xl px-4",
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
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-start hover:underline"
          >
            <ArrowLeft size={14} />
            Back to {mangaTitle || "manga"}
          </Link>
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
