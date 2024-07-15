import { MangaInfoFetcher } from "@/components/data/requests";
import HeroSection from "@/components/ui/hero";
import Tabs from "@/components/ui/tabs";

const MangaInfoPage = async ({ params }: { params: { items: string[] } }) => {
  const provider = params.items[0];
  const id = params.items.slice(1).join("/");

  const data = await MangaInfoFetcher(provider, id);

  return (
    <main className="lg:w-7/12 mx-auto">
      <HeroSection data={data} provider={provider} />
      <Tabs data={data} provider={provider} />
    </main>
  );
};

export default MangaInfoPage;
