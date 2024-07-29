// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { type Cursor } from "@/pkg/main/library/data/cursors.ts";
import { type QuestionPartial, questionSchema } from "../models/question.ts";
import { userSchema } from "../models/user.ts";
import {
  type QuestionVotePartial,
  questionVoteSchema,
} from "../models/question-vote.ts";
import { db } from "../db.ts";

export { type Question, type QuestionPartial } from "../models/question.ts";

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

    const result = await query;

    return result;
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

    const result = await query;

    return result;
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

    const result = await query;

    return result;
  }

  async upsertVote(questionVote: QuestionVotePartial) {
    const [result] = await db.insert(questionVoteSchema)
      .values(questionVote)
      .onConflictDoUpdate({
        target: [questionVoteSchema.questionId, questionVoteSchema.userId],
        set: questionVote,
      })
      .returning();

    return result;
  }

  async findAllWithScores(cursor: Cursor, viewingUserId?: string) {
    const scoreSumUserCalculation = viewingUserId !== undefined
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

    const result = await query;

    return result;
  }

  async findAllByUserIdWithScores(
    cursor: Cursor,
    userId: string,
    viewingUserId?: string,
  ) {
    const scoreSumUserCalculation = viewingUserId !== undefined
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

    const result = await query;

    return result;
  }

  async findById(id: string) {
    const result = await db.query.questionSchema
      .findFirst({
        where: and(eq(questionSchema.id, id), isNull(questionSchema.deletedAt)),
      });

    return result;
  }

  async create(question: QuestionPartial) {
    const [result] = await db.insert(questionSchema)
      .values(question)
      .returning();

    return result;
  }

  async update(id: string, question: Partial<QuestionPartial>) {
    const [result] = await db.update(questionSchema)
      .set({ ...question, updatedAt: new Date() })
      .where(and(eq(questionSchema.id, id), isNull(questionSchema.deletedAt)))
      .returning();

    return result;
  }

  async delete(id: string) {
    const [result] = await db.update(questionSchema)
      .set({ deletedAt: new Date() })
      .where(and(eq(questionSchema.id, id), isNull(questionSchema.deletedAt)))
      .returning();

    return result;
  }
}

export const questionRepository = new QuestionRepository();
