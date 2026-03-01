"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { ProgressTracker, Progress as ProgressType } from "@/lib/progress/tracker";
import { BookOpen, CheckCircle2 } from "lucide-react";

const ProgressBar = ({ id }: { id: string }) => {
  const tracker = new ProgressTracker();
  const [progress, setProgress] = useState(0);
  const [info, setInfo] = useState<ProgressType | null>(null);

  useEffect(() => {
    function calculateProgress() {
      const data = tracker.getOne(id);
      if (data) {
        setInfo(data);
        const { chapter, totalChapter } = data;
        const chapterNum = Number(chapter);
        const totalNum = Number(totalChapter);

        if (totalNum > 0) {
          const currentProgress = (chapterNum / totalNum) * 100;
          setProgress(currentProgress);

          if (currentProgress >= 100 && data.status !== "Completed") {
            tracker.update({ ...data, status: "Completed" });
          }
        }
      }
    }
    calculateProgress();

    const handleStorage = () => calculateProgress();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [id]);

  if (!info) return null;

  const isCompleted = progress >= 100;
  const chapterDisplay = info.chapterTitle || `Chapter ${info.chapter}`;

  return (
    <div className="max-w-md rounded-lg border border-border/40 bg-muted/30 p-3 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-md ${isCompleted ? "bg-green-500/10 text-green-500" : "bg-brand-start/10 text-brand-start"}`}
          >
            {isCompleted ? (
              <CheckCircle2 size={16} />
            ) : (
              <BookOpen size={16} />
            )}
          </div>
          <div>
            <p className="text-xs font-semibold leading-none">
              {isCompleted ? "Completed" : "Reading Progress"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {chapterDisplay} of {info.totalChapter}
            </p>
          </div>
        </div>
        <span className="text-xs font-bold tabular-nums text-muted-foreground">
          {progress.toFixed(0)}%
        </span>
      </div>

      <Progress
        value={progress}
        className="h-1.5 bg-muted"
        aria-label={`Reading progress: ${progress.toFixed(0)}%`}
      />
    </div>
  );
};

export default ProgressBar;
