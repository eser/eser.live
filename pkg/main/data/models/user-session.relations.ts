// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { relations } from "drizzle-orm/relations";
import { userSessionSchema } from "./user-session.ts";
import { userSchema } from "./user.ts";

export const userSessionRelations = relations(
  userSessionSchema,
  ({ one }) => ({
    user: one(userSchema, {
      fields: [userSessionSchema.user],
      references: [userSchema.id],
    }),
  }),
);
