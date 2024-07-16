import { MangaInfo } from "../data/types";
import ChapterSelector from "../chapterSelector";

const Tabs = async ({
  data,
  provider,
}: {
  data: MangaInfo;
  provider: string;
}) => {
  const genres = Array.isArray(data.results.genres)
    ? data.results.genres.join(", ")
    : data.results.genres;

  return (
    <div className="w-full">
      <div role="tablist" className="tabs tabs-boxed mt-2">
        {data.results.description && (
          <>
            <input
              type="radio"
              name="my_tabs_1"
              role="tab"
              className="tab"
              aria-label="Description"
            />
            <div role="tabpanel" className="tab-content p-2">
              <p>{data.results.description}</p>
            </div>
          </>
        )}

        {data.results.genres && (
          <>
            <input
              type="radio"
              name="my_tabs_1"
              role="tab"
              className="tab"
              aria-label="Info"
            />
            <div role="tabpanel" className="tab-content p-2">
              <p>Genres: {genres}</p>
              <p>Author: {data.results.author ? data.results.author : "?"}</p>
            </div>
          </>
        )}

        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="Chapters"
          defaultChecked
        />
        <div role="tabpanel" className="tab-content">
          <div>
            <ChapterSelector data={data} provider={provider} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
