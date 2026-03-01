import { MangaInfo } from "@/lib/services/manga.types";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ImageProxy } from "@/lib/services/image.proxy";
import { MangaStatusDropdown } from "./manga-status-dropdown";
import ProgressBar from "./progressBar";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShareButton } from "./share-button";
import { SynopsisExpander } from "./synopsis-expander";

interface MangaInfoHeaderProps {
  manga: MangaInfo;
  provider: string;
}

export const MangaInfoHeader = ({ manga, provider }: MangaInfoHeaderProps) => {
  const statusColor = manga.status
    ? manga.status.toLowerCase().includes("ongoing")
      ? "bg-green-500/15 text-green-400 border-green-500/20"
      : manga.status.toLowerCase().includes("hiatus")
        ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
        : manga.status.toLowerCase().includes("dropped")
          ? "bg-red-500/15 text-red-400 border-red-500/20"
          : "bg-brand-start/15 text-brand-start border-brand-start/20"
    : "";

  // Build metadata items with · separators
  const metaItems: string[] = [];
  if (manga.author) metaItems.push(manga.author);
  if (manga.year) metaItems.push(String(manga.year));
  metaItems.push(`${manga.chapters.length} Chapters`);

  return (
    <section className="relative -mx-4 md:-mx-8 mb-12 overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={ImageProxy(manga.image || manga.images)}
          alt=""
          fill
          className="object-cover scale-110 blur-2xl"
          priority
        />
        {/* Heavy gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 pt-12 pb-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cover Image */}
          <div className="shrink-0 mx-auto lg:mx-0 w-56 md:w-64">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image
                src={ImageProxy(manga.image || manga.images)}
                alt={manga.title || "Manga Cover"}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Info Content */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            {/* Badges row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <Badge
                variant="secondary"
                className="rounded-sm px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-muted/60 border border-border/40"
              >
                {provider}
              </Badge>
              {manga.status && (
                <Badge
                  className={cn(
                    "rounded-sm px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider border",
                    statusColor,
                  )}
                >
                  {manga.status}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              {manga.title || "Untitled"}
            </h1>

            {/* Metadata with · separators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-2 text-sm text-muted-foreground">
              {metaItems.map((item, i) => (
                <span key={item} className="flex items-center gap-2">
                  {i > 0 && (
                    <span className="text-muted-foreground/40" aria-hidden="true">
                      ·
                    </span>
                  )}
                  {i === metaItems.length - 1 && (
                    <BookOpen size={14} className="text-brand-start" aria-hidden="true" />
                  )}
                  <span className="font-medium">{item}</span>
                </span>
              ))}
            </div>

            {/* Genre chips */}
            <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
              {manga.genres &&
                (typeof manga.genres === "string"
                  ? (manga.genres as string).split(",").map((genre: string) => (
                      <Badge
                        key={genre.trim()}
                        variant="secondary"
                        className="rounded-sm px-2.5 py-1 text-xs font-medium bg-muted/50 border border-border/30 hover:bg-brand-start/10 hover:text-brand-start hover:border-brand-start/30 transition-colors"
                      >
                        {genre.trim()}
                      </Badge>
                    ))
                  : manga.genres?.map((genre) => (
                      <Badge
                        key={genre}
                        variant="secondary"
                        className="rounded-sm px-2.5 py-1 text-xs font-medium bg-muted/50 border border-border/30 hover:bg-brand-start/10 hover:text-brand-start hover:border-brand-start/30 transition-colors"
                      >
                        {genre}
                      </Badge>
                    )))}
            </div>

            {/* Synopsis */}
            <SynopsisExpander description={manga.description} />

            {/* Progress + Actions */}
            <div className="space-y-4">
              <ProgressBar id={manga.id} />

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {manga.chapters.length > 0 && (
                  <MangaStatusDropdown manga={manga} provider={provider} />
                )}
                <ShareButton title={manga.title || "Check out this manga"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
