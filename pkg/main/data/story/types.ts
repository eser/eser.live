// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { profileSchema } from "../profile/schema.ts";
import { storySchema } from "./schema.ts";

export type Story = typeof storySchema.$inferSelect;
export type StoryPartial = typeof storySchema.$inferInsert;

export type StoryKind = Story["kind"];
export type StoryStatus = Story["status"];

export type StoryWithDetails = {
  id: typeof storySchema.$inferSelect["id"];
  kind: typeof storySchema.$inferSelect["kind"];
  status: typeof storySchema.$inferSelect["status"];
  isFeatured: typeof storySchema.$inferSelect["is_featured"];
  slug: typeof storySchema.$inferSelect["slug"];
  storyPictureUri: typeof storySchema.$inferSelect["storyPictureUri"];
  title: typeof storySchema.$inferSelect["title"];
  description: typeof storySchema.$inferSelect["description"];
  authorProfile: {
    id: typeof profileSchema.$inferSelect["id"];
    kind: typeof profileSchema.$inferSelect["kind"];
    slug: typeof profileSchema.$inferSelect["slug"];
    profilePictureUri: typeof profileSchema.$inferSelect["profilePictureUri"];
    title: typeof profileSchema.$inferSelect["title"];
    description: typeof profileSchema.$inferSelect["description"];
  } | null;
  content: typeof storySchema.$inferSelect["content"];
  publishedAt: typeof storySchema.$inferSelect["publishedAt"];
  createdAt: typeof storySchema.$inferSelect["createdAt"];
  updatedAt: typeof storySchema.$inferSelect["updatedAt"];
};
