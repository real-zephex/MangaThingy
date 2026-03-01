"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SynopsisExpanderProps {
  description?: string;
}

export const SynopsisExpander = ({ description }: SynopsisExpanderProps) => {
  const [expanded, setExpanded] = useState(false);
  const text = description || "No description available for this title.";

  return (
    <div className="max-w-2xl">
      <p
        className={cn(
          "text-sm text-muted-foreground leading-relaxed transition-all duration-300",
          !expanded && "line-clamp-4",
        )}
      >
        {text}
      </p>
      {description && description.length > 200 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="text-xs font-semibold text-brand-start hover:underline mt-1.5 focus-visible:outline-2 focus-visible:outline-brand-start"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};
