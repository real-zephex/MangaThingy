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
import { useMutation, useQuery } from "convex/react";
import { TrackObject } from "@/convex/types";
import { useAuth } from "@clerk/nextjs";

interface TrackingContextType {
  provider: {
    syncAll: () => void;
    syncToLocal: () => void;
  };
  /** Live reading history from Convex (null for guests, undefined while loading) */
  historyData: TrackObject[] | null | undefined;
}

const TrackingContext = createContext<TrackingContextType | undefined>(
  undefined,
);

export const TrackingProvider = ({ children }: { children: ReactNode }) => {
  const tracker = useMemo(() => new ProgressTracker(), []);
  const mutate = useMutation(api.functions.mutations.syncReadingHistory);
  const toast = useToast();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const hasAutoSyncedToLocal = useRef(false);

  const historyData = useQuery(
    api.functions.query.getReadingHistory,
    userId ? { user_id: userId } : "skip",
  );

  const syncAll = useCallback(
    async (isAutoSync = false) => {
      if (!userId || !isLoaded || !isSignedIn) {
        if (!isAutoSync) toast.info("Sync not available for guest users.");
        return;
      }

      const getTimeFromLocalStorage =
        localStorage.getItem("trackingLastSyncTime") || "0";
      const lastSyncTime = parseInt(getTimeFromLocalStorage, 10);
      const currentTime = Date.now();

      if (currentTime - lastSyncTime < 2 * 60 * 1000) {
        if (!isAutoSync)
          toast.info("Sync was performed less than 2 minutes ago.");
        return;
      }
      if (!isAutoSync) toast.info("Syncing...");
      localStorage.setItem("trackingLastSyncTime", currentTime.toString());
      const items: TrackObject[] = tracker.getAll().map((i) => ({
        user_id: userId,
        id: i.id,
        title: i.title,
        image: i.image,
        status: i.status,
        chapter: i.chapter,
        chapterId: i.chapterId,
        chapterTitle: i.chapterTitle,
        provider: i.provider || "unknown",
        totalChapter: i.totalChapter,
        rating: i.rating,
        updatedAt: i.updatedAt ?? Date.now(),
      }));
      try {
        await mutate({ entries: items });
        if (!isAutoSync)
          toast.success("Synced " + items.length + " items to convex storage");
      } catch (error) {
        console.error(error);
        toast.error(
          "Error syncing reading history: " + (error as Error).message,
        );
      }
    },
    [userId, isLoaded, isSignedIn, mutate, tracker, toast],
  );

  const syncToLocal = useCallback(
    async (silent = false) => {
      if (!userId || !isLoaded || !isSignedIn) {
        if (!silent) toast.info("Sync not available for guest users.");
        return;
      }

      if (historyData === undefined) {
        if (!silent) toast.info("Database is still loading. Please wait.");
        return;
      }

      if (!historyData || historyData.length === 0) {
        if (!silent) toast.info("No data available to sync.");
        return;
      }

      if (!silent) toast.info("Syncing...");
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
      if (!silent) toast.success("Sync to local successful.");
    },
    [userId, isLoaded, isSignedIn, historyData, tracker, toast],
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

  // Background auto-sync every 2.1 minutes
  useEffect(() => {
    if (!isSignedIn || !isLoaded) return;

    const id = setInterval(() => {
      syncAll(true);
    }, 2.1 * 60 * 1000);

    return () => clearInterval(id);
  }, [isSignedIn, isLoaded, syncAll]);

  const providerValue = useMemo(
    () => ({
      provider: { syncAll, syncToLocal },
      historyData: userId ? historyData ?? null : null,
    }),
    [syncAll, syncToLocal, historyData, userId],
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
