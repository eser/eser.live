// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { char, integer, pgTable, timestamp, unique } from "drizzle-orm/pg-core";

export const questionVoteSchema = pgTable(
  "question_vote",
  {
    id: char("id", { length: 26 }).primaryKey(),

    question: char("question", { length: 26 }).notNull(),
    user: char("user", { length: 26 }).notNull(),

    score: integer("score").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
      .notNull(),
    // updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    voteUnq: unique().on(
      table.question,
      table.user,
    ),
  }),
);

export type QuestionVote = typeof questionVoteSchema.$inferSelect;
export type QuestionVotePartial = typeof questionVoteSchema.$inferInsert;
