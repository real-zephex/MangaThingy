"use client"

interface MangaStatusDropdownProps {
  manga: MangaInfo;
  provider: string;
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgressTracker } from "@/lib/progress/tracker";
import { MangaInfo } from "@/lib/services/manga.types";
import { useToast } from "@/components/providers/toast-provider";
import { useState, useEffect } from "react";
import { Trash2, Bookmark, PlayCircle, CheckCircle2, PauseCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MangaStatusDropdownProps {
  manga: MangaInfo;
  provider: string;
}

const statusConfig = {
  Planning: { icon: Bookmark, color: "text-blue-500", bg: "bg-blue-500/10" },
  Reading: { icon: PlayCircle, color: "text-green-500", bg: "bg-green-500/10" },
  Completed: { icon: CheckCircle2, color: "text-purple-500", bg: "bg-purple-500/10" },
  Halted: { icon: PauseCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
};

export function MangaStatusDropdown({ manga, provider }: MangaStatusDropdownProps) {
  const toast = useToast();
  const [status, setStatus] = useState<string>("");
  const tracker = new ProgressTracker();

  useEffect(() => {
    const result = tracker.getOne(manga.id);
    if (result) {
      setStatus(result.status);
    }
  }, [manga.id]);

  const handleStatusChange = (value: string) => {
    if (value === "untrack") {
      tracker.remove(manga.id);
      setStatus("");
      toast.success(`Manga ${manga.title} has been untracked`);
      return;
    }

    const currentProgress = tracker.getOne(manga.id);
    const contents = {
      id: manga.id,
      title: manga.title || "N.A.",
      image: manga.image || manga.images,
      status: value,
      provider: provider,
      chapter: currentProgress?.chapter || "0",
      totalChapter: manga.chapters.length.toString(),
    };

    if (!currentProgress) {
      tracker.addSingle(contents);
    } else {
      tracker.update(contents);
    }

    setStatus(value);
    toast.info(`Manga ${manga.title} marked as ${value}`);
  };

  const CurrentIcon = status ? (statusConfig[status as keyof typeof statusConfig]?.icon || Plus) : Plus;

  return (
    <Select value={status} onValueChange={handleStatusChange}>
      <SelectTrigger 
        className={cn(
          "w-full sm:w-56 h-12 rounded-xl border-2 font-bold text-base transition-all duration-300",
          status 
            ? "bg-primary text-primary-foreground border-primary hover:opacity-90" 
            : "bg-background border-border hover:border-primary/50"
        )}
      >
        <div className="flex items-center gap-2">
          <CurrentIcon size={18} className={status ? "text-primary-foreground" : "text-primary"} />
          <SelectValue placeholder="Add to Library" />
        </div>
      </SelectTrigger>
      <SelectContent className="rounded-xl border-2 p-1">
        {Object.entries(statusConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <SelectItem 
              key={key} 
              value={key}
              className="rounded-lg focus:bg-accent cursor-pointer py-2.5"
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-1.5 rounded-md", config.bg)}>
                  <Icon size={16} className={config.color} />
                </div>
                <span className="font-medium">{key}</span>
              </div>
            </SelectItem>
          );
        })}
        {status && (
          <>
            <div className="h-px bg-border my-1 mx-1" />
            <SelectItem 
              value="untrack" 
              className="rounded-lg focus:bg-destructive/10 focus:text-destructive cursor-pointer py-2.5 text-destructive"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-destructive/10">
                  <Trash2 size={16} />
                </div>
                <span className="font-medium">Remove from Library</span>
              </div>
            </SelectItem>
          </>
        )}
      </SelectContent>
    </Select>
  );
}
