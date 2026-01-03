import { AsurascansService, MangapillService } from "@/lib/services/manga.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

type PageParmas = {
  provider: "asurascans" | "mangapill";
  id: string[];
}

const functionMap = {
  mangapill: MangapillService,
  asurascans: AsurascansService
}

const MangaInfoPage = async ({ params }: { params: Promise<PageParmas> }) => {
  const param = await params;
  const provider = param.provider;
  const id = param.id.join("/");

  const mangaInfo = await functionMap[provider].getInfo(id);
  console.log(mangaInfo);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{mangaInfo.results.title}</h1>
        <p className="text-muted-foreground">Provider: {provider}</p>
        <p className="text-muted-foreground">Manga ID: {id}</p>
        
        <Link href={`/read/${provider}/${id}`}>
          <Button size="lg" className="bg-red-600 hover:bg-red-700">
            <Play size={18} className="mr-2" />
            Read Now
          </Button>
        </Link>
      </div>
    </main>
  );
}

export default MangaInfoPage;