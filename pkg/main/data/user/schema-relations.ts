// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { relations } from "drizzle-orm/relations";
import { profileMembershipSchema } from "../profile-membership/schema.ts";
import { profileSchema } from "../profile/schema.ts";
import { sessionSchema } from "../session/schema.ts";
import { userSchema } from "./schema.ts";

export const userRelations = relations(userSchema, ({ one, many }) => ({
  individualProfile: one(profileSchema, {
    fields: [userSchema.individualProfileId],
    references: [profileSchema.id],
  }),
  profileMemberships: many(profileMembershipSchema),
  sessions: many(sessionSchema),
}));
