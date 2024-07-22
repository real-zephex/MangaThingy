import Search from "./search";
import Link from "next/link";
import LoginButton from "./login-button";
import ProfileIcon from "./profile-icon";

const Navbar = async () => {
  return (
    <div className="navbar bg-base-300 z-50" aria-label="Main Navigation Bar">
      <div className="navbar-start" aria-label="Navigation Start">
        <div className="dropdown" aria-label="Dropdown Menu">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" aria-label="Menu Button" title="Menu Button">
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
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            aria-label="Dropdown Menu List"
          >
            <LoginButton />
            <li>
              <Link href={"https://paypal.me/realzephex"} target="_blank" aria-label="Support my work" title="Support my work">
                Support my work!
              </Link>
            </li>
          </ul>
        </div>
        <Link href={"/anime"} aria-label="Anime Page" title="Anime Page">
          <button className="btn" aria-label="Anime Button" title="Anime Button">
            Anime
            <div className="hidden lg:flex items-center" aria-hidden="true">
              <kbd className="kbd kbd-sm">ctrl</kbd> +
              <kbd className="kbd kbd-sm">a</kbd>
            </div>
          </button>
        </Link>
      </div>
      <div className="navbar-center" aria-label="Navigation Center">
        <Link href={"/"} className="btn btn-ghost text-xl" aria-label="Home Page" title="Home Page">
          MangaThingy
        </Link>
      </div>
      <div className="navbar-end" aria-label="Navigation End">
        <div className="flex items-center" aria-label="Search and Profile">
          <div className="hidden lg:flex items-center" aria-hidden="true">
            <kbd className="kbd kbd-sm">ctrl</kbd> +
            <kbd className="kbd kbd-sm">k</kbd>
          </div>
          <Search />
          <ProfileIcon />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
