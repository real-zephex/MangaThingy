"use client";

import { createContext, ReactNode, useContext, useEffect } from "react";

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
}

const TrackingContext = createContext<TrackingContextType | undefined>(
  undefined,
);

export const TrackingProvider = ({ children }: { children: ReactNode }) => {
  const tracker = new ProgressTracker();
  const mutate = useMutation(api.functions.mutations.syncReadingHistory);
  const toast = useToast();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const historyData = useQuery(
    api.functions.query.getReadingHistory,
    userId ? { user_id: userId } : "skip",
  );

  const syncAll = async () => {
    if (!userId || !isLoaded || !isSignedIn) {
      toast.info("Sync not available for guest users.");
      return;
    }

    const getTimeFromLocalStorage =
      localStorage.getItem("trackingLastSyncTime") || "0";
    const lastSyncTime = parseInt(getTimeFromLocalStorage, 10);
    const currentTime = Date.now();

    if (currentTime - lastSyncTime < 2 * 60 * 1000) {
      toast.info("Sync was performed less than 2 minutes ago.");
      return;
    }
    toast.info("Syncing...");
    localStorage.setItem("trackingLastSyncTime", currentTime.toString());
    const items: TrackObject[] = tracker.getAll().map((i) => ({
      user_id: userId,
      id: i.id,
      title: i.title,
      image: i.image,
      status: i.status,
      chapter: i.chapter,
      provider: i.provider,
      totalChapter: i.totalChapter,
    }));
    try {
      await mutate({ entries: items });
      toast.success("Synced " + items.length + " items to convex storage");
    } catch (error) {
      console.error(error);
      toast.error("Error syncing reading history: " + (error as Error).message);
    }
  };

  const syncToLocal = async () => {
    if (!userId || !isLoaded || !isSignedIn) {
      toast.info("Sync not available for guest users.");
      return;
    }

    if (historyData === undefined) {
      toast.info("Database is still loading. Please wait.");
      return;
    }

    if (!historyData || historyData.length === 0) {
      toast.info("No data available to sync.");
      return;
    }

    toast.info("Syncing...");
    const sanitizedHistory = historyData.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.image,
      status: item.status,
      chapter: item.chapter,
      provider: item.provider,
      totalChapter: item.totalChapter,
    }));
    tracker.setLocalStorage(sanitizedHistory);
    toast.success("Sync to local successful.");
  };


  useEffect(() => {
    const id = setInterval(() => {
      syncAll();
    }, 2.1 * 60 * 1000);

    return () => clearInterval(id);
  }, [])
  return (
    <TrackingContext.Provider value={{ provider: { syncAll, syncToLocal } }}>
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
