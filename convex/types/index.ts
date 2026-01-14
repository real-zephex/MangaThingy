import { Infer, v } from "convex/values";

export const trackObject = v.object({
  user_id: v.string(),
  id: v.string(),
  title: v.string(),
  image: v.string(),
  provider: v.optional(v.string()),
  status: v.string(),
  chapter: v.optional(v.string()),
  totalChapter: v.optional(v.string()),
});

export type TrackObject = Infer<typeof trackObject>;
