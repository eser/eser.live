// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { relations } from "drizzle-orm/relations";
import { sessionSchema } from "./session.ts";
import { userSchema } from "./user.ts";

export const sessionRelations = relations(
  sessionSchema,
  ({ one }) => ({
    user: one(userSchema, {
      fields: [sessionSchema.loggedInUserId],
      references: [userSchema.id],
    }),
  }),
);
