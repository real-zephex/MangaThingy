import { animeTypeSearch } from "@/components/data/requests";
import SwiperContainer from "@/components/anime-ui/homepage-cards";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MangaThingy Anime",
  description:
    "Anime website where you watch animes without any ads or interruptions.",
};

const AnimeHomepage = async () => {
  const popular = await animeTypeSearch("popular");
  const recent = await animeTypeSearch("recent-episodes");
  const top = await animeTypeSearch("top-airing");

  return (
    <main data-theme="dracula">
      <SwiperContainer data={popular} displayText="Popular Animes" />
      <div className="divider divider-info">or</div>
      <SwiperContainer data={recent} displayText="Recently-Released Animes" />
      <div className="divider divider-info">or</div>
      <SwiperContainer data={top} displayText="Top-Airing Animes" />
    </main>
  );
};

export default AnimeHomepage;
