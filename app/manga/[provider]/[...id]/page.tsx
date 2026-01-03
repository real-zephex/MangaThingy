import {
  AsurascansService,
  MangapillService,
} from "@/lib/services/manga.actions";
import { MangaInfoHeader } from "@/components/custom/info/manga-info-header";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChapterButton from "@/components/custom/reader/viewPages";

type PageParams = {
  provider: "asurascans" | "mangapill";
  id: string[];
};

const functionMap = {
  mangapill: MangapillService,
  asurascans: AsurascansService,
};

const MangaInfoPage = async ({ params }: { params: Promise<PageParams> }) => {
  const param = await params;
  const provider = param.provider;
  const id = param.id.join("/");

  const mangaInfo = await functionMap[provider].getInfo(id);
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

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Chapters</h2>
          <span className="text-muted-foreground text-sm">
            {mangaInfo.results.chapters.length} chapters
          </span>
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
