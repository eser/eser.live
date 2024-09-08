// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { profileSchema } from "./schema.ts";

export type Profile = typeof profileSchema.$inferSelect;
export type ProfilePartial = typeof profileSchema.$inferInsert;
