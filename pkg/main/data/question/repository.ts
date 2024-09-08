// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { type Cursor, withCursor } from "@/pkg/main/library/data/cursors.ts";
import { questionVoteSchema } from "../question-vote/schema.ts";
import {
  type QuestionVote,
  type QuestionVotePartial,
} from "../question-vote/types.ts";
import { userSchema } from "../user/schema.ts";
import { db } from "../db.ts";
import { questionSchema } from "./schema.ts";
import {
  type Question,
  type QuestionPartial,
  type QuestionWithScores,
} from "./types.ts";

export class QuestionRepository {
  async findAll(cursor: Cursor) {
    const filterConditions = (cursor.offset === "")
      ? isNull(questionSchema.deletedAt)
      : and(
        gt(questionSchema.id, cursor.offset),
        isNull(questionSchema.deletedAt),
      );

    const query = db.query.questionSchema
      .findMany({
        where: filterConditions,
        limit: cursor.pageSize,
      });

    const result: Question[] = await query;

    const nextCursor = result.length === cursor.pageSize
      ? result[result.length - 1].id ?? null
      : null;

    return withCursor(result, nextCursor);
  }

  async findAllByUserId(cursor: Cursor, userId: string) {
    const filterConditions = (cursor.offset === "")
      ? and(
        eq(questionSchema.userId, userId),
        isNull(questionSchema.deletedAt),
      )
      : and(
        gt(questionSchema.id, cursor.offset),
        eq(questionSchema.userId, userId),
        isNull(questionSchema.deletedAt),
      );

    const query = db.query.questionSchema
      .findMany({
        where: filterConditions,
        limit: cursor.pageSize,
      });

    const result: Question[] = await query;

    const nextCursor = result.length === cursor.pageSize
      ? result[result.length - 1].id ?? null
      : null;

    return withCursor(result, nextCursor);
  }

  async findAllVotesByUserId(cursor: Cursor, userId: string) {
    const filterConditions = (cursor.offset === "")
      ? eq(questionVoteSchema.userId, userId)
      : and(
        gt(questionVoteSchema.id, cursor.offset),
        eq(questionVoteSchema.userId, userId),
      );

    const query = await db.query.questionSchema
      .findMany({
        where: filterConditions,
        limit: cursor.pageSize,
      });

    const result: Question[] = await query;

    const nextCursor = result.length === cursor.pageSize
      ? result[result.length - 1].id ?? null
      : null;

    return withCursor(result, nextCursor);
  }

  async upsertVote(questionVote: QuestionVotePartial) {
    const result: QuestionVote | undefined =
      (await db.insert(questionVoteSchema)
        .values(questionVote)
        .onConflictDoUpdate({
          target: [questionVoteSchema.questionId, questionVoteSchema.userId],
          set: questionVote,
        })
        .returning()).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async findAllWithScores(cursor: Cursor, viewingUserId: string | null) {
    const scoreSumUserCalculation = viewingUserId !== null
      ? sql<
        number
      >`CAST(SUM(CASE WHEN ${questionVoteSchema.userId} = ${viewingUserId} THEN ${questionVoteSchema.score} ELSE 0 END) AS INT)`
      : sql<number>`CAST(0 AS INT)`;

    const query = db.select({
      id: questionSchema.id,
      user: {
        id: userSchema.id,
        name: userSchema.name,
        githubHandle: userSchema.githubHandle,
      },
      content: questionSchema.content,
      isAnonymous: questionSchema.isAnonymous,
      answerKind: questionSchema.answerKind,
      answerContent: questionSchema.answerContent,
      answerUri: questionSchema.answerUri,
      answeredAt: questionSchema.answeredAt,
      createdAt: questionSchema.createdAt,
      updatedAt: questionSchema.updatedAt,
      scoreSumTotal: sql<
        number
      >`CAST(COALESCE(SUM(${questionVoteSchema.score}), 0) AS INT)`.as(
        "total_score_sum",
      ),
      scoreSumUser: scoreSumUserCalculation
        .as("user_score_sum"),
    })
      .from(questionSchema)
      .leftJoin(
        userSchema,
        and(
          eq(userSchema.id, questionSchema.userId),
          isNull(userSchema.deletedAt),
        ),
      )
      .leftJoin(
        questionVoteSchema,
        eq(questionVoteSchema.questionId, questionSchema.id),
      )
      .where(
        and(
          (cursor.offset !== "")
            ? gt(questionSchema.id, cursor.offset)
            : undefined,
          eq(questionSchema.isHidden, false),
          isNull(questionSchema.deletedAt),
        ),
      )
      .groupBy(
        questionSchema.id,
        userSchema.id,
      )
      .orderBy(sql`total_score_sum DESC, ${questionSchema.createdAt} DESC`)
      .limit(cursor.pageSize);

    const result: QuestionWithScores[] = await query;

    const nextCursor = result.length === cursor.pageSize
      ? result[result.length - 1].id ?? null
      : null;

    return withCursor(result, nextCursor);
  }

  async findAllByUserIdWithScores(
    cursor: Cursor,
    userId: string,
    viewingUserId: string | null,
  ) {
    const scoreSumUserCalculation = viewingUserId !== null
      ? sql<
        number
      >`CAST(SUM(CASE WHEN ${questionVoteSchema.userId} = ${viewingUserId} THEN ${questionVoteSchema.score} ELSE 0 END) AS INT)`
      : sql<number>`CAST(0 AS INT)`;

    const query = db.select({
      id: questionSchema.id,
      user: {
        id: userSchema.id,
        name: userSchema.name,
        githubHandle: userSchema.githubHandle,
      },
      content: questionSchema.content,
      isAnonymous: questionSchema.isAnonymous,
      answerKind: questionSchema.answerKind,
      answerContent: questionSchema.answerContent,
      answerUri: questionSchema.answerUri,
      answeredAt: questionSchema.answeredAt,
      createdAt: questionSchema.createdAt,
      updatedAt: questionSchema.updatedAt,
      scoreSumTotal: sql<
        number
      >`CAST(COALESCE(SUM(${questionVoteSchema.score}), 0) AS INT)`.as(
        "total_score_sum",
      ),
      scoreSumUser: scoreSumUserCalculation
        .as("user_score_sum"),
    })
      .from(questionSchema)
      .leftJoin(
        userSchema,
        and(
          eq(userSchema.id, questionSchema.userId),
          isNull(userSchema.deletedAt),
        ),
      )
      .leftJoin(
        questionVoteSchema,
        eq(questionVoteSchema.questionId, questionSchema.id),
      )
      .where(
        and(
          (cursor.offset !== "")
            ? gt(questionSchema.id, cursor.offset)
            : undefined,
          eq(questionSchema.userId, userId),
          eq(questionSchema.isHidden, false),
          eq(questionSchema.isAnonymous, false),
          isNull(questionSchema.deletedAt),
        ),
      )
      .groupBy(
        questionSchema.id,
        userSchema.id,
      )
      .orderBy(sql`total_score_sum DESC, ${questionSchema.createdAt} DESC`)
      .limit(cursor.pageSize);

    const result: QuestionWithScores[] = await query;

    const nextCursor = result.length === cursor.pageSize
      ? result[result.length - 1].id ?? null
      : null;

    return withCursor(result, nextCursor);
  }

  async findById(id: string) {
    const result: Question | undefined = await db.query.questionSchema
      .findFirst({
        where: and(eq(questionSchema.id, id), isNull(questionSchema.deletedAt)),
      });

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async create(question: QuestionPartial) {
    const result: Question | undefined = (await db.insert(questionSchema)
      .values(question)
      .returning()).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async update(id: string, question: Partial<QuestionPartial>) {
    const result: Question | undefined = (await db.update(questionSchema)
      .set({ ...question, updatedAt: new Date() })
      .where(and(eq(questionSchema.id, id), isNull(questionSchema.deletedAt)))
      .returning()).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async delete(id: string) {
    const result: Question | undefined = (await db.update(questionSchema)
      .set({ deletedAt: new Date() })
      .where(and(eq(questionSchema.id, id), isNull(questionSchema.deletedAt)))
      .returning()).at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }
}

export const questionRepository = new QuestionRepository();
