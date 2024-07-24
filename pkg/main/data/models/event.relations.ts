// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { relations } from "drizzle-orm/relations";
import { eventSchema } from "./event.ts";
import { eventAttendanceSchema } from "./event-attendance.ts";

export const eventRelations = relations(eventSchema, ({ many }) => ({
  attendances: many(eventAttendanceSchema),
}));
