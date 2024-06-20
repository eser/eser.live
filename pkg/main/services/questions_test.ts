// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { assertEquals, assertRejects } from "std/assert/mod.ts";
import { ulid } from "std/ulid/mod.ts";
import { createUser, getUser, randomUser } from "./users.ts";
import {
  createQuestion,
  createVote,
  getAreVotedByUser,
  getQuestion,
  listQuestions,
  listQuestionsByUser,
  listQuestionsVotedByUser,
  type Question,
  randomQuestion,
} from "./questions.ts";

Deno.test("[db] questions", async () => {
  const user = randomUser();
  const question1: Question = {
    ...randomQuestion(),
    id: ulid(),
    userLogin: user.login,
  };
  const question2: Question = {
    ...randomQuestion(),
    id: ulid(Date.now() + 1_000),
    userLogin: user.login,
  };

  assertEquals(await getQuestion(question1.id), null);
  assertEquals(await getQuestion(question2.id), null);
  assertEquals(await Array.fromAsync(listQuestions()), []);
  assertEquals(await Array.fromAsync(listQuestionsByUser(user.login)), []);

  await createQuestion(question1);
  await createQuestion(question2);
  await assertRejects(async () => await createQuestion(question1));

  assertEquals(await getQuestion(question1.id), question1);
  assertEquals(await getQuestion(question2.id), question2);
  assertEquals((await Array.fromAsync(listQuestions())).map((x) => x.value), [
    question1,
    question2,
  ]);
  assertEquals(
    (await Array.fromAsync(listQuestionsByUser(user.login))).map((x) =>
      x.value
    ),
    [
      question1,
      question2,
    ],
  );
});

Deno.test("[db] votes", async () => {
  const question = randomQuestion();
  const user = randomUser();
  const vote = {
    questionId: question.id,
    userLogin: user.login,
    createdAt: new Date(),
  };

  assertEquals(await Array.fromAsync(listQuestionsVotedByUser(user.login)), []);

  await assertRejects(
    async () => await createVote(vote),
    Deno.errors.NotFound,
    "Question not found",
  );
  await createQuestion(question);
  await assertRejects(
    async () => await createVote(vote),
    Deno.errors.NotFound,
    "User not found",
  );
  await createUser(user);
  await createVote(vote);
  question.score++;

  assertEquals(
    (await Array.fromAsync(listQuestionsVotedByUser(user.login))).map(
      (x) => x.value,
    ),
    [question],
  );
  await assertRejects(async () => await createVote(vote));
});

Deno.test("[db] getAreVotedByUser()", async () => {
  const question = randomQuestion();
  const user = randomUser();
  const vote = {
    questionId: question.id,
    userLogin: user.login,
    createdAt: new Date(),
  };

  assertEquals(await getQuestion(question.id), null);
  assertEquals(await getUser(user.login), null);
  assertEquals(await getAreVotedByUser([question], user.login), [false]);

  await createQuestion(question);
  await createUser(user);
  await createVote(vote);
  question.score++;

  assertEquals(await getQuestion(question.id), question);
  assertEquals(await getUser(user.login), user);
  assertEquals(await getAreVotedByUser([question], user.login), [true]);
});
