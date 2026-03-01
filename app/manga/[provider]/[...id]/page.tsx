import { MangaInfoHeader } from "@/components/custom/info/manga-info-header";
import ChapterButton from "@/components/custom/reader/viewPages";
import { CommentSection } from "@/components/custom/comments/comment-section";
import { Button } from "@/components/ui/button";
import { ImageProxy } from "@/lib/services/image.proxy";
import {
  AsurascansService,
  MangapillService,
} from "@/lib/services/manga.actions";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

type PageParams = {
  provider: "asurascans" | "mangapill";
  id: string[];
};

const functionMap = {
  mangapill: MangapillService,
  asurascans: AsurascansService,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
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
    description:
      mangaInfo.results.description || "Read manga online at Otaku Oasis.",
    openGraph: {
      images: [
        {
          url: ImageProxy(mangaInfo.results.image),
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
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1.5 mb-6 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-bold">Manga Not Found</h1>
            <p className="text-muted-foreground text-sm max-w-sm">
              Could not load manga information. Please try again.
            </p>
            <Button asChild size="sm" className="mt-2">
              <Link href="/">Go Back Home</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 md:px-8 py-6 max-w-7xl">
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-1.5 mb-4 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      </Link>

      <MangaInfoHeader manga={mangaInfo.results} provider={provider} />

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <h2 className="text-xl font-bold tracking-tight">Chapters</h2>
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
            {mangaInfo.results.chapters.length} total
          </span>
        </div>

        <ChapterButton
          chapter={mangaInfo.results.chapters}
          provider={provider}
          data={mangaInfo}
        />
      </div>

      {/* Comments Section */}
      <div className="mt-12">
        <CommentSection mangaId={mangaInfo.results.id} provider={provider} />
      </div>
    </main>
  );
};

export default MangaInfoPage;
