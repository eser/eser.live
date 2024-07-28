// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { relations } from "drizzle-orm/relations";
import { eventSeriesSchema } from "./event-series.ts";
import { eventSchema } from "./event.ts";

export const eventSeriesRelations = relations(
  eventSeriesSchema,
  ({ many }) => ({
    events: many(eventSchema),
  }),
);
