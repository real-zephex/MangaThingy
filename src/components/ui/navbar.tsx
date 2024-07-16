import Search from "./search";
import Link from "next/link";

const Navbar = async () => {
  return (
    <div className="navbar bg-base-300 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
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
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href={"/"}>Homepage</Link>
            </li>
            <li>
              <Link href={"https://paypal.me/realzephex"} target="_blank">
                Support my work!
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link href={"/"} className="btn btn-ghost text-xl">
          MangaThingy
        </Link>
      </div>
      <div className="navbar-end">
        <div className="hidden lg:flex">
          <kbd className="kbd kbd-sm">ctrl</kbd> +
          <kbd className="kbd kbd-sm">k</kbd>
        </div>
        <Search />
      </div>
    </div>
  );
};

export default Navbar;
