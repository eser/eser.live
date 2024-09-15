// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { type Cursor, withCursor } from "@/pkg/main/library/data/cursors.ts";
import { and, eq, isNull, lt, sql } from "drizzle-orm";
import { db } from "../db.ts";
import { profileSchema } from "../profile/schema.ts";
import { storySchema } from "./schema.ts";
import type { Story, StoryKind, StoryPartial, StoryStatus, StoryWithDetails } from "./types.ts";

export class StoryRepository {
  async findAll(cursor: Cursor) {
    const filterConditions = and(
      cursor.offset !== "" ? lt(storySchema.publishedAt, new Date(Number(cursor.offset))) : undefined,
      isNull(storySchema.deletedAt),
    );

    const query = await db.query.storySchema.findMany({
      where: filterConditions,
      limit: cursor.pageSize,
    });

    const result: Story[] = await query;

    const nextCursor = result.length === cursor.pageSize
      ? result[result.length - 1].publishedAt?.getTime() ?? null
      : null;

    return withCursor(result, nextCursor);
  }

  async findAllWithDetails(cursor: Cursor) {
    const filterConditions = and(
      cursor.offset !== "" ? lt(storySchema.publishedAt, new Date(Number(cursor.offset))) : undefined,
      isNull(storySchema.deletedAt),
    );

    const query = db
      .select({
        id: storySchema.id,
        kind: storySchema.kind,
        status: storySchema.status,
        isFeatured: storySchema.is_featured,
        slug: storySchema.slug,
        storyPictureUri: storySchema.storyPictureUri,
        title: storySchema.title,
        description: storySchema.description,
        authorProfile: {
          id: profileSchema.id,
          kind: profileSchema.kind,
          slug: profileSchema.slug,
          profilePictureUri: profileSchema.profilePictureUri,
          title: profileSchema.title,
          description: profileSchema.description,
        },
        content: storySchema.content,
        publishedAt: storySchema.publishedAt,
        createdAt: storySchema.createdAt,
        updatedAt: storySchema.updatedAt,
      })
      .from(storySchema)
      .leftJoin(profileSchema, and(eq(profileSchema.id, storySchema.authorProfileId), isNull(profileSchema.deletedAt)))
      .where(filterConditions)
      .orderBy(sql`${storySchema.publishedAt} DESC`)
      .limit(cursor.pageSize);

    const result: StoryWithDetails[] = await query;

    const nextCursor = result.length === cursor.pageSize
      ? result[result.length - 1].publishedAt?.getTime() ?? null
      : null;

    return withCursor(result, nextCursor);
  }

  async findAllByKindAndStatus(kind: StoryKind, status: StoryStatus, cursor: Cursor) {
    const filterConditions = and(
      cursor.offset !== "" ? lt(storySchema.publishedAt, new Date(Number(cursor.offset))) : undefined,
      eq(storySchema.kind, kind),
      eq(storySchema.status, status),
      isNull(storySchema.deletedAt),
    );

    const query = await db.query.storySchema.findMany({
      where: filterConditions,
      limit: cursor.pageSize,
      orderBy: [sql`${storySchema.publishedAt} DESC`],
    });

    const result: Story[] = await query;

    const nextCursor = result.length === cursor.pageSize
      ? result[result.length - 1].publishedAt?.getTime() ?? null
      : null;

    return withCursor(result, nextCursor);
  }

  async findAllByKindAndStatusWithDetails(kind: StoryKind, status: StoryStatus, cursor: Cursor) {
    const filterConditions = and(
      cursor.offset !== "" ? lt(storySchema.publishedAt, new Date(Number(cursor.offset))) : undefined,
      eq(storySchema.kind, kind),
      eq(storySchema.status, status),
      isNull(storySchema.deletedAt),
    );

    const query = db
      .select({
        id: storySchema.id,
        kind: storySchema.kind,
        status: storySchema.status,
        isFeatured: storySchema.is_featured,

        slug: storySchema.slug,
        storyPictureUri: storySchema.storyPictureUri,
        title: storySchema.title,
        description: storySchema.description,

        authorProfile: {
          id: profileSchema.id,
          kind: profileSchema.kind,

          slug: profileSchema.slug,
          profilePictureUri: profileSchema.profilePictureUri,
          title: profileSchema.title,
          description: profileSchema.description,
        },
        content: storySchema.content,
        publishedAt: storySchema.publishedAt,

        createdAt: storySchema.createdAt,
        updatedAt: storySchema.updatedAt,
      })
      .from(storySchema)
      .leftJoin(profileSchema, and(eq(profileSchema.id, storySchema.authorProfileId), isNull(profileSchema.deletedAt)))
      .where(filterConditions)
      .orderBy(sql`${storySchema.publishedAt} DESC`)
      .limit(cursor.pageSize);

    const result: StoryWithDetails[] = await query;

    const nextCursor = result.length === cursor.pageSize
      ? result[result.length - 1].publishedAt?.getTime() ?? null
      : null;

    return withCursor(result, nextCursor);
  }

  async findById(id: string) {
    const result: Story | undefined = await db.query.storySchema.findFirst({
      where: and(eq(storySchema.id, id), isNull(storySchema.deletedAt)),
    });

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async findBySlug(slug: string) {
    const result: Story | undefined = await db.query.storySchema.findFirst({
      where: and(eq(storySchema.slug, slug), isNull(storySchema.deletedAt)),
    });

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async create(story: StoryPartial) {
    const result: Story | undefined = (await db.insert(storySchema).values(story).returning()).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async update(id: string, story: Partial<StoryPartial>) {
    const result: Story | undefined = (
      await db
        .update(storySchema)
        .set({ ...story, updatedAt: new Date() })
        .where(and(eq(storySchema.id, id), isNull(storySchema.deletedAt)))
        .returning()
    ).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async delete(id: string) {
    const result: Story | undefined = (
      await db
        .update(storySchema)
        .set({ deletedAt: new Date() })
        .where(and(eq(storySchema.id, id), isNull(storySchema.deletedAt)))
        .returning()
    ).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }
}

export const storyRepository = new StoryRepository();
