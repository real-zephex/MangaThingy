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
    <div className="w-full" aria-label="Tabs Container">
      <div
        role="tablist"
        className="tabs tabs-boxed mt-2"
        aria-label="Tabs List"
      >
        {data.results.description && (
          <>
            <input
              type="radio"
              name="my_tabs_1"
              role="tab"
              className="tab"
              aria-label="Description"
              title="Description Tab"
            />
            <div
              role="tabpanel"
              className="tab-content p-2"
              aria-label="Description Panel"
            >
              <p aria-label="Manga Description">{data.results.description}</p>
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
              title="Info Tab"
            />
            <div
              role="tabpanel"
              className="tab-content p-2"
              aria-label="Info Panel"
            >
              <p aria-label="Manga Genres">Genres: {genres}</p>
              <p aria-label="Manga Author">
                Author: {data.results.author ? data.results.author : "?"}
              </p>
            </div>
          </>
        )}

        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="Chapters"
          title="Chapters Tab"
          defaultChecked
        />
        <div
          role="tabpanel"
          className="tab-content"
          aria-label="Chapters Panel"
        >
          <div aria-label="Chapter Selector Container">
            <ChapterSelector data={data} provider={provider} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
