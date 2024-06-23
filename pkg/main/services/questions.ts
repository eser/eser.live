// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import * as ulid from "@std/ulid";
import { kv } from "./kv-connection.ts";
import { type User } from "./users.ts";

// Question
export interface Question {
  // Uses ULID
  id: string;
  userLogin: string;
  question: string;
  score: number;
  hidden: boolean;
}

/** For testing */
export function randomQuestion(): Question {
  return {
    id: ulid.ulid(),
    userLogin: ulid.ulid(),
    question: ulid.ulid(),
    score: 0,
    hidden: false,
  };
}

/**
 * Creates a new question in the database. Throws if the question already exists in
 * one of the indexes.
 *
 * @example
 * ```ts
 * import * as ulid from "@std/ulid";
 * import { createQuestion } from "@/pkg/main/services/questions.ts";
 *
 * await createQuestion({
 *   id: ulid.ulid(),
 *   userLogin: "john_doe",
 *   question: "example-question",
 *   score: 0,
 *   hidden: false,
 * });
 * ```
 */
export async function createQuestion(question: Question) {
  const questionsKey = ["questions", question.id];
  const questionsByUserKey = [
    "questions_by_user",
    question.userLogin,
    question.id,
  ];

  const atomicOp = kv.atomic()
    .check({ key: questionsKey, versionstamp: null })
    .check({ key: questionsByUserKey, versionstamp: null })
    .set(questionsKey, question)
    .set(questionsByUserKey, question);

  const res = await atomicOp.commit();

  if (!res.ok) {
    throw new Error("Failed to create question");
  }
}

/**
 * Gets the question with the given ID from the database.
 *
 * @example
 * ```ts
 * import { getQuestion } from "@/pkg/main/services/questions.ts";
 *
 * const question = await getQuestion("01H9YD2RVCYTBVJEYEJEV5D1S1");
 * question?.id; // Returns "01H9YD2RVCYTBVJEYEJEV5D1S1";
 * question?.userLogin; // Returns "snoop"
 * question?.question; // Returns "example-question"
 * question?.score; // Returns 420
 * ```
 */
export async function getQuestion(id: string) {
  const res = await kv.get<Question>(["questions", id]);

  return res.value;
}

/**
 * Returns a {@linkcode Deno.KvListIterator} which can be used to iterate over
 * the questions in the database, in chronological order.
 *
 * @example
 * ```ts
 * import { listQuestions } from "@/pkg/main/services/questions.ts";
 *
 * for await (const entry of listQuestions()) {
 *   entry.value.id; // Returns "01H9YD2RVCYTBVJEYEJEV5D1S1"
 *   entry.value.userLogin; // Returns "pedro"
 *   entry.key; // Returns ["questions_voted_by_user", "01H9YD2RVCYTBVJEYEJEV5D1S1", "pedro"]
 *   entry.versionstamp; // Returns "00000000000000010000"
 * }
 * ```
 */

export type ListQuestionsProps = {
  limit?: number;
  cursor?: string;
  reverse?: boolean;
};

export function listQuestions(options?: ListQuestionsProps) {
  return kv.list<Question>({ prefix: ["questions"] }, {
    limit: options?.limit,
    cursor: options?.cursor,
    reverse: options?.reverse,
  });
}

/**
 * Returns a {@linkcode Deno.KvListIterator} which can be used to iterate over
 * the questions by a given user in the database, in chronological order.
 *
 * @example
 * ```ts
 * import { listQuestionsByUser } from "@/pkg/main/services/questions.ts";
 *
 * for await (const entry of listQuestionsByUser("pedro")) {
 *   entry.value.id; // Returns "01H9YD2RVCYTBVJEYEJEV5D1S1"
 *   entry.value.userLogin; // Returns "pedro"
 *   entry.key; // Returns ["questions_voted_by_user", "01H9YD2RVCYTBVJEYEJEV5D1S1", "pedro"]
 *   entry.versionstamp; // Returns "00000000000000010000"
 * }
 * ```
 */
export function listQuestionsByUser(
  userLogin: string,
  options?: Deno.KvListOptions,
) {
  return kv.list<Question>(
    { prefix: ["questions_by_user", userLogin] },
    options,
  );
}

// Vote
export interface Vote {
  questionId: string;
  userLogin: string;
}

/**
 * Creates a vote in the database. Throws if the given question or user doesn't
 * exist or the vote already exists. The question's score is incremented by 1.
 *
 * @example
 * ```ts
 * import { createVote } from "@/pkg/main/services/questions.ts";
 *
 * await createVote({
     questionId: "01H9YD2RVCYTBVJEYEJEV5D1S1",
 *   userLogin: "pedro",
 * });
 * ```
 */
export async function createVote(vote: Vote) {
  const questionKey = ["questions", vote.questionId];
  const userKey = ["users", vote.userLogin];
  const [questionRes, userRes] = await kv.getMany<[Question, User]>([
    questionKey,
    userKey,
  ]);
  const question = questionRes.value;
  const user = userRes.value;

  if (question === null) {
    throw new Deno.errors.NotFound("Question not found");
  }

  if (user === null) {
    throw new Deno.errors.NotFound("User not found");
  }

  const questionVotedByUserKey = [
    "questions_voted_by_user",
    vote.userLogin,
    vote.questionId,
  ];
  const userVotedForQuestionKey = [
    "users_voted_for_question",
    vote.questionId,
    vote.userLogin,
  ];
  const questionByUserKey = [
    "questions_by_user",
    question.userLogin,
    question.id,
  ];

  question.score++;

  const res = await kv.atomic()
    .check(questionRes)
    .check(userRes)
    .check({ key: questionVotedByUserKey, versionstamp: null })
    .check({ key: userVotedForQuestionKey, versionstamp: null })
    .set(questionKey, question)
    .set(questionByUserKey, question)
    .set(questionVotedByUserKey, question)
    .set(userVotedForQuestionKey, user)
    .commit();

  if (!res.ok) {
    throw new Error("Failed to create vote");
  }
}

/**
 * Hides a question in the database. Throws if the given question or user doesn't
 * exist or the vote already exists. The question's hidden flag set to true.
 *
 * @example
 * ```ts
 * import { hideQuestion } from "@/pkg/main/services/questions.ts";
 *
 * await hideQuestion("01H9YD2RVCYTBVJEYEJEV5D1S1");
 * ```
 */
export async function hideQuestion(questionId: string) {
  const questionKey = ["questions", questionId];

  const [questionRes] = await kv.getMany<[Question]>([
    questionKey,
  ]);

  if (questionRes?.value === null) {
    throw new Deno.errors.NotFound("Question not found");
  }

  const question = questionRes.value;
  question.hidden = true;

  const res = await kv.atomic()
    .check(questionRes)
    .set(questionKey, question)
    .commit();

  if (!res.ok) {
    throw new Error("Failed to hide question");
  }
}

/**
 * Returns a {@linkcode Deno.KvListIterator} which can be used to iterate over
 * the questions voted by a given user in the database, in chronological order.
 *
 * @example
 * ```ts
 * import { listQuestionsVotedByUser } from "@/pkg/main/services/questions.ts";
 *
 * for await (const entry of listQuestionsVotedByUser("john")) {
 *   entry.value.id; // Returns "01H9YD2RVCYTBVJEYEJEV5D1S1"
 *   entry.value.userLogin; // Returns "pedro"
 *   entry.key; // Returns ["questions_voted_by_user", "01H9YD2RVCYTBVJEYEJEV5D1S1", "pedro"]
 *   entry.versionstamp; // Returns "00000000000000010000"
 * }
 * ```
 */
export function listQuestionsVotedByUser(userLogin: string) {
  return kv.list<Question>({ prefix: ["questions_voted_by_user", userLogin] });
}

/**
 * Returns a boolean array indicating whether the given questions have been voted
 * for by the given user in the database.
 *
 * @example
 * ```ts
 * import { getAreVotedByUser } from "@/pkg/main/services/questions.ts";
 *
 * const questions = [
 *   {
 *     id: "01H9YD2RVCYTBVJEYEJEV5D1S1",
 *     userLogin: "jack",
 *     question: "Jack voted for this",
 *     score: 1,
 *     hidden: false,
 *   },
 *   {
 *     id: "01H9YD2RVCYTBVJEYEJEV5D1S2",
 *     userLogin: "jill",
 *     question: "Jack didn't vote for this",
 *     score: 0,
 *     hidden: false,
 *   }
 * ];
 * await getAreVotedByUser(questions, "jack"); // Returns [true, false]
 * ```
 */
export async function getAreVotedByUser(
  questions: Question[],
  userLogin: string,
) {
  const votedQuestions = await Array.fromAsync(
    listQuestionsVotedByUser(userLogin),
  );
  const votedQuestionsIds = votedQuestions.map((question) => question.value.id);

  return questions.map((question) => votedQuestionsIds.includes(question.id));
}
