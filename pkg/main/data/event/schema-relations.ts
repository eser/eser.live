// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { relations } from "drizzle-orm/relations";
import { eventAttendanceSchema } from "../event-attendance/schema.ts";
import { eventSeriesSchema } from "../event-series/schema.ts";
import { eventSchema } from "./schema.ts";

export const eventRelations = relations(eventSchema, ({ one, many }) => ({
  series: one(eventSeriesSchema, {
    fields: [eventSchema.seriesId],
    references: [eventSeriesSchema.id],
  }),
  attendances: many(eventAttendanceSchema),
}));
