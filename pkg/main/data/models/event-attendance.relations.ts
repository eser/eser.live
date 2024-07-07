// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { relations } from "drizzle-orm/relations";
import { eventAttendanceSchema } from "./event-attendance.ts";
import { eventSchema } from "./event.ts";
import { profileSchema } from "./profile.ts";

export const eventAttendanceRelations = relations(
  eventAttendanceSchema,
  ({ one }) => ({
    event: one(eventSchema, {
      fields: [eventAttendanceSchema.eventId],
      references: [eventSchema.id],
    }),
    profile: one(profileSchema, {
      fields: [eventAttendanceSchema.profileId],
      references: [profileSchema.id],
    }),
  }),
);
