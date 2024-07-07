// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { relations } from "drizzle-orm/relations";
import { profileSchema } from "./profile.ts";
import { profileMembershipSchema } from "./profile-membership.ts";
import { eventAttendanceSchema } from "./event-attendance.ts";

export const profileRelations = relations(profileSchema, ({ many }) => ({
  memberships: many(profileMembershipSchema),
  eventAttendances: many(eventAttendanceSchema),
}));
