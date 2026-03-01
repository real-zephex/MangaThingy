import { useQuery } from "convex/react";
import { api } from "../_generated/api";

export function GetHistoryFromDatabase({ user_id }: { user_id: string }) {
  const data = useQuery(api.functions.query.getReadingHistory, { user_id });
  return data;
}

export function GetChapterHistory({
  user_id,
  manga_id,
}: {
  user_id: string;
  manga_id: string;
}) {
  const data = useQuery(api.functions.query.getChapterHistory, {
    user_id,
    manga_id,
  });
  return data;
}

export function GetExistingEntry({
  user_id,
  manga_id,
  provider,
}: {
  user_id: string;
  manga_id: string;
  provider?: string;
}) {
  const data = useQuery(api.functions.query.getExistingEntry, {
    user_id,
    manga_id,
    provider,
  });
  return data;
}
