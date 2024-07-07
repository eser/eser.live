// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { char, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const eventSchema = pgTable(
  "event",
  {
    id: char("id", { length: 26 }).primaryKey(),
    kind: text("kind", {
      enum: ["broadcast", "meetup", "conference"],
    }).notNull(),

    slug: text("slug").notNull().unique(),
    eventPictureUri: text("event_picture_uri"),
    title: text("title").notNull(),
    description: text("description").notNull(),

    timeStart: timestamp("time_start", { withTimezone: true }).notNull(),
    timeEnd: timestamp("time_end", { withTimezone: true }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (_table) => ({
    // emailUnq: uniqueIndex().on(table.email),
  }),
);

export type Event = typeof eventSchema.$inferSelect;
export type EventPartial = typeof eventSchema.$inferInsert;
