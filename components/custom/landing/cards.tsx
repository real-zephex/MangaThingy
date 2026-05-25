"use client";

import Image from "next/image";
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
  // const sourceColor =
  //   manga.source === "asurascans" ? "bg-brand-start" : "bg-brand-end";
  const sourceColor = "bg-brand-end";

  if (variant === "compact") {
    return (
      <div className="overflow-hidden transition-colors duration-200 bg-transparent border-b border-border/20 hover:bg-card/30 group cursor-pointer relative select-none p-4 last:border-b-0">
        <div className="flex items-center gap-4">
          <Link
            href={`/manga/${manga.source}/${manga.id}`}
            className="shrink-0"
          >
            <div className="relative w-12 h-16 rounded-[4px] overflow-hidden border border-border/30 bg-muted">
              <Image
                src={ImageProxy(manga.image || manga.images)}
                alt=""
                fill
                className="object-cover group-hover:opacity-90 transition-opacity"
              />
            </div>
          </Link>

          <div className="flex-1 min-w-0 space-y-1">
            <Link href={`/manga/${manga.source}/${manga.id}`}>
              <h3 className="font-medium line-clamp-1 text-foreground text-sm group-hover:text-brand-start transition-colors">
                {manga.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2">
              {manga.type && (
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                  {manga.type}
                </span>
              )}
              <div
                className={cn("w-1.5 h-1.5 rounded-sm", sourceColor)}
                title={manga.source}
              />
            </div>
          </div>

          <div className="shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
            <TrackManga data={manga} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div className="overflow-hidden border border-border/40 bg-card group select-none relative transition-colors hover:border-border/80 flex flex-col md:flex-row h-auto md:h-[320px]">
        <div className="w-full md:w-1/3 relative h-64 md:h-full shrink-0 border-b md:border-b-0 md:border-r border-border/40 bg-muted">
          <Image
            src={ImageProxy(manga.image || manga.images)}
            alt=""
            fill
            className="object-cover"
          />
          {manga.status && (
            <div className="absolute top-3 left-3 bg-background border border-border/40 text-foreground flex items-center gap-1 text-[10px] uppercase font-bold tracking-wide px-2 py-1">
              <BookOpen size={10} aria-hidden="true" />
              {manga.status}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center p-6 md:p-8 space-y-5 z-20 flex-1 relative bg-gradient-to-br from-card to-background">
          <div className="absolute top-4 right-4 flex gap-2">
             {manga.type && (
              <span className="border border-border/40 bg-background text-foreground text-[10px] uppercase font-mono px-2 py-1">
                {manga.type}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-2xl md:text-3xl text-foreground line-clamp-2 leading-tight tracking-tight pr-12">
              {manga.title}
            </h3>
            {manga.description && (
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed max-w-2xl">
                {manga.description}
              </p>
            )}
          </div>

          <div className="flex gap-3 flex-wrap pt-2 items-center">
            <Link href={`/manga/${manga.source}/${manga.id}`}>
              <Button className="flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90 font-medium px-6 rounded-sm h-10">
                <Play size={16} fill="currentColor" aria-hidden="true" />
                Read Now
              </Button>
            </Link>
            <TrackManga data={manga} />
          </div>
        </div>
      </div>
    );
  }

  // Default card — sharper layout
  return (
    <div className="overflow-hidden border border-border/20 bg-card group cursor-pointer relative flex flex-col transition-colors hover:border-border/60">
      <Link href={`/manga/${manga.source}/${manga.id}`} className="block relative border-b border-border/20">
        <div className="relative aspect-[2/3] overflow-hidden bg-muted">
          <Image
            src={ImageProxy(manga.image || manga.images)}
            alt=""
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Track button — hover-reveal */}
          <div
            className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30"
            onClick={(e) => e.preventDefault()}
          >
            <TrackManga data={manga} />
          </div>

          {manga.status && (
            <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t border-border/40 text-foreground flex justify-center items-center py-1.5 text-[10px] uppercase tracking-widest font-mono">
              {manga.status}
            </div>
          )}
        </div>
      </Link>

      {/* Persistent card footer */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap gap-2 items-center text-muted-foreground">
            <div
              className={cn("w-2 h-2 rounded-sm", sourceColor)}
              title={manga.source}
            />
            {manga.type && (
              <span className="text-[10px] uppercase font-mono tracking-wider">
                {manga.type}
              </span>
            )}
            {manga.year && (
              <>
                <span className="text-[10px]">•</span>
                <span className="text-[10px] uppercase font-mono tracking-wider">
                  {manga.year}
                </span>
              </>
            )}
          </div>
          <h3 className="font-medium line-clamp-2 text-foreground text-sm leading-snug group-hover:text-brand-start transition-colors duration-200">
            {manga.title}
          </h3>
        </div>
      </div>
    </div>
  );
};
