// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { relations } from "drizzle-orm/relations";
import { profileSchema } from "./profile.ts";
import { profileMembershipSchema } from "./profile-membership.ts";

export const profileRelations = relations(profileSchema, ({ many }) => ({
  memberships: many(profileMembershipSchema),
}));
