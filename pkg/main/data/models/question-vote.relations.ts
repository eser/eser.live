// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { relations } from "drizzle-orm/relations";
import { questionVoteSchema } from "./question-vote.ts";
import { questionSchema } from "./question.ts";
import { userSchema } from "./user.ts";

export const questionVoteRelations = relations(
  questionVoteSchema,
  ({ one }) => ({
    question: one(questionSchema, {
      fields: [questionVoteSchema.questionId],
      references: [questionSchema.id],
    }),
    user: one(userSchema, {
      fields: [questionVoteSchema.userId],
      references: [userSchema.id],
    }),
  }),
);
