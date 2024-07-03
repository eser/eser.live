// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { eq } from "drizzle-orm";
import {
  type QuestionVotePartial,
  questionVoteSchema,
} from "../models/question-vote.ts";
import { db } from "../db.ts";

export {
  type QuestionVote,
  type QuestionVotePartial,
} from "../models/question-vote.ts";

export class QuestionVoteRepository {
  async findAll() {
    const results = await db.select()
      .from(questionVoteSchema);

    return results;
  }

  async findAllByUserId(userId: string) {
    const result = await db.query.questionSchema
      .findMany({
        where: eq(questionVoteSchema.userId, userId),
      });

    return result;
  }

  async findById(id: string) {
    const result = await db.query.questionSchema
      .findFirst({
        where: eq(questionVoteSchema.id, id),
      });

    return result;
  }

  async upsert(question: QuestionVotePartial) {
    const [result] = await db.insert(questionVoteSchema)
      .values(question)
      .onConflictDoUpdate({
        target: [questionVoteSchema.questionId, questionVoteSchema.userId],
        set: question,
      })
      .returning();

    return result;
  }

  async update(id: string, questionVote: Partial<QuestionVotePartial>) {
    const [result] = await db.update(questionVoteSchema)
      .set(questionVote)
      .where(eq(questionVoteSchema.id, id))
      .returning();

    return result;
  }
}

export const questionVoteRepository = new QuestionVoteRepository();
