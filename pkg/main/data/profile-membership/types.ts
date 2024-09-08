// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { profileMembershipSchema } from "./schema.ts";

export type ProfileMembership = typeof profileMembershipSchema.$inferSelect;
export type ProfileMembershipPartial =
  typeof profileMembershipSchema.$inferInsert;
