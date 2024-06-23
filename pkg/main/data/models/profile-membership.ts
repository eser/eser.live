// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { char, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";

export const profileMembershipSchema = pgTable(
  "profile_membership",
  {
    id: char("id", { length: 26 }).primaryKey(),
    kind: text("kind", {
      enum: [
        "owner",
        "lead",
        "maintainer",
        "contributor",
        "sponsor",
        "follower",
      ],
    }).notNull(),

    profileId: char("profile_id", { length: 26 }).notNull(),
    userId: char("user_id", { length: 26 }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    roleUnq: unique().on(
      table.profileId,
      table.userId,
    ),
  }),
);

export type ProfileMembership = typeof profileMembershipSchema.$inferSelect;
export type ProfileMembershipPartial =
  typeof profileMembershipSchema.$inferInsert;
