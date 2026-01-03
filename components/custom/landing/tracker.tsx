"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/providers/toast-provider";
import { useState, useEffect } from "react";
import { Manga } from "@/lib/services/manga.types";
import { ProgressTracker } from "@/lib/progress/tracker";
import { Trash } from "lucide-react";

export function TrackManga({ data }: { data: Manga & { source?: string } }) {
  const toast = useToast();
  const [status, setStatus] = useState<string>("");
  const tracker = new ProgressTracker();

  function existenceCheck() {
    return tracker.getOne(data.id);
  }

  useEffect(() => {
    function fetchStatus() {
      const result = existenceCheck();
      if (result) {
        const status = result.status;
        setStatus(status);
      }
    }
    fetchStatus();
  }, []);

  function handleChange(e: string) {
    const contents = {
      id: data.id,
      title: data.title,
      image: data.image || data.images,
      status: e,
      provider: data.source,
    };
    if (!existenceCheck()) {
      tracker.addSingle(contents);
    } else {
      tracker.update(contents);
    }

    setStatus(e);
    toast.info(`Manga ${data.title} has been marked as ${e}`);
  }

  function deleteItem() {
    tracker.remove(data.id);
    setStatus("");
    toast.success(`Manga ${data.title} has been untracked`);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          +
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Track Manga</h4>
            <p className="text-muted-foreground text-sm">
              Track or update the status
            </p>
          </div>
          <div className="grid gap-2">
            <RadioGroup onValueChange={handleChange} value={status}>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="Planning" id="r1" />
                <Label htmlFor="r1">Planning</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="Reading" id="r2" />
                <Label htmlFor="r2">Reading</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="Completed" id="r3" />
                <Label htmlFor="r3">Completed</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="Halted" id="r4" />
                <Label htmlFor="r4">Halted</Label>
              </div>
            </RadioGroup>
            <Button
              className="flex flex-row items-center mt-2 text-sm gap-3 active:scale-95 transition-all"
              size="sm"
              variant="outline"
              onClick={deleteItem}
              disabled={!existenceCheck()}
            >
              <Trash size={14} color="red" />
              Untrack this item
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
