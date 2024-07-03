// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { and, eq, isNull } from "drizzle-orm";
import { type UserPartial, userSchema } from "../models/user.ts";
import { db } from "../db.ts";

export { type User, type UserPartial } from "../models/user.ts";

export class UserRepository {
  async findAll() {
    const results = await db.select()
      .from(userSchema)
      .where(isNull(userSchema.deletedAt));

    return results;
  }

  async findAllWithDetails() {
    const result = await db.select({
      id: userSchema.id,
      name: userSchema.name,
      githubHandle: userSchema.githubHandle,
      xHandle: userSchema.xHandle,
    })
      .from(userSchema);

    return result;
  }

  async findById(id: string) {
    const result = await db.query.userSchema
      .findFirst({
        where: and(eq(userSchema.id, id), isNull(userSchema.deletedAt)),
      });

    return result;
  }

  async findByGitHubHandle(gitHubHandle: string) {
    const result = await db.query.userSchema
      .findFirst({
        where: and(
          eq(userSchema.githubHandle, gitHubHandle),
          isNull(userSchema.deletedAt),
        ),
      });

    return result;
  }

  async create(user: UserPartial) {
    const [result] = await db.insert(userSchema)
      .values(user)
      .returning();

    return result;
  }

  async upsertByGithubHandle(user: UserPartial) {
    const [result] = await db.insert(userSchema)
      .values(user)
      .onConflictDoUpdate({
        target: userSchema.githubHandle,
        targetWhere: isNull(userSchema.deletedAt),
        set: { ...user, updatedAt: new Date() },
      })
      .returning();

    return result;
  }

  async update(id: string, user: Partial<UserPartial>) {
    const [result] = await db.update(userSchema)
      .set({ ...user, updatedAt: new Date() })
      .where(and(eq(userSchema.id, id), isNull(userSchema.deletedAt)))
      .returning();

    return result;
  }

  async delete(id: string) {
    const [result] = await db.update(userSchema)
      .set({ deletedAt: new Date() })
      .where(and(eq(userSchema.id, id), isNull(userSchema.deletedAt)))
      .returning();

    return result;
  }
}

export const userRepository = new UserRepository();
