// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { relations } from "drizzle-orm/relations";
import { profileSchema } from "./profile.ts";
import { profileMembershipSchema } from "./profile-membership.ts";
import { eventAttendanceSchema } from "./event-attendance.ts";

export const profileRelations = relations(profileSchema, ({ many }) => ({
  memberships: many(profileMembershipSchema),
  eventAttendances: many(eventAttendanceSchema),
}));
