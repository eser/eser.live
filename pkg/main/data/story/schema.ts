// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { boolean, char, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const storySchema = pgTable(
  "story",
  {
    id: char("id", { length: 26 }).primaryKey(),
    kind: text("kind", {
      enum: ["status", "announcement", "news", "article", "recipe"],
    }).notNull(),
    status: text("status", {
      enum: ["draft", "published", "archived"],
    }).notNull(),
    is_featured: boolean("is_featured").default(false),

    slug: text("slug").notNull().unique(),
    storyPictureUri: text("story_picture_uri"),
    title: text("title").notNull(),
    description: text("description").notNull(),

    authorProfileId: char("author_profile_id", { length: 26 }),
    summary: text("summary").notNull(),
    content: text("content").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (_table) => ({
    // emailUnq: uniqueIndex().on(table.email),
  }),
);
