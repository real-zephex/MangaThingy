"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Chapter,
  MangaInfo,
  MangaInfoResults,
} from "@/lib/services/manga.types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  AsurascansService,
  MangapillService,
} from "@/lib/services/manga.actions";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import Image from "next/image";
import { Maximize2, Minimize2, Search, ArrowUpDown, Clock, Play } from "lucide-react";
import { ImageProxy } from "@/lib/services/image.proxy";
import { useToast } from "@/components/providers/toast-provider";
import { ProgressTracker } from "@/lib/progress/tracker";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const functionMap = {
  mangapill: MangapillService,
  asurascans: AsurascansService,
};

const ChapterButton = ({
  chapter,
  provider,
  data,
}: {
  chapter: Chapter[];
  provider: "asurascans" | "mangapill";
  data: MangaInfoResults<MangaInfo>;
}) => {
  const [count, setCount] = useState(24);
  const [toggled, setToggled] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [currentChapter, setCurrentChapter] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoadingChapter, setIsLoadingChapter] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isReversed, setIsReversed] = useState(provider === "asurascans");



  const toast = useToast();
  const tracker = new ProgressTracker();

  // Preload images in background
  const preloadImages = (imageUrls: string[]) => {
    imageUrls.forEach((url) => {
      const img = new window.Image();
      img.src = ImageProxy(url);
    });
  };

  const updateProgress = (chapter: string) => {
    const getEntry = tracker.getOne(data.results.id);
    if (getEntry) {
      const entries = {
        ...getEntry,
        chapter,
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
        chapter,
        totalChapter: data.results.chapters.length.toString(),
      };
      tracker.addSingle(entries);
      toast.info(`Manga ${data.results.title} has been added.`);
    }
  };

  const handleClick = async (
    e: React.MouseEvent<HTMLDivElement>,
    id: string,
  ) => {
    e.preventDefault();
    setIsLoadingChapter(true);
    toast.info("Loading Chapter...", { duration: 5000 });
    try {
      const mangaPages = await functionMap[provider].getPages(id);
      setImages(mangaPages.results);

      // Preload all images in background (no await)
      setIsSidebarOpen(true);
      preloadImages(mangaPages.results);
    } catch (error) {
      console.error("Failed to load chapter pages:", error);
    } finally {
      setIsLoadingChapter(false);
      toast.info("Chapter Loaded", { duration: 2000 });
    }
  };



  const filteredChapters = chapter
    .map((i, idx) => ({ ...i, index: idx }))
    .filter((chap) =>
      chap.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => isReversed ? b.index - a.index : a.index - b.index);

  const displayedChapters = toggled ? filteredChapters : filteredChapters.slice(0, count);

  return (
    <div className="flex flex-col space-y-6">
      {isLoadingChapter && (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 z-50 bg-background/80 backdrop-blur-sm">
          <div className="p-4 bg-card rounded-2xl shadow-2xl border border-border flex flex-col items-center gap-4">
            <Spinner className="w-10 h-10 text-primary" />
            <p className="font-bold text-lg animate-pulse">Summoning Pages...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/30 p-4 rounded-2xl border border-border/50">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search chapters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl border-2 focus-visible:ring-primary bg-background"
          />
        </div>

        <Button
          variant="outline"
          className="w-full md:w-auto rounded-xl border-2 font-bold gap-2"
          onClick={() => setIsReversed(!isReversed)}
        >
          <ArrowUpDown size={18} />
          {isReversed ? "Newest First" : "Oldest First"}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {displayedChapters.map((chap, index) => (
          <motion.div
            key={chap.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: Math.min(index * 0.02, 0.5) }}
            onClick={(e) => {
              handleClick(e, chap.id);
              updateProgress((chap.index + 1).toString());
              setCurrentChapter(chap.title);
            }}
          >
            <Card className="group h-full hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer border-2 bg-card/50 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-4 flex flex-col justify-between h-full relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                      Chapter {chap.index + 1}
                    </span>
                    {chap.date && (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock size={10} />
                        {chap.date}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {chap.title}
                  </h3>
                </div>

                <div className="mt-4 flex items-center justify-end">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Play size={14} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredChapters.length > count && (
        <Button
          className="mt-8 mx-auto rounded-xl border-2 font-bold px-12 h-12 hover:bg-primary hover:text-white transition-all duration-300"
          variant="outline"
          onClick={() => {
            setToggled(!toggled);
          }}
        >
          {toggled ? "Show Less" : `View All ${filteredChapters.length} Chapters`}
        </Button>
      )}

      {/* Image Viewer Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[60vw] p-0 flex flex-col border-l border-border bg-background shadow-2xl"
        >
          <SheetTitle className="sr-only">Chapter Reader</SheetTitle>

          <div className="absolute right-12 top-4 z-50 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-full shadow-lg"
            >
              {isExpanded ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </Button>
          </div>

          <div className="w-full h-full overflow-y-auto bg-black/5 scrollbar-hide">
            <div className="flex flex-col items-center select-none py-8">

              {/* Chapter Title Header */}
              <div className="flex flex-row items-center justify-center p-2 w-full">
                <p className="text-sm font-bold text-muted-foreground">
                  Reading {currentChapter}
                </p>
              </div>
              <hr className="border-2 border-amber-200 w-full mb-2" />
              {/* Image renderer */}
              {images.length > 0 ? (
                <>
                  {images.map((imageUrl, index) => (
                    <div
                      key={index}
                      className={cn(
                        "relative w-full flex justify-center transition-all duration-500",
                        isExpanded ? "max-w-none px-0" : "max-w-3xl px-4"
                      )}
                    >
                      <Image
                        src={ImageProxy(imageUrl)}
                        alt={`Page ${index + 1}`}
                        width={1000}
                        height={1500}
                        className="w-full h-auto object-contain shadow-2xl"
                        loading={index < 3 ? "eager" : "lazy"}
                      />
                    </div>
                  ))}
                  {/* Completion message at the end */}
                  <div className="w-full max-w-3xl px-4 py-12 mt-8">
                    <div className="bg-card border-2 border-primary/50 rounded-2xl p-8 text-center shadow-lg">
                      <h3 className="text-2xl font-black mb-2 text-primary">
                        Chapter Completed! 🎉
                      </h3>
                      <p className="text-lg font-semibold text-foreground">
                        You&apos;ve finished reading {currentChapter}
                      </p>
                      <p className="text-sm text-muted-foreground mt-4">
                        Close this panel to select another chapter
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <Spinner className="w-8 h-8" />
                  <p className="text-muted-foreground font-medium">Loading pages...</p>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div >
  );
};

export default ChapterButton;
