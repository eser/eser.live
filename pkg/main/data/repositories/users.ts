// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { and, eq, gt, isNull } from "drizzle-orm";
import { type Cursor } from "@/pkg/main/library/data/cursors.ts";
import { type UserPartial, userSchema } from "../models/user.ts";
import { db } from "../db.ts";

export { type User, type UserPartial } from "../models/user.ts";

export class UserRepository {
  async findAll(cursor: Cursor) {
    const query = db.select()
      .from(userSchema)
      .where(
        and(
          (cursor.offset !== "") ? gt(userSchema.id, cursor.offset) : undefined,
          isNull(userSchema.deletedAt),
        ),
      )
      .limit(cursor.pageSize);

    const result = await query;

    return result;
  }

  async findAllWithDetails(cursor: Cursor) {
    const query = db.select({
      id: userSchema.id,
      name: userSchema.name,
      githubHandle: userSchema.githubHandle,
      xHandle: userSchema.xHandle,
    })
      .from(userSchema)
      .where(
        and(
          (cursor.offset !== "") ? gt(userSchema.id, cursor.offset) : undefined,
          isNull(userSchema.deletedAt),
        ),
      )
      .limit(cursor.pageSize);

    const result = await query;

    return result;
  }

  async findById(id: string) {
    const result = await db.query.userSchema
      .findFirst({
        where: and(eq(userSchema.id, id), isNull(userSchema.deletedAt)),
      });

    return result;
  }

  async findByGitHubRemoteId(gitHubRemoteId: string) {
    const result = await db.query.userSchema
      .findFirst({
        where: and(
          eq(userSchema.githubRemoteId, gitHubRemoteId),
          isNull(userSchema.deletedAt),
        ),
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

  async upsertByGithubRemoteId(user: UserPartial) {
    const [result] = await db.insert(userSchema)
      .values(user)
      .onConflictDoUpdate({
        target: userSchema.githubRemoteId,
        targetWhere: isNull(userSchema.deletedAt),
        set: { ...user, updatedAt: new Date() },
      })
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
