// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { relations } from "drizzle-orm/relations";
import { profileMembershipSchema } from "./profile-membership.ts";
import { sessionSchema } from "./session.ts";
import { userSchema } from "./user.ts";

export const userRelations = relations(userSchema, ({ many }) => ({
  profileMemberships: many(profileMembershipSchema),
  sessions: many(sessionSchema),
}));
