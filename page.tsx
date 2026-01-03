import { AsurascansService, MangapillService } from "@/lib/services/manga.actions";

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
    <main className="container mx-auto px-4">
      <h1>Manga Info Page</h1>
      <p>Provider: {provider}</p>
      <p>Manga ID: {id}</p>
    </main>
  );
}

export default MangaInfoPage;