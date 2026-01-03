import { MangaInfo } from "@/lib/services/manga.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface MangaInfoHeaderProps {
  manga: MangaInfo;
  provider: string;
}

export const MangaInfoHeader = ({ manga, provider }: MangaInfoHeaderProps) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-card text-card-foreground shadow-sm mb-8">
      {/* Background Blur */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <Image
          src={manga.image}
          alt={manga.title}
          fill
          className="object-cover blur-3xl"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-8 p-6 md:p-8">
        {/* Cover Image */}
        <div className="flex-shrink-0 mx-auto md:mx-0 w-64 md:w-72 aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl border border-border/50">
           <Image
            src={manga.image}
            alt={manga.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Info Content */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{manga.title}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-muted-foreground">
               {manga.author && <span>By {manga.author}</span>}
               {manga.year && (
                 <>
                   <span className="hidden md:inline">•</span>
                   <span>{manga.year}</span>
                 </>
               )}
               {manga.status && (
                 <Badge variant={manga.status.toLowerCase().includes("ongoing") ? "default" : "secondary"}>
                   {manga.status}
                 </Badge>
               )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
             {manga.genres?.map((genre) => (
               <Badge key={genre} variant="outline" className="px-3 py-1">
                 {genre}
               </Badge>
             ))}
          </div>

           <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
              <p>{manga.description}</p>
           </div>

           <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center md:justify-start">
              {manga.chapters.length > 0 && (
                <Link href={`/read/${provider}/${manga.chapters[manga.chapters.length - 1].id}`}>
                  <Button size="lg" className="w-full sm:w-auto font-semibold text-lg h-12 px-8">
                    <Play className="mr-2 h-5 w-5" fill="currentColor" />
                    Start Reading
                  </Button>
                </Link>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
