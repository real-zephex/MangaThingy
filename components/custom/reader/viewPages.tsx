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
import { X, Maximize2, Minimize2 } from "lucide-react";
import { ImageProxy } from "@/lib/services/image.proxy";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useToast } from "@/components/providers/toast-provider";
import { ProgressTracker } from "@/lib/progress/tracker";
import { Spinner } from "@/components/ui/spinner";

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
  const [count, setCount] = useState(20);
  const [toggled, setToggled] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoadingChapter, setIsLoadingChapter] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
    e: React.MouseEvent<HTMLSpanElement>,
    id: string,
  ) => {
    e.preventDefault();
    setIsLoadingChapter(true);
    toast.info("Loading Chapter...", { duration: 5000 });
    try {
      const mangaPages = await functionMap[provider].getPages(id);
      console.log(mangaPages);
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

  return (
    <div className="flex flex-col">
      {isLoadingChapter && (
        <div className="fixed w-dvw h-screen flex top-0 right-0 flex-row items-center justify-center gap-2 z-50 bg-background/90 ">
          <Spinner />
          <p>Loading</p>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 transition-all">
        {chapter
          .map((i, idx) => {
            return { ...i, index: idx };
          })
          .sort((a, b) => {
            return provider === "asurascans"
              ? b.index - a.index
              : a.index - b.index;
          })
          .slice(0, count)
          .map((chap, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.01 }}
              onClick={(e) => {
                handleClick(e, chap.id);
                updateProgress((index + 1).toString());
              }}
            >
              <Card
                key={index}
                className="h-full hover:border-primary/50 hover:bg-accent/30 transition-all duration-200 cursor-pointer"
              >
                <CardContent className="flex flex-col justify-center h-full">
                  <span
                    className="font-medium text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors"
                    title={chap.title}
                  >
                    {chap.title}
                  </span>
                  {chap.date && (
                    <span className="text-xs text-muted-foreground mt-1">
                      {chap.date}
                    </span>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </div>
      {chapter.length > 20 && (
        <Button
          className="mt-4 mx-auto"
          variant="outline"
          onClick={() => {
            setCount(toggled ? 20 : chapter.length);
            setToggled((prev) => !prev);
          }}
        >
          {toggled ? "Load Less" : `Load ${chapter.length - count} More`}
        </Button>
      )}

      {/* Image Viewer Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[50vw] p-0 flex flex-col border-l border-border bg-background"
        >
          <SheetTitle>
            
          </SheetTitle>

          <div className="absolute right-12 top-4 z-50 flex gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <Minimize2 className="h-6 w-6" />
              ) : (
                <Maximize2 className="h-6 w-6" />
              )}
            </button>
          </div>

          <div className="w-full h-full overflow-y-auto bg-black/5 pt-12 pb-4">
            <div className="flex flex-col items-center select-none">
              {images.length > 0 ? (
                images.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`relative w-full flex justify-center ${isExpanded ? "max-w-none px-0" : "max-w-2xl px-4"}`}
                  >
                    <Image
                      src={ImageProxy(imageUrl)}
                      alt={`Page ${index + 1}`}
                      width={800}
                      height={1200}
                      className="w-full h-auto object-contain"
                      loading={index < 5 ? "eager" : "lazy"}
                    />
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No images loaded</p>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChapterButton;
