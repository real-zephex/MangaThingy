import {
  AsurascansService,
  MangapillService,
} from "@/lib/services/manga.actions";
import { MangaInfoHeader } from "@/components/custom/info/manga-info-header";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChapterButton from "@/components/custom/reader/viewPages";
import type { Metadata, ResolvingMetadata } from 'next'

type PageParams = {
  provider: "asurascans" | "mangapill";
  id: string[];
};

const functionMap = {
  mangapill: MangapillService,
  asurascans: AsurascansService,
};

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const param = await params;
  const provider = param.provider;
  const id = param.id.join("/");

  const mangaInfo = await functionMap[provider].getInfo(id);

  if (mangaInfo.status !== 200 || !mangaInfo.results) {
    return {
      title: "Manga Not Found | Otaku Oasis",
      description: "Could not load manga information. Please try again.",
    };
  }

  return {
    title: `${mangaInfo.results.title}`,
    description: mangaInfo.results.description || "Read manga online at Otaku Oasis.",
    openGraph: {
      images: [
        {
          url: mangaInfo.results.image,
          alt: mangaInfo.results.title,
        },
      ],
    },

  };
}

const MangaInfoPage = async ({ params }: { params: Promise<PageParams> }) => {
  const param = await params;
  const provider = param.provider;
  const id = param.id.join("/");

  const mangaInfo = await functionMap[provider].getInfo(id);

  if (!mangaInfo || !mangaInfo.results) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <MoveLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Manga Not Found</h1>
            <p className="text-muted-foreground mb-4">
              Could not load manga information. Please try again.
            </p>
            <Link href="/">
              <Button>Go Back Home</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <MoveLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <MangaInfoHeader manga={mangaInfo.results} provider={provider} />

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight">Chapters</h2>
            <p className="text-muted-foreground font-medium">
              Explore the latest releases and catch up on the story
            </p>
          </div>
          <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl border border-border/50">
            <span className="text-sm font-bold text-primary">
              {mangaInfo.results.chapters.length}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              Total Chapters
            </span>
          </div>
        </div>

        <ChapterButton
          chapter={mangaInfo.results.chapters}
          provider={provider}
          data={mangaInfo}
        />
      </div>
    </main>
  );
};

export default MangaInfoPage;
