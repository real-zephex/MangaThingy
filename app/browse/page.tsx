import { MangaCard } from "@/components/custom/landing/cards";
import {
  AsurascansService,
  MangapillService,
} from "@/lib/services/manga.actions";
import { Results, Manga } from "@/lib/services/manga.types";
import { Search, Filter, Globe, Zap, TrendingUp } from "lucide-react";
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
  let icon = <Globe className="w-6 h-6 text-primary" />;

  try {
    if (q) {
      const searchResults = provider === "asurascans" 
        ? await AsurascansService.search(q)
        : await MangapillService.search(q);
      results = searchResults.results;
      title = `Search results for "${q}"`;
      icon = <Search className="w-6 h-6 text-primary" />;
    } else {
      if (provider === "asurascans") {
        const popular = await AsurascansService.getPopular();
        results = popular.results;
        title = "Popular on Asura Scans";
        icon = <TrendingUp className="w-6 h-6 text-orange-500" />;
      } else {
        const newest = await MangapillService.getNewest();
        results = newest.results;
        title = "Newest on Mangapill";
        icon = <Zap className="w-6 h-6 text-blue-500" />;
      }
    }
  } catch (error) {
    console.error("Error fetching browse data:", error);
  }

  const providers = [
    { id: "mangapill", name: "Mangapill", color: "text-blue-500" },
    { id: "asurascans", name: "Asura Scans", color: "text-orange-500" },
  ];

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {icon}
            <h1 className="text-3xl font-black tracking-tight">{title}</h1>
          </div>
          <p className="text-muted-foreground">
            Discover your next favorite manga from multiple sources.
          </p>
        </div>

        <form action="/browse" className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Search in this provider..."
            defaultValue={q}
            className="pl-10 h-11 rounded-xl border-2 focus-visible:ring-primary"
          />
          <input type="hidden" name="provider" value={provider} />
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b pb-6">
        <div className="flex items-center gap-2 mr-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">
          <Filter size={16} />
          Sources:
        </div>
        {providers.map((p) => (
          <Link
            key={p.id}
            href={`/browse?provider=${p.id}${q ? `&q=${q}` : ""}`}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border-2",
              provider === p.id
                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border-border hover:border-primary/50 text-muted-foreground hover:text-primary"
            )}
          >
            {p.name}
          </Link>
        ))}
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {results.map((manga, idx) => (
            <MangaCard
              key={idx}
              manga={{ ...manga, source: provider }}
              variant="default"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <div className="p-6 bg-muted rounded-full">
            <Search size={48} className="text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">No results found</h3>
            <p className="text-muted-foreground max-w-xs">
              We couldn't find any manga matching your criteria. Try a different search or provider.
            </p>
          </div>
          <Button asChild variant="outline" className="font-bold border-2">
            <Link href="/browse">Clear Filters</Link>
          </Button>
        </div>
      )}
    </main>
  );
}
