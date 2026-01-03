import { MangaInfo } from "@/lib/services/manga.types";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ImageProxy } from "@/lib/services/image.proxy";
import { MangaStatusDropdown } from "./manga-status-dropdown";
import ProgressBar from "./progressBar";
import { BookOpen, Calendar, User, Info, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MangaInfoHeaderProps {
  manga: MangaInfo;
  provider: string;
}

export const MangaInfoHeader = ({ manga, provider }: MangaInfoHeaderProps) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-card text-card-foreground shadow-2xl mb-12 border border-border/50">
      {/* Background Blur Cover */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <Image
          src={ImageProxy(manga.image || manga.images)}
          alt={manga.title || "Manga Cover"}
          fill
          className="object-cover blur-2xl scale-110"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-card via-card/80 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-10 p-8 md:p-12">
        {/* Cover Image with Glow */}
        <div className="shrink-0 mx-auto lg:mx-0 w-64 md:w-80 group relative">
          <div className="absolute -inset-1 bg-linear-to-r from-orange-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative aspect-2/3 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10">
            <Image
              src={ImageProxy(manga.image || manga.images)}
              alt={manga.title || "Manga Cover"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
        </div>

        {/* Info Content */}
        <div className="flex-1 space-y-8">
          <div className="space-y-4 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3 py-1 font-bold uppercase tracking-wider text-[10px]">
                {provider}
              </Badge>
              {manga.status && (
                <Badge
                  className={cn(
                    "px-3 py-1 font-bold uppercase tracking-wider text-[10px]",
                    manga.status.toLowerCase().includes("ongoing")
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  )}
                >
                  {manga.status}
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
              {manga.title || "Untitled Masterpiece"}
            </h1>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-muted-foreground font-medium">
              {manga.author && (
                <div className="flex items-center gap-2">
                  <User size={18} className="text-primary" />
                  <span>{manga.author}</span>
                </div>
              )}
              {manga.year && (
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  <span>{manga.year}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-primary" />
                <span>{manga.chapters.length} Chapters</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {manga.genres && (typeof manga.genres === "string"
              ? (manga.genres as string).split(",").map((genre: string) => (
                <Badge
                  key={genre.trim()}
                  variant="secondary"
                  className="px-4 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary transition-colors border-none font-semibold"
                >
                  {genre.trim()}
                </Badge>
              ))
              : manga.genres?.map((genre) => (
                <Badge 
                  key={genre} 
                  variant="secondary" 
                  className="px-4 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary transition-colors border-none font-semibold"
                >
                  {genre}
                </Badge>
              )))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Info size={20} className="text-primary" />
              Synopsis
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p className="line-clamp-6 hover:line-clamp-none transition-all duration-500 cursor-pointer">
                {manga.description || "No description available for this title."}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <ProgressBar id={manga.id} />
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
              {manga.chapters.length > 0 && (
                <MangaStatusDropdown manga={manga} provider={provider} />
              )}
              <Button variant="outline" size="lg" className="rounded-xl border-2 font-bold gap-2">
                <Share2 size={18} />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
