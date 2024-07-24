// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { boolean, char, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const questionSchema = pgTable(
  "question",
  {
    id: char("id", { length: 26 }).primaryKey(),

    userId: char("user_id", { length: 26 }).notNull(),

    content: text("content").notNull(),
    answeredAt: timestamp("answered_at", { withTimezone: true }),
    answeredAtUri: text("answered_at_uri"),

    isAnonymous: boolean("is_anonymous").default(false).notNull(),
    isHidden: boolean("is_hidden").default(false).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (_table) => ({
    // emailUnq: uniqueIndex().on(table.email),
  }),
);

export type Question = typeof questionSchema.$inferSelect;
export type QuestionPartial = typeof questionSchema.$inferInsert;
