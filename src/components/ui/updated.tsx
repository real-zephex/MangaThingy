import { FlamescansPopularData } from "../data/requests";
import SwiperContainer from "./homepage-format";

const Updated = async () => {
  const data = await FlamescansPopularData("update");
  return (
    <div>
      <SwiperContainer data={data} displayText="Recently Updated Mangas" />
    </div>
  );
};

export default Updated;
