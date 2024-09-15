// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { eventSeriesSchema } from "./schema.ts";

export type EventSeries = typeof eventSeriesSchema.$inferSelect;
export type EventSeriesPartial = typeof eventSeriesSchema.$inferInsert;
