// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { relations } from "drizzle-orm/relations";
import { profileMembershipSchema } from "./profile-membership.ts";
import { profileSchema } from "./profile.ts";
import { userSchema } from "./user.ts";

export const profileMembershipRelations = relations(
  profileMembershipSchema,
  ({ one }) => ({
    profile: one(profileSchema, {
      fields: [profileMembershipSchema.profileId],
      references: [profileSchema.id],
    }),
    user: one(userSchema, {
      fields: [profileMembershipSchema.userId],
      references: [userSchema.id],
    }),
  }),
);
