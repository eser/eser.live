// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { relations } from "drizzle-orm/relations";
import { userSchema } from "../user/schema.ts";
import { sessionSchema } from "./schema.ts";

export const sessionRelations = relations(
  sessionSchema,
  ({ one }) => ({
    user: one(userSchema, {
      fields: [sessionSchema.loggedInUserId],
      references: [userSchema.id],
    }),
  }),
);
