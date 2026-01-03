"use client"

import Image from "next/image";
import { Manga } from "@/lib/services/manga.types";
import { ImageProxy } from "@/lib/services/image.proxy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Calendar, Layers, Play, Plus } from "lucide-react";
import Link from "next/link";

interface MangaCardProps {
  manga: Manga & { source?: string };
  variant?: "default" | "compact" | "featured";
}

export const MangaCard = ({ manga, variant = "default" }: MangaCardProps) => {
  if (variant === "compact") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-[#1a1a1a] border-gray-700 group cursor-pointer relative select-none">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={ImageProxy(manga.image)}
            alt={manga.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black to-transparent opacity-60"></div>

          {manga.status && (
            <Badge className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 flex items-center gap-1">
              <BookOpen size={12} />
              {manga.status.substring(0, 1).toUpperCase() + manga.status.substring(1)}
            </Badge>
          )}
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-bold line-clamp-2 text-white text-sm md:text-base">
            {manga.title}
          </h3>

          <div className="flex flex-wrap gap-1">
            {manga.type && (
              <Badge variant="secondary" className="text-xs">
                {manga.type}
              </Badge>
            )}
            {manga.year && (
              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                <Calendar size={12} />
                {manga.year}
              </Badge>
            )}
          </div>

          <Button size="sm" className="w-full mt-2 bg-red-600 hover:bg-red-700">
            <Play size={14} className="mr-1" />
            Read
          </Button>
        </div>
      </Card>
    );
  }

  if (variant === "featured") {
    return (
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-[#1a1a1a] border-gray-700 group select-none">
        <div className="relative h-96 overflow-hidden">

          <Image
            src={ImageProxy(manga.image)}
            alt={manga.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent"></div>

          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
            <h3 className="font-bold text-xl text-white line-clamp-2">
              {manga.title}
            </h3>

            {manga.description && (
              <p className="text-sm text-gray-300 line-clamp-2">
                {manga.description}
              </p>
            )}

            <div className="flex gap-2 flex-wrap pt-2">
              <Button className="flex items-center gap-1 bg-white text-black hover:bg-gray-200">
                <Play size={16} />
                Read Now
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/20">
                <Plus size={16} />
              </Button>
            </div>
          </div>
        </div>

        {manga.status && (
          <div className="absolute top-4 right-4 flex gap-2 flex-wrap max-w-xs justify-end">
            <Badge className="bg-red-600 hover:bg-red-700 flex items-center gap-1">
              <BookOpen size={12} />
              {manga.status.substring(0, 1).toUpperCase() + manga.status.substring(1)}
            </Badge>
            {manga.type && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Layers size={12} />
                {manga.type}
              </Badge>
            )}
            {manga.year && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar size={12} />
                {manga.year}
              </Badge>
            )}
          </div>
        )}
      </Card>
    );
  }

  // Default card
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-[#1a1a1a] border-gray-700 group cursor-pointer">
      <div className="relative h-80 overflow-hidden">
        <Link href={`/manga/${manga.source}/${manga.id}`} className="absolute inset-0 z-50 h-full w-full" />
        <Image
          src={ImageProxy(manga.image)}
          alt={manga.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black to-transparent opacity-70"></div>

        {manga.status && (
          <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 flex items-center gap-1">
            <BookOpen size={12} />
            {manga.status.substring(0, 1).toUpperCase() + manga.status.substring(1)}
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-bold line-clamp-1 text-white text-base md:text-lg">
          {manga.title}
        </h3>

        {manga.description && (
          <p className="text-xs md:text-sm text-gray-300 line-clamp-2">
            {manga.description}
          </p>
        )}

        {manga.year && <p className="text-sm font-bold text-white/50">
          Year: <span className="font-normal">{manga.year}</span>
        </p>}

        <div className="flex flex-wrap gap-2 pt-2">
          {manga.type && (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Layers size={12} />
              {manga.type}
            </Badge>
          )}
          {manga.year && (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Calendar size={12} />
              {manga.year}
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700">
            <Play size={14} className="mr-1" />
            Read
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Plus size={14} />
          </Button>
        </div>
      </div>
    </Card>
  );
};
