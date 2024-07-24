// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { type Cursor } from "@/pkg/main/library/data/cursors.ts";
import { type EventPartial, eventSchema } from "../models/event.ts";
import { profileSchema } from "../models/profile.ts";
import {
  type EventAttendancePartial,
  eventAttendanceSchema,
} from "../models/event-attendance.ts";
import { db } from "../db.ts";

export { type Event, type EventPartial } from "../models/event.ts";

export class EventRepository {
  async findAll(cursor: Cursor) {
    const filterConditions = (cursor.offset === "")
      ? isNull(eventSchema.deletedAt)
      : and(
        gt(eventSchema.id, cursor.offset),
        isNull(eventSchema.deletedAt),
      );

    const query = await db.query.eventSchema
      .findMany({
        where: filterConditions,
        limit: cursor.pageSize,
      });

    const result = await query;

    return result;
  }

  async findAllAttendancesByProfileId(cursor: Cursor, profileId: string) {
    const filterConditions = (cursor.offset === "")
      ? isNull(eventSchema.deletedAt)
      : and(
        gt(eventSchema.id, cursor.offset),
        isNull(eventSchema.deletedAt),
      );

    const query = db.query.eventSchema
      .findMany({
        where: filterConditions,
        with: {
          attendances: {
            where: eq(eventAttendanceSchema.profileId, profileId),
          },
        },
        limit: cursor.pageSize,
      });

    const result = await query;

    return result;
  }

  async upsertAttendance(eventAttendance: EventAttendancePartial) {
    const [result] = await db.insert(eventAttendanceSchema)
      .values(eventAttendance)
      .onConflictDoUpdate({
        target: [
          eventAttendanceSchema.eventId,
          eventAttendanceSchema.profileId,
        ],
        set: eventAttendance,
      })
      .returning();

    return result;
  }

  async findAllWithStats(cursor: Cursor, viewingProfileId?: string) {
    const twoHoursLater = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const statSumProfileCalculation = viewingProfileId !== undefined
      ? sql<
        number
      >`CAST(SUM(CASE WHEN ${eventAttendanceSchema.profileId} = ${viewingProfileId} THEN 1 ELSE 0 END) AS INT)`
      : sql<number>`CAST(0 AS INT)`;

    const queryBase = db.select({
      id: eventSchema.id,
      kind: eventSchema.kind,

      slug: eventSchema.slug,
      eventPictureUri: eventSchema.eventPictureUri,
      title: eventSchema.title,
      description: eventSchema.description,

      timeStart: eventSchema.timeStart,
      timeEnd: eventSchema.timeEnd,

      createdAt: eventSchema.createdAt,
      updatedAt: eventSchema.updatedAt,
      statSumTotal: sql<
        number
      >`CAST(COALESCE(COUNT(${eventAttendanceSchema.id}), 0) AS INT)`.as(
        "total_stat_sum",
      ),
      statSumProfile: statSumProfileCalculation
        .as("profile_stat_sum"),
    })
      .from(eventSchema)
      .leftJoin(
        eventAttendanceSchema,
        eq(eventSchema.id, eventAttendanceSchema.eventId),
      )
      .leftJoin(
        profileSchema,
        eq(eventAttendanceSchema.profileId, profileSchema.id),
      )
      .groupBy(
        eventSchema.id,
      )
      .orderBy(sql`total_stat_sum DESC, ${eventSchema.createdAt} DESC`)
      .limit(cursor.pageSize);

    const query = (cursor.offset === "")
      ? queryBase.where(
        and(
          gt(eventSchema.timeEnd, twoHoursLater),
          isNull(eventSchema.deletedAt),
        ),
      )
      : queryBase.where(
        and(
          gt(eventSchema.id, cursor.offset),
          gt(eventSchema.timeEnd, twoHoursLater),
          isNull(eventSchema.deletedAt),
        ),
      );

    const result = await query;

    return result;
  }

  async findById(id: string) {
    const result = await db.query.eventSchema
      .findFirst({
        where: and(eq(eventSchema.id, id), isNull(eventSchema.deletedAt)),
      });

    return result;
  }

  async create(event: EventPartial) {
    const [result] = await db.insert(eventSchema)
      .values(event)
      .returning();

    return result;
  }

  async update(id: string, event: Partial<EventPartial>) {
    const [result] = await db.update(eventSchema)
      .set({ ...event, updatedAt: new Date() })
      .where(and(eq(eventSchema.id, id), isNull(eventSchema.deletedAt)))
      .returning();

    return result;
  }

  async delete(id: string) {
    const [result] = await db.update(eventSchema)
      .set({ deletedAt: new Date() })
      .where(and(eq(eventSchema.id, id), isNull(eventSchema.deletedAt)))
      .returning();

    return result;
  }
}

export const eventRepository = new EventRepository();
