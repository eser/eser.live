// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { relations } from "drizzle-orm/relations";
import { questionSchema } from "./question.ts";
import { questionVoteSchema } from "./question-vote.ts";
import { userSchema } from "./user.ts";

export const questionRelations = relations(
  questionSchema,
  ({ one, many }) => ({
    user: one(userSchema, {
      fields: [questionSchema.userId],
      references: [userSchema.id],
    }),
    votes: many(questionVoteSchema),
  }),
);
