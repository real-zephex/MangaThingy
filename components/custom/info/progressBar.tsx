"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { ProgressTracker } from "@/lib/progress/tracker"
import { Badge } from "@/components/ui/badge"

const ProgressBar = ({ id }: { id: string }) => {
  const tracker = new ProgressTracker();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function calculateProgress() {
      const info = tracker.getOne(id)
      if (info) {
        const { chapter, totalChapter } = info;
        const progress = (Number(chapter) / Number(totalChapter)) * 100;
        setProgress(progress);

        if (progress === 100) {
          tracker.update({ ...info, status: "Completed" })
        }
      }
    }
    calculateProgress();
  }, [id])


  return (
    <div className="flex flex-row items-center gap-2">
      <div className="flex flex-col items-center gap-1">
        <span>Chapter {tracker.getOne(id)?.chapter}</span>
        <Badge variant="outline">
          <span className="text-xs">{progress.toFixed(2)}% complete</span>
        </Badge>
      </div>
      <Progress
        value={progress}
        className="w-[60%]"
      />
    </div>
  )
}

export default ProgressBar;