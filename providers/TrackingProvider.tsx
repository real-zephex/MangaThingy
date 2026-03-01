"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

import { useToast } from "@/components/providers/toast-provider";
import { api } from "@/convex/_generated/api";
import { ProgressTracker } from "@/lib/progress/tracker";
import { useQuery } from "convex/react";
import { TrackObject } from "@/convex/types";
import { useAuth } from "@clerk/nextjs";

interface TrackingContextType {
  /** Live reading history from Convex (null for guests, undefined while loading) */
  historyData: TrackObject[] | null | undefined;
}

const TrackingContext = createContext<TrackingContextType | undefined>(
  undefined,
);

export const TrackingProvider = ({ children }: { children: ReactNode }) => {
  const tracker = useMemo(() => new ProgressTracker(), []);
  const { isLoaded, isSignedIn, userId } = useAuth();
  const hasAutoSyncedToLocal = useRef(false);

  const historyData = useQuery(
    api.functions.query.getReadingHistory,
    userId ? { user_id: userId } : "skip",
  );

  // Auto-pull from Convex on mount for signed-in users
  useEffect(() => {
    if (
      !isSignedIn ||
      !isLoaded ||
      hasAutoSyncedToLocal.current ||
      historyData === undefined
    )
      return;

    hasAutoSyncedToLocal.current = true;

    if (historyData && historyData.length > 0) {
      const sanitizedHistory = historyData.map((item) => ({
        id: item.id,
        title: item.title,
        image: item.image,
        status: item.status,
        chapter: item.chapter,
        chapterId: item.chapterId,
        chapterTitle: item.chapterTitle,
        provider: item.provider,
        totalChapter: item.totalChapter,
        rating: item.rating,
        updatedAt: item.updatedAt,
      }));
      tracker.setLocalStorage(sanitizedHistory);
    }
  }, [isSignedIn, isLoaded, historyData, tracker]);

  const providerValue = useMemo(
    () => ({
      historyData: userId ? historyData ?? null : null,
    }),
    [historyData, userId],
  );

  return (
    <TrackingContext.Provider value={providerValue}>
      {children}
    </TrackingContext.Provider>
  );
};

export function useTracking() {
  const context = useContext(TrackingContext);
  if (context === undefined) {
    throw new Error("useTracking must be used within a TrackingProvider");
  }
  return context;
}

/**
 * Hook to manually restore reading history from database
 * Useful if the initial auto-mount sync failed
 */
export function useSyncFromDatabase() {
  const { historyData } = useTracking();
  const tracker = useMemo(() => new ProgressTracker(), []);
  const toast = useToast();
  const { isLoaded, isSignedIn, userId } = useAuth();

  const syncToLocal = useCallback(async () => {
    if (!userId || !isLoaded || !isSignedIn) {
      toast.info("Sign in to restore your reading history from database");
      return;
    }

    if (historyData === undefined) {
      toast.info("Database is still loading. Please wait.");
      return;
    }

    if (!historyData || historyData.length === 0) {
      toast.info("No reading history found in database");
      return;
    }

    const sanitizedHistory = historyData.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.image,
      status: item.status,
      chapter: item.chapter,
      chapterId: item.chapterId,
      chapterTitle: item.chapterTitle,
      provider: item.provider,
      totalChapter: item.totalChapter,
      rating: item.rating,
      updatedAt: item.updatedAt,
    }));
    tracker.setLocalStorage(sanitizedHistory);
    toast.success(
      `Restored ${sanitizedHistory.length} manga from database`,
    );
  }, [userId, isLoaded, isSignedIn, historyData, toast, tracker]);

  return { syncToLocal };
}
