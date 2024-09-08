// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { relations } from "drizzle-orm/relations";
import { eventSchema } from "../event/schema.ts";
import { profileSchema } from "../profile/schema.ts";
import { eventAttendanceSchema } from "./schema.ts";

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
