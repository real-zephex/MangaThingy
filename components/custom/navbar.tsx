"use client";

import Link from "next/link";
import { GithubIcon } from "lucide-react";
import { ModeToggle } from "../toggle";
import { usePathname } from "next/navigation";
import { Input } from "../ui/input";

const Navbar = () => {

  const pathname = usePathname();
  const currentPage = pathname.split("/")[1];
  return (
    <main className="p-4 bg-background flex flex-row items-center justify-between">
      {/* Branding  + Links*/}
      <div className="flex flex-row items-center gap-2">
        <GithubIcon />
        <h2 className="text-xl font-semibold">
          MangaThingy v2
        </h2>
        <div className={`ml-2 **:ml-2  **:p-2 **:rounded-md `}>
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
      <div className="flex flex-row gap-2">
        <Input placeholder="Search mangas..." />

        <ModeToggle />
      </div>
    </main>
  )
}

export default Navbar;