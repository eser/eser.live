// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { eventSeriesSchema } from "../event-series/schema.ts";
import type { eventSchema } from "./schema.ts";

export type Event = typeof eventSchema.$inferSelect;
export type EventPartial = typeof eventSchema.$inferInsert;

export type EventWithStats = {
  id: (typeof eventSchema.$inferSelect)["id"];
  kind: (typeof eventSchema.$inferSelect)["kind"];
  status: (typeof eventSchema.$inferSelect)["status"];
  series: {
    id: (typeof eventSeriesSchema.$inferSelect)["id"];
    slug: (typeof eventSeriesSchema.$inferSelect)["slug"];
    eventPictureUri: (typeof eventSeriesSchema.$inferSelect)["eventPictureUri"];
    title: (typeof eventSeriesSchema.$inferSelect)["title"];
    description: (typeof eventSeriesSchema.$inferSelect)["description"];
  } | null;
  slug: (typeof eventSchema.$inferSelect)["slug"];
  eventPictureUri: (typeof eventSchema.$inferSelect)["eventPictureUri"];
  title: (typeof eventSchema.$inferSelect)["title"];
  description: (typeof eventSchema.$inferSelect)["description"];
  attendanceUri: (typeof eventSchema.$inferSelect)["attendanceUri"];
  publishedAt: (typeof eventSchema.$inferSelect)["publishedAt"];
  timeStart: (typeof eventSchema.$inferSelect)["timeStart"];
  timeEnd: (typeof eventSchema.$inferSelect)["timeEnd"];
  createdAt: (typeof eventSchema.$inferSelect)["createdAt"];
  updatedAt: (typeof eventSchema.$inferSelect)["updatedAt"];
  statSumTotal: number;
  statSumProfile: number;
};
