// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { boolean, char, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const profileSchema = pgTable(
  "profile",
  {
    id: char("id", { length: 26 }).primaryKey(),
    kind: text("kind", {
      enum: ["individual", "organization", "product", "venue"],
    }).notNull(),

    slug: text("slug").notNull().unique(),
    profilePictureUri: text("profile_picture_uri"),
    title: text("title").notNull(),
    description: text("description").notNull(),

    showStories: boolean("show_stories").default(false).notNull(),
    showMembers: boolean("show_projects").default(false).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (_table) => ({
    // emailUnq: uniqueIndex().on(table.email),
  }),
);

export type Profile = typeof profileSchema.$inferSelect;
export type ProfilePartial = typeof profileSchema.$inferInsert;
