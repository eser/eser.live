// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { ulid } from "std/ulid/mod.ts";

const DENO_KV_PATH_KEY = "DENO_KV_PATH";
let path = undefined;
if (
  (await Deno.permissions.query({ name: "env", variable: DENO_KV_PATH_KEY }))
    .state === "granted"
) {
  path = Deno.env.get(DENO_KV_PATH_KEY);
}
export const kv = await Deno.openKv(path);

/**
 * Returns an array of values of a given {@linkcode Deno.KvListIterator} that's
 * been iterated over.
 *
 * @example
 * ```ts
 * import { collectValues, listQuestions, type Question } from "@/pkg/main/utils/db.ts";
 *
 * const questions = await collectValues<Question>(listQuestions());
 * questions[0].id; // Returns "01H9YD2RVCYTBVJEYEJEV5D1S1";
 * questions[0].userLogin; // Returns "snoop"
 * questions[0].question; // Returns "example-question"
 * questions[0].score; // Returns 420
 * ```
 */
export async function collectValues<T>(iter: Deno.KvListIterator<T>) {
  return await Array.fromAsync(iter, ({ value }) => value);
}

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
    id: ulid(),
    userLogin: crypto.randomUUID(),
    question: crypto.randomUUID(),
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
 * import { createQuestion } from "@/pkg/main/utils/db.ts";
 * import { ulid } from "std/ulid/mod.ts";
 *
 * await createQuestion({
 *   id: ulid(),
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

  const res = await kv.atomic()
    .check({ key: questionsKey, versionstamp: null })
    .check({ key: questionsByUserKey, versionstamp: null })
    .set(questionsKey, question)
    .set(questionsByUserKey, question)
    .commit();

  if (!res.ok) {
    throw new Error("Failed to create question");
  }
}

/**
 * Gets the question with the given ID from the database.
 *
 * @example
 * ```ts
 * import { getQuestion } from "@/pkg/main/utils/db.ts";
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
 * import { listQuestions } from "@/pkg/main/utils/db.ts";
 *
 * for await (const entry of listQuestions()) {
 *   entry.value.id; // Returns "01H9YD2RVCYTBVJEYEJEV5D1S1"
 *   entry.value.userLogin; // Returns "pedro"
 *   entry.key; // Returns ["questions_voted_by_user", "01H9YD2RVCYTBVJEYEJEV5D1S1", "pedro"]
 *   entry.versionstamp; // Returns "00000000000000010000"
 * }
 * ```
 */
export function listQuestions(options?: Deno.KvListOptions) {
  return kv.list<Question>({ prefix: ["questions"] }, options);
}

/**
 * Returns a {@linkcode Deno.KvListIterator} which can be used to iterate over
 * the questions by a given user in the database, in chronological order.
 *
 * @example
 * ```ts
 * import { listQuestionsByUser } from "@/pkg/main/utils/db.ts";
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
 * import { createVote } from "@/pkg/main/utils/db.ts";
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
 * import { hideQuestion } from "@/pkg/main/utils/db.ts";
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
 * import { listQuestionsVotedByUser } from "@/pkg/main/utils/db.ts";
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

// User
export interface User {
  // AKA username
  login: string;
  sessionId: string;
}

/** For testing */
export function randomUser(login?: string): User {
  return {
    login: login ?? crypto.randomUUID(),
    sessionId: crypto.randomUUID(),
  };
}

/**
 * Creates a new user in the database. Throws if the user or user session
 * already exists.
 *
 * @example
 * ```ts
 * import { createUser } from "@/pkg/main/utils/db.ts";
 *
 * await createUser({
 *   login: "john",
 *   sessionId: crypto.randomUUID(),
 * });
 * ```
 */
export async function createUser(user: User) {
  const usersKey = ["users", user.login];
  const usersBySessionKey = ["users_by_session", user.sessionId];

  const atomicOp = kv.atomic()
    .check({ key: usersKey, versionstamp: null })
    .check({ key: usersBySessionKey, versionstamp: null })
    .set(usersKey, user)
    .set(usersBySessionKey, user);

  const res = await atomicOp.commit();

  if (!res.ok) {
    throw new Error("Failed to create user");
  }
}

/**
 * Creates a user in the database, overwriting any previous data.
 *
 * @example
 * ```ts
 * import { updateUser } from "@/pkg/main/utils/db.ts";
 *
 * await updateUser({
 *   login: "john",
 *   sessionId: crypto.randomUUID(),
 * });
 * ```
 */
export async function updateUser(user: User) {
  const usersKey = ["users", user.login];
  const usersBySessionKey = ["users_by_session", user.sessionId];

  const atomicOp = kv.atomic()
    .set(usersKey, user)
    .set(usersBySessionKey, user);

  const res = await atomicOp.commit();
  if (!res.ok) throw new Error("Failed to update user");
}

/**
 * Updates the session ID of a given user in the database.
 *
 * @example
 * ```ts
 * import { updateUserSession } from "@/pkg/main/utils/db.ts";
 *
 * await updateUserSession({
 *   login: "john",
 *   sessionId: "xxx",
 * }, "yyy");
 * ```
 */
export async function updateUserSession(user: User, sessionId: string) {
  const userKey = ["users", user.login];
  const oldUserBySessionKey = ["users_by_session", user.sessionId];
  const newUserBySessionKey = ["users_by_session", sessionId];
  const newUser: User = { ...user, sessionId };

  const atomicOp = kv.atomic()
    .set(userKey, newUser)
    .delete(oldUserBySessionKey)
    .check({ key: newUserBySessionKey, versionstamp: null })
    .set(newUserBySessionKey, newUser);

  const res = await atomicOp.commit();
  if (!res.ok) throw new Error("Failed to update user session");
}

/**
 * Gets the user with the given login from the database.
 *
 * @example
 * ```ts
 * import { getUser } from "@/pkg/main/utils/db.ts";
 *
 * const user = await getUser("jack");
 * user?.login; // Returns "jack"
 * user?.sessionId; // Returns "xxx"
 * ```
 */
export async function getUser(login: string) {
  const res = await kv.get<User>(["users", login]);
  return res.value;
}

/**
 * Gets the user with the given session ID from the database. The first attempt
 * is done with eventual consistency. If that returns `null`, the second
 * attempt is done with strong consistency. This is done for performance
 * reasons, as this function is called in every route request for checking
 * whether the session user is logged in.
 *
 * @example
 * ```ts
 * import { getUserBySession } from "@/pkg/main/utils/db.ts";
 *
 * const user = await getUserBySession("xxx");
 * user?.login; // Returns "jack"
 * user?.sessionId; // Returns "xxx"
 * ```
 */
export async function getUserBySession(sessionId: string) {
  const key = ["users_by_session", sessionId];
  const eventualRes = await kv.get<User>(key, {
    consistency: "eventual",
  });
  if (eventualRes.value !== null) return eventualRes.value;
  const res = await kv.get<User>(key);
  return res.value;
}

/**
 * Returns a {@linkcode Deno.KvListIterator} which can be used to iterate over
 * the users in the database.
 *
 * @example
 * ```ts
 * import { listUsers } from "@/pkg/main/utils/db.ts";
 *
 * for await (const entry of listUsers()) {
 *   entry.value.login; // Returns "jack"
 *   entry.value.sessionId; // Returns "xxx"
 * }
 * ```
 */
export function listUsers(options?: Deno.KvListOptions) {
  return kv.list<User>({ prefix: ["users"] }, options);
}

/**
 * Returns a boolean array indicating whether the given questions have been voted
 * for by the given user in the database.
 *
 * @example
 * ```ts
 * import { getAreVotedByUser } from "@/pkg/main/utils/db.ts";
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
  const votedQuestions = await collectValues(
    listQuestionsVotedByUser(userLogin),
  );
  const votedQuestionsIds = votedQuestions.map((question) => question.id);

  return questions.map((question) => votedQuestionsIds.includes(question.id));
}
