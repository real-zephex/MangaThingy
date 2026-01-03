

"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { ProgressTracker } from "@/lib/progress/tracker"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle2 } from "lucide-react"

const ProgressBar = ({ id }: { id: string }) => {
  const tracker = new ProgressTracker();
  const [progress, setProgress] = useState(0);
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    function calculateProgress() {
      const data = tracker.getOne(id)
      if (data) {
        setInfo(data);
        const { chapter, totalChapter } = data;
        const currentProgress = (Number(chapter) / Number(totalChapter)) * 100;
        setProgress(currentProgress);

        if (currentProgress === 100 && data.status !== "Completed") {
          tracker.update({ ...data, status: "Completed" })
        }
      }
    }
    calculateProgress();
    
    // Listen for storage changes to update progress in real-time
    const handleStorage = () => calculateProgress();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [id])

  if (!info) return null;

  const isCompleted = progress >= 100;

  return (
    <div className="w-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
            {isCompleted ? <CheckCircle2 size={18} /> : <BookOpen size={18} />}
          </div>
          <div>
            <p className="text-sm font-bold leading-none">
              {isCompleted ? 'Completed' : 'Reading Progress'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Chapter {info.chapter} of {info.totalChapter}
            </p>
          </div>
        </div>
        <Badge 
          variant={isCompleted ? "default" : "secondary"}
          className={`rounded-lg font-bold ${isCompleted ? 'bg-green-500 hover:bg-green-600' : ''}`}
        >
          {progress.toFixed(0)}%
        </Badge>
      </div>
      
      <div className="relative pt-1">
        <Progress
          value={progress}
          className="h-2.5 bg-muted"
        />
      </div>
    </div>
  )
}

export default ProgressBar;
