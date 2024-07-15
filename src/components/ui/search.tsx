"use client";
import { SetStateAction, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import Image from "next/image";
import Link from "next/link";

import { SearchMangas } from "../data/requests";

const Search = () => {
  const [mangaTitle, setMangaTitle] = useState<string>("");
  const [provider, setProvider] = useState<string>("mangapill");
  const [format, setFormat] = useState<JSX.Element>(<></>);

  const handleChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setProvider(event.target.value);
    console.log(`Selected: ${event.target.value}`);
  };

  const setResults = async () => {
    setFormat(
      <div className="flex items-center justify-center mt-4">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
    const data = await SearchMangas(provider, mangaTitle);
    const designResults = (
      <div className="flex flex-col mt-2">
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
            >
              <div className="flex flex-row items-center w-full my-1 bg-slate-700/50">
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
                />
                <div className="flex flex-col ml-1">
                  <p className="font-semibold">{item.title}</p>
                  <div className="flex flex-row items-center">
                    {item.status && (
                      <div className="badge badge-success gap-2 badge-outline">
                        {item.status}
                      </div>
                    )}
                    {item.chapters && (
                      <div className="badge badge-info gap-2 badge-outline ml-1">
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
  };

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

  return (
    <main>
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
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
      <dialog id="my_modal_2" className="modal items-start mt-2">
        <div className="modal-box w-full max-w-5xl">
          <div className="flex flex-row items-center">
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
            />
            <select
              className="select select-info select-bordered w-1/2 lg:w-1/3 ml-1"
              onChange={handleChange}
            >
              <option value="mangapill">Mangapill</option>
              <option value="mangaworld">Mangaworld</option>
              <option value="mangareader">Mangareader</option>
            </select>
          </div>
          {format}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </main>
  );
};

export default Search;
