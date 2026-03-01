import { MangaCard } from "@/components/custom/landing/cards";
import {
  AsurascansService,
  MangapillService,
} from "@/lib/services/manga.actions";
import { Manga } from "@/lib/services/manga.types";
import { Search, Globe, Zap, TrendingUp, BookX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrowsePageProps {
  searchParams: Promise<{
    q?: string;
    provider?: string;
  }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const { q, provider = "mangapill" } = await searchParams;

  let results: Manga[] = [];
  let title = "Browse Manga";
  let icon = <Globe className="w-5 h-5 text-brand-start" />;

  try {
    if (q) {
      const searchResults =
        provider === "asurascans"
          ? await AsurascansService.search(q)
          : await MangapillService.search(q);
      results = searchResults.results;
      title = `Results for "${q}"`;
      icon = <Search className="w-5 h-5 text-brand-start" />;
    } else {
      if (provider === "asurascans") {
        const popular = await AsurascansService.getPopular();
        results = popular.results;
        title = "Popular on Asura Scans";
        icon = <TrendingUp className="w-5 h-5 text-brand-start" />;
      } else {
        const newest = await MangapillService.getNewest();
        results = newest.results;
        title = "Newest on Mangapill";
        icon = <Zap className="w-5 h-5 text-brand-start" />;
      }
    }
  } catch (error) {
    console.error("Error fetching browse data:", error);
  }

  const providers = [
    { id: "mangapill", name: "Mangapill" },
    { id: "asurascans", name: "Asura Scans" },
  ];

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      {/* Header + Search */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {icon}
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                {title}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover your next favorite manga from multiple sources.
            </p>
          </div>

          <form action="/browse" className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              aria-hidden="true"
            />
            <label htmlFor="browse-search" className="sr-only">
              Search manga in this provider
            </label>
            <Input
              id="browse-search"
              name="q"
              placeholder="Search manga..."
              defaultValue={q}
              className="pl-10 h-10 rounded-lg border-border/50 focus-visible:ring-brand-start bg-card"
            />
            <input type="hidden" name="provider" value={provider} />
          </form>
        </div>

        {/* Segmented provider control */}
        <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg w-fit border border-border/30">
          {providers.map((p) => (
            <Link
              key={p.id}
              href={`/browse?provider=${p.id}${q ? `&q=${q}` : ""}`}
              className={cn(
                "px-5 py-2 rounded-md text-sm font-semibold transition-all duration-200",
                provider === p.id
                  ? "bg-brand-start text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {results.map((manga) => (
            <MangaCard
              key={`${provider}-${manga.id}`}
              manga={{ ...manga, source: provider }}
              variant="default"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 space-y-5 text-center">
          <div className="p-6 bg-muted/50 rounded-2xl border border-border/30">
            <BookX size={48} className="text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold">No results found</h3>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              We couldn&apos;t find any manga matching your criteria. Try a
              different search or switch providers.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="font-semibold border-border/50 px-6 h-10 rounded-lg hover:border-brand-start hover:text-brand-start transition-colors"
          >
            <Link href="/browse">Clear Filters</Link>
          </Button>
        </div>
      )}
    </main>
  );
}
