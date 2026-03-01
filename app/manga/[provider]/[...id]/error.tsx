"use client";

import { Button } from "@/components/ui/button";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
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
    <div className="w-dvw h-dvh flex flex-col items-center justify-center gap-4" role="alert">
      <div className="flex flex-row items-center gap-2">
        <AlertCircleIcon aria-hidden="true" />
        <h1 className="text-2xl font-bold">Something went wrong!</h1>
      </div>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
