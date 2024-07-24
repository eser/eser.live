// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { eq, gt } from "drizzle-orm";
import { type Cursor } from "@/pkg/main/library/data/cursors.ts";
import { type SessionPartial, sessionSchema } from "../models/session.ts";
import { db } from "../db.ts";

export { type Session, type SessionPartial } from "../models/session.ts";

export class SessionRepository {
  async findAll(cursor: Cursor) {
    const queryBase = db.select()
      .from(sessionSchema)
      .limit(cursor.pageSize);

    const query = (cursor.offset === "") ? queryBase : queryBase.where(
      gt(sessionSchema.id, cursor.offset),
    );

    const result = await query;

    return result;
  }

  async findById(id: string) {
    const result = await db.query.sessionSchema
      .findFirst({
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

    return result;
  }

  async create(session: SessionPartial) {
    const [result] = await db.insert(sessionSchema)
      .values(session)
      .returning();

    return result;
  }

  async update(id: string, session: Partial<SessionPartial>) {
    const [result] = await db.update(sessionSchema)
      .set({ ...session, updatedAt: new Date() })
      .where(eq(sessionSchema.id, id))
      .returning();

    return result;
  }
}

export const sessionRepository = new SessionRepository();
