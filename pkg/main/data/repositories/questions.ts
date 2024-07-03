// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { and, eq, isNull, sql } from "drizzle-orm";
import { type QuestionPartial, questionSchema } from "../models/question.ts";
import { userSchema } from "../models/user.ts";
import { questionVoteSchema } from "../models/question-vote.ts";
import { db } from "../db.ts";

export { type Question, type QuestionPartial } from "../models/question.ts";

export class QuestionRepository {
  async findAll() {
    const result = await db.query.questionSchema
      .findMany({
        where: isNull(questionSchema.deletedAt),
      });

    return result;
  }

  async findAllByUserId(userId: string) {
    const result = await db.query.questionSchema
      .findMany({
        where: and(
          eq(questionSchema.userId, userId),
          isNull(questionSchema.deletedAt),
        ),
      });

    return result;
  }

  async findAllWithScores(viewingUserId?: string) {
    const scoreSumUserCalculation = viewingUserId !== undefined
      ? sql<
        number
      >`CAST(SUM(CASE WHEN ${questionVoteSchema.userId} = ${viewingUserId} THEN ${questionVoteSchema.score} ELSE 0 END) AS INT)`
      : sql<number>`CAST(0 AS INT)`;

    const result = await db.select({
      id: questionSchema.id,
      content: questionSchema.content,
      user: {
        id: userSchema.id,
        name: userSchema.name,
        githubHandle: userSchema.githubHandle,
      },
      scoreSumTotal: sql<
        number
      >`CAST(COALESCE(SUM(${questionVoteSchema.score}), 0) AS INT)`.as(
        "total_score_sum",
      ),
      scoreSumUser: scoreSumUserCalculation
        .as("user_score_sum"),
    })
      .from(questionSchema)
      .leftJoin(userSchema, eq(questionSchema.userId, userSchema.id))
      .leftJoin(
        questionVoteSchema,
        eq(questionSchema.id, questionVoteSchema.questionId),
      )
      .where(
        and(
          eq(questionSchema.isHidden, false),
          isNull(questionSchema.deletedAt),
        ),
      )
      .groupBy(
        questionSchema.id,
        questionSchema.content,
        userSchema.id,
        userSchema.name,
        userSchema.githubHandle,
      );

    return result;
  }

  async findAllByUserIdWithScores(userId: string, viewingUserId?: string) {
    const scoreSumUserCalculation = viewingUserId !== undefined
      ? sql<
        number
      >`CAST(SUM(CASE WHEN ${questionVoteSchema.userId} = ${viewingUserId} THEN ${questionVoteSchema.score} ELSE 0 END) AS INT)`
      : sql<number>`CAST(0 AS INT)`;

    const result = await db.select({
      id: questionSchema.id,
      content: questionSchema.content,
      user: {
        id: userSchema.id,
        name: userSchema.name,
        githubHandle: userSchema.githubHandle,
      },
      scoreSumTotal: sql<
        number
      >`CAST(COALESCE(SUM(${questionVoteSchema.score}), 0) AS INT)`.as(
        "total_score_sum",
      ),
      scoreSumUser: scoreSumUserCalculation
        .as("user_score_sum"),
    })
      .from(questionSchema)
      .leftJoin(userSchema, eq(questionSchema.userId, userSchema.id))
      .leftJoin(
        questionVoteSchema,
        eq(questionSchema.id, questionVoteSchema.questionId),
      )
      .where(
        and(
          eq(questionSchema.userId, userId),
          eq(questionSchema.isHidden, false),
          isNull(questionSchema.deletedAt),
        ),
      )
      .groupBy(
        questionSchema.id,
        questionSchema.content,
        userSchema.id,
        userSchema.name,
        userSchema.githubHandle,
      );

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
