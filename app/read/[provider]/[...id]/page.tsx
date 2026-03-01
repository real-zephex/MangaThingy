import { ReaderView } from "@/components/custom/reader/ReaderPage";
import {
  AsurascansService,
  MangapillService,
} from "@/lib/services/manga.actions";
import type { Metadata } from "next";

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
  const { provider, id } = await params;
  const chapterId = id.join("/");

  return {
    title: `Reading - ${chapterId} | Otaku Oasis`,
    description: `Reading chapter from ${provider}`,
  };
}

export default async function ReaderPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<{
    title?: string;
    mangaId?: string;
    mangaTitle?: string;
  }>;
}) {
  const { provider, id } = await params;
  const { title, mangaId, mangaTitle } = await searchParams;
  const chapterId = id.join("/");

  let pages: string[] = [];
  let error: string | null = null;

  try {
    const result = await functionMap[provider].getPages(chapterId);
    if (result.status === 200 && result.results) {
      pages = result.results;
    } else {
      error = "Failed to load chapter pages.";
    }
  } catch (e) {
    console.error("[ReaderPage] Error fetching pages:", e);
    error = "An error occurred while loading the chapter.";
  }

  return (
    <ReaderView
      pages={pages}
      error={error}
      provider={provider}
      chapterId={chapterId}
      chapterTitle={title || chapterId}
      mangaId={mangaId}
      mangaTitle={mangaTitle}
    />
  );
}
