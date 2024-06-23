// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { char, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userSchema = pgTable(
  "user",
  {
    id: char("id", { length: 26 }).primaryKey(),
    kind: text("kind", { enum: ["admin", "regular"] }).notNull(),

    name: text("name").notNull(),
    email: text("email").unique(),
    phone: text("phone"),
    githubHandle: text("github_handle"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (_table) => ({
    // emailUnq: uniqueIndex().on(table.email),
  }),
);

export type User = typeof userSchema.$inferSelect;
export type UserPartial = typeof userSchema.$inferInsert;
