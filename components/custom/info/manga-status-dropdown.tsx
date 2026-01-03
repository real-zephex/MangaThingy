"use client";

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
import { Trash2 } from "lucide-react";

interface MangaStatusDropdownProps {
  manga: MangaInfo;
  provider: string;
}

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
      chapter: currentProgress?.chapter,
      totalChapter: manga.chapters.length.toString(),
    };

    if (!currentProgress) {
      tracker.addSingle(contents);
    } else {
      tracker.update(contents);
    }

    setStatus(value);
    toast.info(`Manga ${manga.title} has been marked as ${value}`);
  };

  return (
    <Select value={status} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-full sm:w-48 bg-red-600 hover:bg-red-700 border-none text-white h-12 font-semibold text-lg">
        <SelectValue placeholder="Track Manga" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Planning">Planning</SelectItem>
        <SelectItem value="Reading">Reading</SelectItem>
        <SelectItem value="Completed">Completed</SelectItem>
        <SelectItem value="Halted">Halted</SelectItem>
        {status && (
          <>
            <div className="h-px bg-border my-1" />
            <SelectItem value="untrack" className="text-red-500 focus:text-red-500">
              <div className="flex items-center gap-2">
                <Trash2 size={14} />
                Untrack
              </div>
            </SelectItem>
          </>
        )}
      </SelectContent>
    </Select>
  );
}
