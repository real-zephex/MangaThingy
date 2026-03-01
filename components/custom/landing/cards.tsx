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
  const sourceColor =
    manga.source === "asurascans" ? "bg-brand-start" : "bg-brand-end";

  if (variant === "compact") {
    return (
      <Card className="overflow-hidden transition-colors duration-200 bg-card border-border/50 hover:border-brand-start/30 group cursor-pointer relative select-none p-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/manga/${manga.source}/${manga.id}`}
            className="shrink-0"
          >
            <div className="relative w-14 h-18 rounded-lg overflow-hidden border border-border/30">
              <Image
                src={ImageProxy(manga.image || manga.images)}
                alt=""
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </Link>

          <div className="flex-1 min-w-0 space-y-1.5">
            <Link href={`/manga/${manga.source}/${manga.id}`}>
              <h3 className="font-semibold line-clamp-1 text-foreground text-sm group-hover:text-brand-start transition-colors">
                {manga.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2">
              {manga.type && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 bg-secondary/80 font-medium"
                >
                  {manga.type}
                </Badge>
              )}
              <div
                className={cn("w-1.5 h-1.5 rounded-full", sourceColor)}
                title={manga.source}
              />
            </div>
          </div>

          <div className="shrink-0">
            <TrackManga data={manga} />
          </div>
        </div>
      </Card>
    );
  }

  if (variant === "featured") {
    return (
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-card border-border/50 group select-none relative">
        <div className="relative h-80 md:h-96 overflow-hidden">
          <Image
            src={ImageProxy(manga.image || manga.images)}
            alt=""
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3 z-20">
            <div className="space-y-2">
              <h3 className="font-black text-xl md:text-2xl text-foreground line-clamp-2 leading-tight drop-shadow-md">
                {manga.title}
              </h3>
              {manga.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {manga.description}
                </p>
              )}
            </div>

            <div className="flex gap-3 flex-wrap pt-1">
              <Link href={`/manga/${manga.source}/${manga.id}`}>
                <Button className="flex items-center gap-2 bg-brand-start text-white hover:bg-brand-start/90 font-semibold px-5 shadow-lg shadow-brand-shadow">
                  <Play size={16} fill="currentColor" aria-hidden="true" />
                  Read Now
                </Button>
              </Link>
              <TrackManga data={manga} />
            </div>
          </div>
        </div>

        <div className="absolute top-3 right-3 flex gap-2 flex-wrap max-w-xs justify-end z-20">
          {manga.status && (
            <Badge className="bg-brand-start/90 text-white flex items-center gap-1 shadow-md border-none text-[10px] uppercase font-bold tracking-wide px-2 py-0.5">
              <BookOpen size={10} aria-hidden="true" />
              {manga.status}
            </Badge>
          )}
          {manga.type && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 shadow-md backdrop-blur-md bg-background/70 border-none text-[10px] uppercase font-bold tracking-wide px-2 py-0.5"
            >
              <Layers size={10} aria-hidden="true" />
              {manga.type}
            </Badge>
          )}
        </div>
      </Card>
    );
  }

  // Default card — persistent footer, CSS-only hover
  return (
    <Card className="overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-card border-border/50 group cursor-pointer relative">
      <Link href={`/manga/${manga.source}/${manga.id}`} className="block">
        <div className="relative aspect-2/3 overflow-hidden">
          <Image
            src={ImageProxy(manga.image || manga.images)}
            alt=""
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Track button — hover-reveal */}
          <div
            className="absolute top-2.5 left-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30"
            onClick={(e) => e.preventDefault()}
          >
            <TrackManga data={manga} />
          </div>

          {manga.status && (
            <Badge className="absolute top-2.5 right-2.5 bg-brand-start/90 text-white flex items-center gap-1 z-30 shadow-sm border border-brand-start/20 text-[10px] uppercase font-bold tracking-wide px-2 py-0.5">
              <BookOpen size={10} aria-hidden="true" />
              {manga.status}
            </Badge>
          )}
        </div>
      </Link>

      {/* Persistent card footer */}
      <div className="p-3.5 space-y-2.5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap gap-1">
            {manga.type && (
              <Badge
                variant="secondary"
                className="text-[10px] uppercase font-semibold px-1.5 py-0 h-4 bg-secondary/70 border-none"
              >
                {manga.type}
              </Badge>
            )}
            {manga.year && (
              <Badge
                variant="secondary"
                className="text-[10px] uppercase font-semibold px-1.5 py-0 h-4 flex items-center gap-0.5 bg-secondary/70 border-none"
              >
                <Calendar size={8} aria-hidden="true" />
                {manga.year}
              </Badge>
            )}
          </div>
          <h3 className="font-semibold line-clamp-1 text-foreground text-sm group-hover:text-brand-start transition-colors duration-200">
            {manga.title}
          </h3>
        </div>

        <Link href={`/manga/${manga.source}/${manga.id}`} className="block">
          <Button
            size="sm"
            className="w-full bg-brand-start hover:bg-brand-start/90 text-white border-none font-semibold shadow-sm transition-colors duration-200"
          >
            <Play
              size={13}
              className="mr-1"
              fill="currentColor"
              aria-hidden="true"
            />
            Read
          </Button>
        </Link>
      </div>
    </Card>
  );
};
