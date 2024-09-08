// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { type Cursor, withCursor } from "@/pkg/main/library/data/cursors.ts";
import { eventAttendanceSchema } from "../event-attendance/schema.ts";
import {
  type EventAttendance,
  type EventAttendancePartial,
} from "../event-attendance/types.ts";
import { eventSeriesSchema } from "../event-series/schema.ts";
import { profileSchema } from "../profile/schema.ts";
import { db } from "../db.ts";
import { type Event, type EventPartial, type EventWithStats } from "./types.ts";
import { eventSchema } from "./schema.ts";

export class EventRepository {
  async findAll(cursor: Cursor) {
    const filterConditions = and(
      (cursor.offset !== "")
        ? gt(eventSchema.timeStart, new Date(Number(cursor.offset)))
        : undefined,
      isNull(eventSchema.deletedAt),
    );

    const query = await db.query.eventSchema
      .findMany({
        where: filterConditions,
        limit: cursor.pageSize,
      });

    const result: Event[] = await query;

    const nextCursor = result.length === cursor.pageSize
      ? result[result.length - 1].timeStart?.getTime() ?? null
      : null;

    return withCursor(result, nextCursor);
  }

  // FIXME(@eser): Should this one return EventAttendance[] instead of Event[]?
  async findAllAttendancesByProfileId(cursor: Cursor, profileId: string) {
    const filterConditions = and(
      (cursor.offset !== "")
        ? gt(eventSchema.timeStart, new Date(Number(cursor.offset)))
        : undefined,
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

    const result: Event[] = await query;

    const nextCursor = result.length === cursor.pageSize
      ? result[result.length - 1].timeStart?.getTime() ?? null
      : null;

    return withCursor(result, nextCursor);
  }

  async upsertAttendance(eventAttendance: EventAttendancePartial) {
    const result: EventAttendance | undefined = (
      await db.insert(eventAttendanceSchema)
        .values(eventAttendance)
        .onConflictDoUpdate({
          target: [
            eventAttendanceSchema.eventId,
            eventAttendanceSchema.profileId,
          ],
          set: eventAttendance,
        })
        .returning()
    ).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async findAllWithStats(
    cursor: Cursor,
    until: Date | null,
    viewingProfileId: string | null,
  ) {
    const statSumProfileCalculation = viewingProfileId !== null
      ? sql<
        number
      >`CAST(SUM(CASE WHEN ${eventAttendanceSchema.profileId} = ${viewingProfileId} THEN 1 ELSE 0 END) AS INT)`
      : sql<number>`CAST(0 AS INT)`;

    const query = db.select({
      id: eventSchema.id,
      kind: eventSchema.kind,
      status: eventSchema.status,
      series: {
        id: eventSeriesSchema.id,
        slug: eventSeriesSchema.slug,
        eventPictureUri: eventSeriesSchema.eventPictureUri,
        title: eventSeriesSchema.title,
        description: eventSeriesSchema.description,
      },
      slug: eventSchema.slug,
      eventPictureUri: eventSchema.eventPictureUri,
      title: eventSchema.title,
      description: eventSchema.description,
      attendanceUri: eventSchema.attendanceUri,
      publishedAt: eventSchema.publishedAt,
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
        eventSeriesSchema,
        and(
          eq(eventSeriesSchema.id, eventSchema.seriesId),
          isNull(eventSeriesSchema.deletedAt),
        ),
      )
      .leftJoin(
        eventAttendanceSchema,
        and(
          eq(eventAttendanceSchema.eventId, eventSchema.id),
          isNull(eventAttendanceSchema.deletedAt),
        ),
      )
      .leftJoin(
        profileSchema,
        and(
          eq(profileSchema.id, eventAttendanceSchema.profileId),
          isNull(profileSchema.deletedAt),
        ),
      )
      .where(
        and(
          (cursor.offset !== "")
            ? gt(eventSchema.timeStart, new Date(Number(cursor.offset)))
            : undefined,
          until !== null ? gt(eventSchema.timeEnd, until) : undefined,
          eq(eventSchema.status, "published"),
          isNull(eventSchema.deletedAt),
        ),
      )
      .groupBy(
        eventSchema.id,
        eventSeriesSchema.id,
      )
      // .orderBy(sql`total_stat_sum DESC, ${eventSchema.createdAt} DESC`)
      .orderBy(sql`${eventSchema.timeStart} ASC`)
      .limit(cursor.pageSize);

    const result: EventWithStats[] = await query;

    const nextCursor = result.length === cursor.pageSize
      ? result[result.length - 1].timeStart?.getTime() ?? null
      : null;

    return withCursor(result, nextCursor);
  }

  async findById(id: string) {
    const result: Event | undefined = await db.query.eventSchema
      .findFirst({
        where: and(eq(eventSchema.id, id), isNull(eventSchema.deletedAt)),
      });

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async create(event: EventPartial) {
    const result: Event | undefined = (
      await db.insert(eventSchema)
        .values(event)
        .returning()
    ).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async update(id: string, event: Partial<EventPartial>) {
    const result: Event | undefined = (
      await db.update(eventSchema)
        .set({ ...event, updatedAt: new Date() })
        .where(and(eq(eventSchema.id, id), isNull(eventSchema.deletedAt)))
        .returning()
    ).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async delete(id: string) {
    const result: Event | undefined = (
      await db.update(eventSchema)
        .set({ deletedAt: new Date() })
        .where(and(eq(eventSchema.id, id), isNull(eventSchema.deletedAt)))
        .returning()
    ).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }
}

export const eventRepository = new EventRepository();
