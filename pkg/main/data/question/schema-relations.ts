// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { relations } from "drizzle-orm/relations";
import { questionVoteSchema } from "../question-vote/schema.ts";
import { userSchema } from "../user/schema.ts";
import { questionSchema } from "./schema.ts";

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
