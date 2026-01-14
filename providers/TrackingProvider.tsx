"use client";

import { createContext, ReactNode, useContext } from "react";

import { useToast } from "@/components/providers/toast-provider";
import { api } from "@/convex/_generated/api";
import { ProgressTracker } from "@/lib/progress/tracker";
import { useMutation } from "convex/react";
import { TrackObject } from "@/convex/types";

interface TrackingContextType {
  provider: {
    syncAll: ({ userId }: { userId: string }) => void;
  };
}

const TrackingContext = createContext<TrackingContextType | undefined>(
  undefined,
);

export const TrackingProvider = ({ children }: { children: ReactNode }) => {
  const tracker = new ProgressTracker();
  const mutate = useMutation(api.functions.mutations.syncReadingHistory);
  const toast = useToast();

  const syncAll = async ({ userId }: { userId: string }) => {
    const getTimeFromLocalStorage =
      localStorage.getItem("trackingLastSyncTime") || "0";
    const lastSyncTime = parseInt(getTimeFromLocalStorage, 10);
    const currentTime = Date.now();

    if (currentTime - lastSyncTime < 1 * 60 * 1000) {
      toast.info("Sync was performed less than 5 minutes ago.");
      return;
    }

    localStorage.setItem("trackingLastSyncTime", currentTime.toString());
    const items: TrackObject[] = tracker
      .getAll()
      .map((i) => ({ ...i, user_id: userId }));
    try {
      await mutate({ entries: items });
      toast.success("Synced " + items.length + " items to convex storage");
    } catch (error) {
      toast.error("Error syncing reading history: " + (error as Error).message);
    }
  };
  return (
    <TrackingContext.Provider value={{ provider: { syncAll } }}>
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
