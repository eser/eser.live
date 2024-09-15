// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { char, integer, pgTable, timestamp, unique } from "drizzle-orm/pg-core";

export const questionVoteSchema = pgTable(
  "question_vote",
  {
    id: char("id", { length: 26 }).primaryKey(),

    questionId: char("question_id", { length: 26 }).notNull(),
    userId: char("user_id", { length: 26 }).notNull(),

    score: integer("score").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    // updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    voteUnq: unique().on(table.questionId, table.userId),
  }),
);
