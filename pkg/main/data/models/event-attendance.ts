// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { char, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";

export const eventAttendanceSchema = pgTable(
  "event_attendance",
  {
    id: char("id", { length: 26 }).primaryKey(),
    kind: text("kind", {
      enum: [
        "organizer",
        "co-organizer",
        "speaker",
        "sponsor",
        "guest",
      ],
    }).notNull(),

    eventId: char("event_id", { length: 26 }).notNull(),
    profileId: char("profile_id", { length: 26 }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    roleUnq: unique().on(
      table.eventId,
      table.profileId,
    ),
  }),
);

export type EventAttendance = typeof eventAttendanceSchema.$inferSelect;
export type EventAttendancePartial = typeof eventAttendanceSchema.$inferInsert;
