import { animeTypeSearch } from "@/components/data/requests";
import SwiperContainer from "@/components/anime-ui/homepage-cards";

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
