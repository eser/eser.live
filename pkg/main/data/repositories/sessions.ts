// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { eq } from "drizzle-orm";
import { type SessionPartial, sessionSchema } from "../models/session.ts";
import { db } from "../db.ts";

export { type Session, type SessionPartial } from "../models/session.ts";

export class SessionRepository {
  async findAll() {
    const results = await db.select()
      .from(sessionSchema);

    return results;
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
