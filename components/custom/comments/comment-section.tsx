"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CommentForm } from "./comment-form";
import { CommentCard } from "./comment-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, ArrowDown } from "lucide-react";
import { CommentSortOption, MangaComment } from "@/lib/types/comments";

interface CommentSectionProps {
  mangaId: string;
  provider: string;
}

type EnrichedComment = MangaComment & { user_liked: boolean };

// State and actions for pagination reducer
interface PaginationState {
  sort: CommentSortOption;
  cursor: number | undefined;
  previousPages: EnrichedComment[];
  lastProcessedCursor: number | undefined;
}

type PaginationAction =
  | { type: "CHANGE_SORT"; sort: CommentSortOption }
  | { type: "LOAD_MORE"; nextCursor: number; currentPageComments: EnrichedComment[] };

function paginationReducer(
  state: PaginationState,
  action: PaginationAction,
): PaginationState {
  switch (action.type) {
    case "CHANGE_SORT":
      return {
        sort: action.sort,
        cursor: undefined,
        previousPages: [],
        lastProcessedCursor: undefined,
      };
    case "LOAD_MORE":
      // Merge current page into previousPages before advancing cursor
      return {
        ...state,
        cursor: action.nextCursor,
        previousPages: deduplicateComments([
          ...state.previousPages,
          ...action.currentPageComments,
        ]),
        lastProcessedCursor: state.cursor,
      };
    default:
      return state;
  }
}

function deduplicateComments(comments: EnrichedComment[]): EnrichedComment[] {
  const seen = new Set<string>();
  return comments.filter((c) => {
    if (seen.has(c._id)) return false;
    seen.add(c._id);
    return true;
  });
}

export function CommentSection({ mangaId, provider }: CommentSectionProps) {
  const { userId } = useAuth();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [state, dispatch] = useReducer(paginationReducer, {
    sort: "newest",
    cursor: undefined,
    previousPages: [],
    lastProcessedCursor: undefined,
  });

  const data = useQuery(api.functions.comments.getCommentsByManga, {
    manga_id: mangaId,
    provider,
    sort: state.sort,
    cursor: state.cursor,
    user_id: userId ?? undefined,
  });

  const stats = useQuery(api.functions.comments.getCommentStats, {
    manga_id: mangaId,
    provider,
  });

  // Derive displayed comments: previous pages + current page
  const currentPageComments = (data?.comments ?? []) as EnrichedComment[];
  const allComments = deduplicateComments([
    ...state.previousPages,
    ...currentPageComments,
  ]);

  const handleSortChange = useCallback((newSort: CommentSortOption) => {
    dispatch({ type: "CHANGE_SORT", sort: newSort });
  }, []);

  // Load more: snapshot current page into previousPages and advance cursor
  const loadMore = useCallback(() => {
    if (data?.hasMore && data.nextCursor !== null && data.nextCursor !== undefined) {
      dispatch({
        type: "LOAD_MORE",
        nextCursor: data.nextCursor as number,
        currentPageComments: (data.comments ?? []) as EnrichedComment[],
      });
    }
  }, [data]);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loadMore]);

  const isLoading = data === undefined && state.previousPages.length === 0;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-brand-start" />
          <h2 className="text-xl font-bold tracking-tight">Comments</h2>
          {stats && (
            <span className="text-xs font-medium text-muted-foreground tabular-nums">
              {stats.total_comments}
            </span>
          )}
        </div>

        <Select
          value={state.sort}
          onValueChange={(v) => handleSortChange(v as CommentSortOption)}
        >
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="likes">Most Liked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Comment Form */}
      <CommentForm mangaId={mangaId} provider={provider} />

      {/* Comments List */}
      <div className="divide-y divide-border/30">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 py-4">
              <Skeleton className="size-9 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-14" />
                </div>
              </div>
            </div>
          ))
        ) : allComments.length === 0 ? (
          <div className="py-12 text-center">
            <MessageSquare
              size={40}
              className="mx-auto mb-3 text-muted-foreground/30"
            />
            <p className="text-sm text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          allComments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              currentUserId={userId ?? null}
            />
          ))
        )}
      </div>

      {/* Infinite scroll trigger / Load more */}
      {data?.hasMore && (
        <div ref={loadMoreRef} className="flex justify-center pt-2 pb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadMore}
            className="gap-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowDown size={14} />
            Load more comments
          </Button>
        </div>
      )}
    </div>
  );
}
