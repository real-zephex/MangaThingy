"use client";

import Link from "next/link";
import { ModeToggle } from "../toggle";
import { usePathname } from "next/navigation";
import { Input } from "../ui/input";
import SearchManga from "./search";

const Navbar = () => {

  const pathname = usePathname();
  return (
    <main className="p-4 bg-background flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <h2 className="md:text-lg lg:text-xl font-semibold">
          MangaThingy
        </h2>
        <div className={`ml-2 **:ml-2  **:p-2 **:rounded-md hidden lg:flex`}>
          <Link href={"/popular"}>
            Popular
          </Link>
          <Link href={"/latest"}>
            Latest
          </Link>
          <Link href={"/about"}>
            About
          </Link>

        </div>
      </div>
      <div>
      </div>
      <div className="flex items-center flex-row gap-2">
        <SearchManga />

        <ModeToggle />
      </div>
    </main>
  )
}

export default Navbar;