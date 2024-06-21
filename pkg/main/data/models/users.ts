import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
// import { relations } from "drizzle-orm/relations";
// import { pets } from "./pets.ts";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 256 }).unique(),
  phone: varchar("phone", { length: 256 }),
  role: text("role").$type<"admin" | "customer">(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// export const usersRelations = relations(users, ({ many }) => ({
//   pets: many(pets),
// }));

export type User = typeof users.$inferSelect;
