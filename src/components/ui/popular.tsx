import { FlamescansPopularData } from "../data/requests";
import SwiperContainer from "./homepage-format";

const Popular = async () => {
  const data = await FlamescansPopularData("popular");
  return (
    <div>
      <SwiperContainer data={data} displayText="Popular Mangas" />
    </div>
  );
};

export default Popular;
