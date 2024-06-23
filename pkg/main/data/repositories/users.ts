// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { eq } from "drizzle-orm";
import { type User, userSchema } from "../models/user.ts";
import { db } from "../db.ts";

export class UserRepository {
  async findAll(): Promise<User[]> {
    const results = await db.select()
      .from(userSchema);

    return results;
  }

  async find(id: string): Promise<User | null> {
    const result = await db.query.userSchema
      .findFirst({
        where: eq(userSchema.id, id),
      });

    return result ?? null;
  }

  async create(user: User): Promise<User> {
    const [result] = await db.insert(userSchema)
      .values(user)
      .returning();

    return result;
  }

  async delete(id: string): Promise<void> {
    await db.delete(userSchema)
      .where(eq(userSchema.id, id));
  }
}

export const userRepository = new UserRepository();
