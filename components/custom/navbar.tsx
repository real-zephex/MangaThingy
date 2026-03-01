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
  RotateCcw,
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
import { useSyncFromDatabase } from "@/providers/TrackingProvider";
import { useCallback } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Browse", href: "/browse", icon: Compass },
    { name: "Library", href: "/library", icon: Library },
  ];
  const { syncToLocal } = useSyncFromDatabase();

  const handleRestoreHistory = useCallback(() => {
    syncToLocal();
  }, [syncToLocal]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 md:h-18 flex items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 bg-brand-start rounded-lg group-hover:scale-105 transition-transform duration-200 shadow-sm shadow-brand-shadow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold tracking-tight hidden sm:block">
              Otaku <span className="text-brand-start">Oasis</span>
            </h2>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "text-brand-start"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-start rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Search + Theme + Auth */}
        <div className="flex items-center gap-3">
          <SearchManga />
          <ModeToggle />

          <div className="h-5 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-2">
            <SignedOut>
              <ButtonGroup>
                <SignInButton>
                  <Button variant="secondary" size="sm" className="font-medium">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button
                    size="sm"
                    className="bg-brand-start hover:bg-brand-start/90 text-white font-medium"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </ButtonGroup>
            </SignedOut>
            <SignedIn>
              <UserButton />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
                aria-label="Restore reading history from database"
                onClick={handleRestoreHistory}
                title="Restore reading history from database (if local storage was cleared)"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </SignedIn>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-left">
                    <div className="p-1.5 bg-brand-start rounded-lg">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold">
                      Otaku <span className="text-brand-start">Oasis</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 mt-8">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.href);
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                          isActive
                            ? "bg-brand-start/10 text-brand-start border-l-2 border-brand-start"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        {link.name}
                      </Link>
                    );
                  })}
                  <div className="h-px bg-border my-3" />
                  <Link
                    href="https://github.com/real-zephex/MangaThingy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <GitBranchPlus className="w-5 h-5" />
                    GitHub
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
