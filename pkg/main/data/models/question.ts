// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { boolean, char, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const questionSchema = pgTable(
  "question",
  {
    id: char("id", { length: 26 }).primaryKey(),

    user: char("user", { length: 26 }).notNull(),

    content: text("content").notNull(),

    isHidden: boolean("is_hidden").default(false).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (_table) => ({
    // emailUnq: uniqueIndex().on(table.email),
  }),
);

export type Question = typeof questionSchema.$inferSelect;
export type QuestionPartial = typeof questionSchema.$inferInsert;
