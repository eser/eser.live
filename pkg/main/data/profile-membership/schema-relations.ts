// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { relations } from "drizzle-orm/relations";
import { profileSchema } from "../profile/schema.ts";
import { userSchema } from "../user/schema.ts";
import { profileMembershipSchema } from "./schema.ts";

export const profileMembershipRelations = relations(profileMembershipSchema, ({ one }) => ({
  profile: one(profileSchema, {
    fields: [profileMembershipSchema.profileId],
    references: [profileSchema.id],
  }),
  user: one(userSchema, {
    fields: [profileMembershipSchema.userId],
    references: [userSchema.id],
  }),
}));
