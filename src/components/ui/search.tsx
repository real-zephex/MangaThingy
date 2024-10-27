"use client";
import { SetStateAction, useState, useCallback, useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import { SearchMangas } from "../data/requests";
import { animeTypeSearch } from "../data/requests";

const Search = () => {
  const router = useRouter();

  const [mangaTitle, setMangaTitle] = useState<string>("");
  const [provider, setProvider] = useState<string>("mangapill");
  const [format, setFormat] = useState<JSX.Element>(<></>);

  const pathname = usePathname();

  const handleChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setProvider(event.target.value);
    console.log(`Selected: ${event.target.value}`);
  };

  const setResults = useCallback(async () => {
    setFormat(
      <div
        className="flex items-center justify-center mt-4"
        aria-live="polite"
        aria-busy="true"
      >
        <span
          className="loading loading-dots loading-lg"
          aria-label="Loading results"
        ></span>
      </div>
    );
    const data = pathname.match(/^\/anime(\/.*)?$/)
      ? await animeTypeSearch(mangaTitle)
      : await SearchMangas(provider, mangaTitle);

    const designResults = pathname.match(/^\/anime(\/.*)?$/) ? (
      <div className="flex flex-col mt-2" aria-label="Anime Search Results">
        {data &&
          data.results.length > 0 &&
          data.results.map((item, index) => (
            <Link
              href={`/anime/${item.id}`}
              key={index}
              onClick={() => {
                const modal = document.getElementById(
                  "my_modal_2"
                ) as HTMLDialogElement | null;
                if (modal) {
                  modal.close();
                }
              }}
              aria-label={`Link to ${item.title}`}
              title={`Link to ${item.title}`}
            >
              <div
                className="flex flex-row items-center w-full my-1 bg-slate-700/50 rounded-md"
                aria-label="Anime Item"
              >
                <Image
                  src={
                    provider == "mangapill"
                      ? `https://manga-scrapers.onrender.com/mangapill/images/${item.image}`
                      : item.image
                  }
                  width={200}
                  height={250}
                  alt="Anime Poster Image"
                  className="h-full w-20 rounded-md border-4 border-zinc-600"
                  priority
                  aria-label="Anime Poster Image"
                />
                <div className="flex flex-col ml-1" aria-label="Anime Details">
                  <p className="font-semibold" aria-label="Anime Title">
                    {item.title}
                  </p>
                  <div
                    className="flex flex-row items-center"
                    aria-label="Anime Metadata"
                  >
                    {item.releaseDate && (
                      <div
                        className="badge badge-success gap-2 badge-outline"
                        aria-label="Release Date"
                      >
                        {item.releaseDate}
                      </div>
                    )}
                    {item.subOrDub && (
                      <div
                        className="badge badge-info gap-2 badge-outline ml-1"
                        aria-label="Sub or Dub"
                      >
                        {item.subOrDub}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    ) : (
      <div className="flex flex-col mt-2" aria-label="Manga Search Results">
        {data &&
          data.results.length > 0 &&
          data.results.map((item, index) => (
            <Link
              href={`/read/${provider}/${item.id}`}
              key={index}
              onClick={() => {
                const modal = document.getElementById(
                  "my_modal_2"
                ) as HTMLDialogElement | null;
                if (modal) {
                  modal.close();
                }
              }}
              aria-label={`Link to ${item.title}`}
              title={`Link to ${item.title}`}
            >
              <div
                className="flex flex-row items-center w-full my-1 bg-slate-700/50 rounded-md"
                aria-label="Manga Item"
              >
                <Image
                  src={
                    provider == "mangapill"
                      ? `https://manga-scrapers.onrender.com/mangapill/images/${item.image}`
                      : item.image
                  }
                  width={200}
                  height={250}
                  alt="Manga Poster Image"
                  className="h-full w-20 rounded-md border-4 border-zinc-600"
                  priority
                  aria-label="Manga Poster Image"
                />
                <div className="flex flex-col ml-1" aria-label="Manga Details">
                  <p className="font-semibold" aria-label="Manga Title">
                    {item.title}
                  </p>
                  <div
                    className="flex flex-row items-center"
                    aria-label="Manga Metadata"
                  >
                    {item.status && (
                      <div
                        className="badge badge-success gap-2 badge-outline"
                        aria-label="Status"
                      >
                        {item.status}
                      </div>
                    )}
                    {item.chapters && (
                      <div
                        className="badge badge-info gap-2 badge-outline ml-1"
                        aria-label="Chapters"
                      >
                        {item.chapters} chapters
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    );
    setFormat(designResults);
  }, [mangaTitle, provider]);

  useHotkeys("ctrl+k", (event) => {
    event.preventDefault(); // Prevent the browser's default behavior
    event.stopPropagation(); // Stop the event from propagating
    const modal = document.getElementById(
      "my_modal_2"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  });

  // useHotkeys("ctrl+a", (event) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   router.push("/anime");
  // });

  // useHotkeys("ctrl+m", (event) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   router.push("/");
  // });

  return (
    <main aria-label="Search Component">
      <button
        className="btn btn-ghost btn-circle"
        onClick={() => {
          const modal = document.getElementById(
            "my_modal_2"
          ) as HTMLDialogElement | null;
          if (modal) {
            modal.showModal();
          }
        }}
        aria-label="Open Search Modal"
        title="Open Search Modal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
      <dialog id="my_modal_2" className="modal mt-2" aria-label="Search Modal">
        <div
          className="modal-box w-full max-w-6xl p-4"
          aria-label="Search Modal Box"
        >
          <div
            className="flex flex-row items-center"
            aria-label="Search Input Container"
          >
            <input
              type="search"
              placeholder="Type here"
              value={mangaTitle}
              onChange={(event) => {
                setMangaTitle(event.target.value);
              }}
              onKeyDown={(event: { key: string; code: string | number }) => {
                if (event.key === "Enter" || event.code === "Enter") {
                  setResults();
                }
              }}
              className="input input-bordered input-secondary w-full"
              aria-label="Search Input"
              title="Search Input"
            />
            <select
              className="select select-info select-bordered w-1/2 lg:w-1/3 ml-1"
              onChange={handleChange}
              aria-label="Provider Selector"
              title="Provider Selector"
            >
              {pathname.match(/^\/anime(\/.*)?$/) ? (
                <option value="anime" aria-label="Anime Option">
                  Anime
                </option>
              ) : (
                <>
                  <option value="mangapill" aria-label="Mangapill Option">
                    Mangapill
                  </option>
                  <option value="mangaworld" aria-label="Mangaworld Option">
                    Mangaworld
                  </option>
                  <option value="mangareader" aria-label="Mangareader Option">
                    Mangareader
                  </option>
                  <option value="flamescans" aria-label="Flamescans Option">
                    Flamescans
                  </option>
                  <option value="manganato" aria-label="Manganato Option">
                    Manganato
                  </option>
                </>
              )}
            </select>
          </div>
          {format}
        </div>
        <form
          method="dialog"
          className="modal-backdrop"
          aria-label="Close Modal Form"
        >
          <button aria-label="Close Modal Button" title="Close Modal Button">
            close
          </button>
        </form>
      </dialog>
    </main>
  );
};

export default Search;
