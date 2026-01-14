import { useQuery } from "convex/react";
import { api } from "../_generated/api";

export function GetHistoryFromDatabase({ user_id }: { user_id: string }) {
  const data = useQuery(api.functions.query.getReadingHistory, { user_id });
  return data;
}
