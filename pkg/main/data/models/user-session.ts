// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { char, index, pgTable, timestamp } from "drizzle-orm/pg-core";

export const userSessionSchema = pgTable(
  "user_session",
  {
    id: char("id", { length: 26 }).primaryKey(),

    user: char("user", { length: 26 }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
      .notNull(),
    // updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    userIdx: index().on(table.user),
  }),
);

export type UserSession = typeof userSessionSchema.$inferSelect;
export type UserSessionPartial = typeof userSessionSchema.$inferInsert;
