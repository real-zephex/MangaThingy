"use client";

import { Button } from "@/components/ui/button";
import { AlertCircleIcon } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-dvw h-dvh flex flex-col items-center gap-2">
      <div className="flex flex-row items-center gap-2">
        <AlertCircleIcon />
        <h2>Something went wrong!</h2>
      </div>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
