import Link from "next/link";
import { DonateLink } from "./donation/donate-link";
import { BookOpen, GitBranchPlus } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-border/50">
      {/* Gradient accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-start/40 to-transparent" />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Logo + tagline */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="p-1.5 bg-brand-start rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold tracking-tight">
                Otaku <span className="text-brand-start">Oasis</span>
              </h2>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Your destination for reading and tracking your favorite manga
              series. Free, fast, and always up to date.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Navigation
            </h3>
            <nav
              className="flex flex-col gap-2.5 text-sm"
              aria-label="Footer navigation"
            >
              <Link
                href="/"
                className="text-foreground/80 hover:text-brand-start transition-colors w-fit"
              >
                Home
              </Link>
              <Link
                href="/browse"
                className="text-foreground/80 hover:text-brand-start transition-colors w-fit"
              >
                Browse
              </Link>
              <Link
                href="/library"
                className="text-foreground/80 hover:text-brand-start transition-colors w-fit"
              >
                Library
              </Link>
            </nav>
          </div>

          {/* Column 3: External + Donate */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Community
            </h3>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link
                href="https://github.com/real-zephex/MangaThingy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground/80 hover:text-brand-start transition-colors w-fit"
              >
                <GitBranchPlus className="w-4 h-4" />
                GitHub
              </Link>
              <DonateLink />
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Otaku Oasis. Built with care for
            manga lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
