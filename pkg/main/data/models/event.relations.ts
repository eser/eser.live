// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { relations } from "drizzle-orm/relations";
import { eventSchema } from "./event.ts";
import { eventAttendanceSchema } from "./event-attendance.ts";

export const eventRelations = relations(eventSchema, ({ many }) => ({
  attendances: many(eventAttendanceSchema),
}));
