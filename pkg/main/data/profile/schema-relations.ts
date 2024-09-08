// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { relations } from "drizzle-orm/relations";
import { eventAttendanceSchema } from "../event-attendance/schema.ts";
import { profileMembershipSchema } from "../profile-membership/schema.ts";
import { profileSchema } from "./schema.ts";

export const profileRelations = relations(profileSchema, ({ many }) => ({
  memberships: many(profileMembershipSchema),
  eventAttendances: many(eventAttendanceSchema),
}));
