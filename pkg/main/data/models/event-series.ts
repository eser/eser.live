// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { char, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const eventSeriesSchema = pgTable(
  "event_series",
  {
    id: char("id", { length: 26 }).primaryKey(),

    slug: text("slug").notNull().unique(),
    eventPictureUri: text("event_picture_uri"),
    title: text("title").notNull(),
    description: text("description").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (_table) => ({
    // emailUnq: uniqueIndex().on(table.email),
  }),
);

export type EventSeries = typeof eventSeriesSchema.$inferSelect;
export type EventSeriesPartial = typeof eventSeriesSchema.$inferInsert;
