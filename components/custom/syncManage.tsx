"use client";

import { useTracking } from "@/providers/TrackingProvider";
import { useEffect } from "react";
import { useToast } from "../providers/toast-provider";

export const ManageSync = ({ userId }: { userId?: string | null }) => {
  const useTracker = useTracking();
  const toast = useToast();

  useEffect(() => {
    // Logic to manage syncing
    function test() {
      if (userId) {
        useTracker.provider.syncAll({ userId });
      } else {
        toast.info("Syncing not available for guest user");
      }
    }

    test();
  }, [userId]);

  return <></>;
};
