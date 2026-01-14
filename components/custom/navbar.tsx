"use client";

import Link from "next/link";
import { ModeToggle } from "../toggle";
import SearchManga from "./search";
import {
  BookOpen,
  Home,
  Compass,
  Library,
  Menu,
  GitBranchPlus,
  InfoIcon,
  UploadIcon,
  ImportIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import { ButtonGroup } from "../ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useTracking } from "@/providers/TrackingProvider";

const Navbar = () => {
  const pathname = usePathname();
  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Browse", href: "/browse", icon: Compass },
    { name: "Library", href: "/library", icon: Library },
  ];
  const syncTracking = useTracking();

  const importData = () => {
    syncTracking.provider.syncToLocal();
  };

  const exportData = () => {
    syncTracking.provider.syncAll();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-linear-to-br from-orange-500 to-pink-500 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-orange-500/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight hidden sm:block">
              Otaku{" "}
              <span className="bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Oasis
              </span>
            </h2>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SearchManga />

          <div className="flex items-center gap-2 border-l pl-2 ml-1">
            <Link
              href="https://github.com/real-zephex/MangaThingy"
              target="_blank"
              className="p-2 text-muted-foreground hover:text-primary transition-colors hidden sm:flex"
            >
              <GitBranchPlus className="w-5 h-5" />
            </Link>
            <ModeToggle />
            <div className="flex flex-row items-center gap-2">
              <SignedOut>
                <ButtonGroup>
                  <SignInButton>
                    <Button variant="secondary" size="sm">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button variant="outline" size="sm">
                      Sign Up
                    </Button>
                  </SignUpButton>
                </ButtonGroup>
              </SignedOut>
              <SignedIn>
                <UserButton />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Sync Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex flex-row items-center gap-2"
                      onClick={(e) => {
                        e.preventDefault();
                        importData();
                      }}
                    >
                      <ImportIcon />
                      <p> Import from database</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex flex-row items-center gap-2"
                      onClick={(e) => {
                        e.preventDefault();
                        exportData();
                      }}
                    >
                      <UploadIcon />
                      <p>Export to database</p>
                    </DropdownMenuItem>
                    <div className="flex flex-row items-center px-2 py-1 gap-2 w-50">
                      <InfoIcon className="h-3 w-3" />
                      <p className="text-xs font-mono">2 minutes interval.</p>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SignedIn>
            </div>

            <div className="md:hidden ml-1">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-75 sm:w-100">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-left">
                      <div className="p-1.5 bg-linear-to-br from-orange-500 to-pink-500 rounded-lg">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      Otaku Oasis
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-2 mt-8">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "text-muted-foreground hover:bg-muted",
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          {link.name}
                        </Link>
                      );
                    })}
                    <div className="h-px bg-border my-2" />
                    <Link
                      href="https://github.com/real-zephex/MangaThingy"
                      target="_blank"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:bg-muted"
                    >
                      <GitBranchPlus className="w-5 h-5" />
                      GitHub Repository
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
