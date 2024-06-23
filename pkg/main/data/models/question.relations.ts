// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { relations } from "drizzle-orm/relations";
import { questionSchema } from "./question.ts";
import { userSchema } from "./user.ts";

export const questionRelations = relations(
  questionSchema,
  ({ one }) => ({
    user: one(userSchema, {
      fields: [questionSchema.user],
      references: [userSchema.id],
    }),
  }),
);
