// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { type Cursor, withCursor } from "@/pkg/main/library/data/cursors.ts";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "../db.ts";
import { userSchema } from "./schema.ts";
import type { User, UserPartial } from "./types.ts";

export class UserRepository {
  async findAll(cursor: Cursor) {
    const query = db
      .select()
      .from(userSchema)
      .where(and(cursor.offset !== "" ? gt(userSchema.id, cursor.offset) : undefined, isNull(userSchema.deletedAt)))
      .limit(cursor.pageSize);

    const result: User[] = await query;

    const nextCursor = result.length === cursor.pageSize ? result[result.length - 1].id ?? null : null;

    return withCursor(result, nextCursor);
  }

  async findById(id: string) {
    const result: User | undefined = await db.query.userSchema.findFirst({
      where: and(eq(userSchema.id, id), isNull(userSchema.deletedAt)),
    });

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async findByGitHubRemoteId(gitHubRemoteId: string) {
    const result: User | undefined = await db.query.userSchema.findFirst({
      where: and(eq(userSchema.githubRemoteId, gitHubRemoteId), isNull(userSchema.deletedAt)),
    });

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async findByGitHubHandle(gitHubHandle: string) {
    const result: User | undefined = await db.query.userSchema.findFirst({
      where: and(eq(userSchema.githubHandle, gitHubHandle), isNull(userSchema.deletedAt)),
    });

    if (result === undefined) {
      return null;
    }
    return result;
  }

  async create(user: UserPartial) {
    const result: User | undefined = (await db.insert(userSchema).values(user).returning()).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async upsertByGithubRemoteId(user: UserPartial) {
    const result: User | undefined = (
      await db
        .insert(userSchema)
        .values(user)
        .onConflictDoUpdate({
          target: userSchema.githubRemoteId,
          targetWhere: isNull(userSchema.deletedAt),
          set: { ...user, updatedAt: new Date() },
        })
        .returning()
    ).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async upsertByGithubHandle(user: UserPartial) {
    const result: User | undefined = (
      await db
        .insert(userSchema)
        .values(user)
        .onConflictDoUpdate({
          target: userSchema.githubHandle,
          targetWhere: isNull(userSchema.deletedAt),
          set: { ...user, updatedAt: new Date() },
        })
        .returning()
    ).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async update(id: string, user: Partial<UserPartial>) {
    const result: User | undefined = (
      await db
        .update(userSchema)
        .set({ ...user, updatedAt: new Date() })
        .where(and(eq(userSchema.id, id), isNull(userSchema.deletedAt)))
        .returning()
    ).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async delete(id: string) {
    const result: User | undefined = (
      await db
        .update(userSchema)
        .set({ deletedAt: new Date() })
        .where(and(eq(userSchema.id, id), isNull(userSchema.deletedAt)))
        .returning()
    ).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }
}

export const userRepository = new UserRepository();
