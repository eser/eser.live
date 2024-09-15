// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { eventAttendanceSchema } from "./schema.ts";

export type EventAttendance = typeof eventAttendanceSchema.$inferSelect;
export type EventAttendancePartial = typeof eventAttendanceSchema.$inferInsert;
