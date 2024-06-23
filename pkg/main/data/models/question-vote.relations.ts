// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { relations } from "drizzle-orm/relations";
import { questionVoteSchema } from "./question-vote.ts";
import { questionSchema } from "./question.ts";
import { userSchema } from "./user.ts";

export const questionVoteRelations = relations(
  questionVoteSchema,
  ({ one }) => ({
    profile: one(questionSchema, {
      fields: [questionVoteSchema.questionId],
      references: [questionSchema.id],
    }),
    user: one(userSchema, {
      fields: [questionVoteSchema.userId],
      references: [userSchema.id],
    }),
  }),
);
