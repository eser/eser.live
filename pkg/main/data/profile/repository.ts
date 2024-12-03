// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { type Cursor, withCursor } from "@/pkg/main/library/data/cursors.ts";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "../db.ts";
import { profileSchema } from "./schema.ts";
import type { Profile, ProfilePartial } from "./types.ts";

export class ProfileRepository {
  async findAll(cursor: Cursor) {
    const query = db
      .select()
      .from(profileSchema)
      .where(
        and(cursor.offset !== "" ? gt(profileSchema.id, cursor.offset) : undefined, isNull(profileSchema.deletedAt)),
      )
      .limit(cursor.pageSize);

    const result: Profile[] = await query;

    const nextCursor = result.length === cursor.pageSize ? result[result.length - 1].id ?? null : null;

    return withCursor(result, nextCursor);
  }

  async findById(id: string) {
    const result: Profile | undefined = await db.query.profileSchema.findFirst({
      where: and(eq(profileSchema.id, id), isNull(profileSchema.deletedAt)),
    });

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async findBySlug(slug: string) {
    const result: Profile | undefined = await db.query.profileSchema.findFirst({
      where: and(eq(profileSchema.slug, slug), isNull(profileSchema.deletedAt)),
    });

    return result ?? null;
  }

  async create(profile: ProfilePartial) {
    const result: Profile | undefined = (await db.insert(profileSchema).values(profile).returning()).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async update(id: string, profile: Partial<ProfilePartial>) {
    const result: Profile | undefined = (
      await db
        .update(profileSchema)
        .set({ ...profile, updatedAt: new Date() })
        .where(and(eq(profileSchema.id, id), isNull(profileSchema.deletedAt)))
        .returning()
    ).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async delete(id: string) {
    const result: Profile | undefined = (
      await db
        .update(profileSchema)
        .set({ deletedAt: new Date() })
        .where(and(eq(profileSchema.id, id), isNull(profileSchema.deletedAt)))
        .returning()
    ).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }
}

export const profileRepository = new ProfileRepository();
