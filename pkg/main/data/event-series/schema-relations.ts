// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { relations } from "drizzle-orm/relations";
import { eventSchema } from "../event/schema.ts";
import { eventSeriesSchema } from "./schema.ts";

export const eventSeriesRelations = relations(
  eventSeriesSchema,
  ({ many }) => ({
    events: many(eventSchema),
  }),
);
