import { animeInfo } from "@/components/data/requests";
import AnimeVideoPage from "@/components/anime-ui/video-page";
import AnimeInformation from "@/components/anime-ui/anime-info";

const AnimeInfoPage = async ({ params }: { params: { id: string } }) => {
  const data = await animeInfo(params.id);
  const episodeData = data.episodes;

  return (
    <main className="lg:w-9/12 w-full mx-auto overflow-x-hidden mt-1">
      <AnimeVideoPage data={episodeData} />
      <AnimeInformation animeInfo={data} />
    </main>
  );
};

export default AnimeInfoPage;
