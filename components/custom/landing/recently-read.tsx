"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useTracking } from "@/providers/TrackingProvider";
import { ProgressTracker } from "@/lib/progress/tracker";
import { ImageProxy } from "@/lib/services/image.proxy";
import Image from "next/image";
import Link from "next/link";
import { History } from "lucide-react";
import { useMemo, useLayoutEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const RecentlyRead = () => {
  const { historyData } = useTracking();
  const { isSignedIn } = useAuth();
  const tracker = useMemo(() => new ProgressTracker(), []);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  const items = useMemo(() => {
    if (!mounted) return [];
    if (isSignedIn && historyData && historyData.length > 0) {
      return historyData.slice(0, 12);
    }
    return tracker.getAll().slice(0, 12);
  }, [mounted, isSignedIn, historyData, tracker]);

  if (!mounted || items.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-brand-start">
        <History size={18} aria-hidden="true" />
        <span className="text-xs font-bold uppercase tracking-wider">
          Continue Reading
        </span>
      </div>
      <TooltipProvider delayDuration={300}>
        <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide -mx-1 px-1">
          {items.map((item) => (
            <Tooltip key={`recent-${item.id}`}>
              <TooltipTrigger asChild>
                <Link
                  href={`/manga/${item.provider}/${item.id}`}
                  className="shrink-0 group"
                >
                  <div className="relative w-20 h-28 rounded-lg overflow-hidden border-2 border-border/30 shadow-sm group-hover:border-brand-start/50 group-hover:shadow-md transition-all duration-200">
                    <Image
                      src={ImageProxy(item.image)}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-48">
                <p className="text-xs font-semibold line-clamp-2">
                  {item.title}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </section>
  );
};
