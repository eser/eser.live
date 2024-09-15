// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { char, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const eventSchema = pgTable(
  "event",
  {
    id: char("id", { length: 26 }).primaryKey(),
    kind: text("kind", {
      enum: ["broadcast", "meetup", "conference"],
    }).notNull(),
    status: text("status", {
      enum: ["draft", "published", "archived"],
    }).notNull(),

    seriesId: char("series_id", { length: 26 }),
    slug: text("slug").notNull().unique(),
    eventPictureUri: text("event_picture_uri"),
    title: text("title").notNull(),
    description: text("description").notNull(),

    // registrationUri: text("registration_uri"),
    attendanceUri: text("attendance_uri"),

    publishedAt: timestamp("published_at", { withTimezone: true }),
    timeStart: timestamp("time_start", { withTimezone: true }).notNull(),
    timeEnd: timestamp("time_end", { withTimezone: true }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (_table) => ({
    // emailUnq: uniqueIndex().on(table.email),
  }),
);
