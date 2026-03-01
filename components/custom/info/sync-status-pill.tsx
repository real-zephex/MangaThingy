import { cn } from "@/lib/utils";

export type TrackingSyncState = "idle" | "loading" | "synced" | "error";

interface SyncStatusPillProps {
  syncState: TrackingSyncState;
  className?: string;
}

const syncPillMap: Record<
  TrackingSyncState,
  { label: string; className: string; dotClassName: string }
> = {
  idle: {
    label: "Local only",
    className: "border-border/60 bg-muted/50 text-muted-foreground",
    dotClassName: "bg-muted-foreground/60",
  },
  loading: {
    label: "Syncing",
    className: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    dotClassName: "bg-blue-400",
  },
  synced: {
    label: "Synced",
    className: "border-green-500/30 bg-green-500/10 text-green-300",
    dotClassName: "bg-green-400",
  },
  error: {
    label: "Sync issue",
    className: "border-destructive/40 bg-destructive/10 text-destructive",
    dotClassName: "bg-destructive",
  },
};

export const SyncStatusPill = ({
  syncState,
  className,
}: SyncStatusPillProps) => {
  const config = syncPillMap[syncState];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        config.className,
        className,
      )}
      aria-label={`Tracking sync status: ${config.label}`}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", config.dotClassName)}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
};
