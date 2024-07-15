import { FlamescansPopularData } from "../data/requests";
import SwiperContainer from "./homepage-format";

const Added = async () => {
  const data = await FlamescansPopularData("added");
  return (
    <div>
      <SwiperContainer data={data} displayText="Newly Added Mangas" />
    </div>
  );
};

export default Added;
