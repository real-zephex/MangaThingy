"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const CurrentPage = () => {
  const pathname = usePathname();

  return (
    <div>
      {pathname == "/" && (
        <div>
          <Link href={"/anime"} aria-label="Anime Page" title="Anime Page">
            <button
              className="btn"
              aria-label="Anime Button"
              title="Anime Button"
            >
              Anime
              <div className="hidden lg:flex items-center" aria-hidden="true">
                <kbd className="kbd kbd-sm">ctrl</kbd> +
                <kbd className="kbd kbd-sm">a</kbd>
              </div>
            </button>
          </Link>
        </div>
      )}
      {pathname == "/anime" && (
        <Link href={"/"} aria-label="Manga Page" title="Manga Page">
          <button
            className="btn"
            aria-label="Manga Button"
            title="Manga Button"
          >
            Manga
            <div className="hidden lg:flex items-center" aria-hidden="true">
              <kbd className="kbd kbd-sm">ctrl</kbd> +
              <kbd className="kbd kbd-sm">m</kbd>
            </div>
          </button>
        </Link>
      )}
    </div>
  );
};

export default CurrentPage;
