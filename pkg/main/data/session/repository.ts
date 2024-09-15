// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { type Cursor, withCursor } from "@/pkg/main/library/data/cursors.ts";
import { eq, gt } from "drizzle-orm";
import { db } from "../db.ts";
import { sessionSchema } from "./schema.ts";
import type { Session, SessionPartial } from "./types.ts";

export class SessionRepository {
  async findAll(cursor: Cursor) {
    const query = db
      .select()
      .from(sessionSchema)
      .where(cursor.offset !== "" ? gt(sessionSchema.id, cursor.offset) : undefined)
      .limit(cursor.pageSize);

    const result: Session[] = await query;

    const nextCursor = result.length === cursor.pageSize ? result[result.length - 1].id : null;

    return withCursor(result, nextCursor);
  }

  async findById(id: string) {
    const result = await db.query.sessionSchema.findFirst({
      where: eq(sessionSchema.id, id),
      with: {
        user: true,
        // user: {
        //   with: {
        //     profileMemberships: {
        //       with: {
        //         profile: true,
        //       },
        //     },
        //   },
        // },
      },
    });

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async create(session: SessionPartial) {
    const result: Session | undefined = (await db.insert(sessionSchema).values(session).returning()).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async update(id: string, session: Partial<SessionPartial>) {
    const result: Session | undefined = (
      await db
        .update(sessionSchema)
        .set({ ...session, updatedAt: new Date() })
        .where(eq(sessionSchema.id, id))
        .returning()
    ).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }
}

export const sessionRepository = new SessionRepository();
