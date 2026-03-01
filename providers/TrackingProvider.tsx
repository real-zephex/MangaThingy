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
import { TrackingSyncState } from "@/components/custom/info/sync-status-pill";
import { api } from "@/convex/_generated/api";
import { TrackObject } from "@/convex/types";
import { ProgressTracker } from "@/lib/progress/tracker";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";

interface TrackingContextType {
  /** Live reading history from Convex (null for guests, undefined while loading) */
  historyData: TrackObject[] | null | undefined;
  syncState: TrackingSyncState;
  lastSyncedAt: number | null;
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

  const syncState = useMemo<TrackingSyncState>(() => {
    if (!isLoaded) {
      return "loading";
    }

    if (!isSignedIn) {
      return "idle";
    }

    if (historyData === undefined) {
      return "loading";
    }

    return "synced";
  }, [historyData, isLoaded, isSignedIn]);

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

    try {
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
    } catch (error) {
      console.error("[TrackingProvider Sync] Error:", error);
    }
  }, [isSignedIn, isLoaded, historyData, tracker]);

  const providerValue = useMemo(
    () => ({
      historyData: userId ? historyData ?? null : null,
      syncState,
      lastSyncedAt: null,
    }),
    [historyData, syncState, userId],
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

    try {
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
      toast.success(`Restored ${sanitizedHistory.length} manga from database`);
    } catch (error) {
      console.error("[TrackingProvider Restore] Error:", error);
      toast.error("Failed to restore reading history from database");
    }
  }, [userId, isLoaded, isSignedIn, historyData, toast, tracker]);

  return { syncToLocal };
}
