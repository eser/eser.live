// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { userSchema } from "./schema.ts";

export type User = typeof userSchema.$inferSelect;
export type UserPartial = typeof userSchema.$inferInsert;
