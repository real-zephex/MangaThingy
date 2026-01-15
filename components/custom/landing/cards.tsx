"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Manga } from "@/lib/services/manga.types";
import { ImageProxy } from "@/lib/services/image.proxy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Calendar, Layers, Play } from "lucide-react";
import Link from "next/link";
import { TrackManga } from "./tracker";
import { cn } from "@/lib/utils";

interface MangaCardProps {
  manga: Manga & { source?: string };
  variant?: "default" | "compact" | "featured";
}

export const MangaCard = ({ manga, variant = "default" }: MangaCardProps) => {
  const sourceColor = manga.source === "asurascans" ? "bg-orange-500" : "bg-blue-500";

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-card border-border group cursor-pointer relative select-none">
          <div className="relative h-64 overflow-hidden">
            <Link
              href={`/manga/${manga.source}/${manga.id}`}
              className="absolute inset-0 z-10"
            />
            <Image
              src={ImageProxy(manga.image || manga.images)}
              alt={manga.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent opacity-60"></div>

            {/* <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
              {manga.source && (
                <Badge className={cn("text-[10px] px-1.5 py-0 h-5 uppercase font-bold border-none text-white", sourceColor)}>
                  {manga.source}
                </Badge>
              )}
            </div> */}

            {manga.status && (
              <Badge className="absolute top-2 right-2 bg-primary/90 hover:bg-primary flex items-center gap-1 z-20">
                <BookOpen size={10} />
                <span className="text-[10px] uppercase font-bold">
                  {manga.status}
                </span>
              </Badge>
            )}
          </div>

          <div className="p-3 space-y-2">
            <h3 className="font-bold line-clamp-1 text-foreground text-sm group-hover:text-primary transition-colors">
              {manga.title}
            </h3>

            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-1">
                {manga.type && (
                  <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                    {manga.type}
                  </Badge>
                )}
              </div>
              <TrackManga data={manga} />
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
      >
        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-card border-border group select-none relative">
          <div className="relative h-112.5 overflow-hidden">
            <Image
              src={ImageProxy(manga.image || manga.images)}
              alt={manga.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent"></div>

            {/* <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
              {manga.source && (
                <Badge className={cn("text-xs px-2 py-0.5 uppercase font-bold border-none text-white shadow-lg", sourceColor)}>
                  {manga.source}
                </Badge>
              )}
            </div> */}

            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4 z-20">
              <div className="space-y-2">
                <h3 className="font-black text-2xl md:text-3xl text-white line-clamp-2 leading-tight drop-shadow-md">
                  {manga.title}
                </h3>
                {manga.description && (
                  <p className="text-sm text-gray-200 line-clamp-3 leading-relaxed drop-shadow-sm">
                    {manga.description}
                  </p>
                )}
              </div>

              <div className="flex gap-3 flex-wrap pt-2">
                <Link href={`/manga/${manga.source}/${manga.id}`}>
                  <Button className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 font-bold px-6">
                    <Play size={18} fill="currentColor" />
                    Read Now
                  </Button>
                </Link>
                <TrackManga data={manga} />
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 flex gap-2 flex-wrap max-w-xs justify-end z-20">
            {manga.status && (
              <Badge className="bg-primary hover:bg-primary/90 flex items-center gap-1 shadow-lg">
                <BookOpen size={12} />
                <span className="uppercase font-bold text-[10px]">
                  {manga.status}
                </span>
              </Badge>
            )}
            {manga.type && (
              <Badge variant="secondary" className="flex items-center gap-1 shadow-lg backdrop-blur-md bg-secondary/80">
                <Layers size={12} />
                <span className="uppercase font-bold text-[10px]">{manga.type}</span>
              </Badge>
            )}
          </div>
        </Card>
      </motion.div>
    );
  }

  // Default card
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 bg-card border-border group cursor-pointer relative">
        <div className="relative h-80 overflow-hidden">
          <Link
            href={`/manga/${manga.source}/${manga.id}`}
            className="absolute inset-0 z-20 h-full w-full"
          />
          <Image
            src={ImageProxy(manga.image || manga.images)}
            alt={manga.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-80"></div>

          {/* <div className="absolute top-3 left-3 flex flex-col gap-2 z-30">
            {manga.source && (
              <Badge className={cn("text-[10px] px-2 py-0.5 uppercase font-bold border-none text-white shadow-md", sourceColor)}>
                {manga.source}
              </Badge>
            )}
          </div> */}

          {manga.status && (
            <Badge className="absolute top-3 right-3 bg-primary/90 hover:bg-primary flex items-center gap-1 z-30 shadow-md">
              <BookOpen size={12} />
              <span className="text-[10px] uppercase font-bold">
                {manga.status}
              </span>
            </Badge>
          )}
        </div>

        <div className="p-4 space-y-3 relative z-10">
          <h3 className="font-bold line-clamp-1 text-foreground text-base md:text-lg group-hover:text-primary transition-colors duration-300">
            {manga.title}
          </h3>

          {manga.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {manga.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-wrap gap-1.5">
              {manga.type && (
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-bold px-1.5 py-0 h-5"
                >
                  {manga.type}
                </Badge>
              )}
              {manga.year && (
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-bold px-1.5 py-0 h-5 flex items-center gap-1"
                >
                  <Calendar size={10} />
                  {manga.year}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Link href={`/manga/${manga.source}/${manga.id}`} className="flex-1">
              <Button size="sm" className="w-full bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-none font-bold shadow-md transition-all duration-300">
                <Play size={14} className="mr-1" fill="currentColor" />
                Read
              </Button>
            </Link>
            <TrackManga data={manga} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
