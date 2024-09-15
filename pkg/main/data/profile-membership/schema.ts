// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { char, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";

export const profileMembershipSchema = pgTable(
  "profile_membership",
  {
    id: char("id", { length: 26 }).primaryKey(),
    kind: text("kind", {
      enum: ["owner", "lead", "maintainer", "contributor", "sponsor", "follower"],
    }).notNull(),

    profileId: char("profile_id", { length: 26 }).notNull(),
    userId: char("user_id", { length: 26 }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    roleUnq: unique().on(table.profileId, table.userId),
  }),
);
