// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import * as assert from "@std/assert";
import * as ulid from "@std/ulid";
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
    id: ulid.ulid(),
    userLogin: user.login,
  };
  const question2: Question = {
    ...randomQuestion(),
    id: ulid.ulid(Date.now() + 1_000),
    userLogin: user.login,
  };

  assert.assertEquals(await getQuestion(question1.id), null);
  assert.assertEquals(await getQuestion(question2.id), null);
  assert.assertEquals(await Array.fromAsync(listQuestions()), []);
  assert.assertEquals(
    await Array.fromAsync(listQuestionsByUser(user.login)),
    [],
  );

  await createQuestion(question1);
  await createQuestion(question2);
  await assert.assertRejects(async () => await createQuestion(question1));

  assert.assertEquals(await getQuestion(question1.id), question1);
  assert.assertEquals(await getQuestion(question2.id), question2);
  assert.assertEquals(
    (await Array.fromAsync(listQuestions())).map((x) => x.value),
    [
      question1,
      question2,
    ],
  );
  assert.assertEquals(
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

  assert.assertEquals(
    await Array.fromAsync(listQuestionsVotedByUser(user.login)),
    [],
  );

  await assert.assertRejects(
    async () => await createVote(vote),
    Deno.errors.NotFound,
    "Question not found",
  );
  await createQuestion(question);
  await assert.assertRejects(
    async () => await createVote(vote),
    Deno.errors.NotFound,
    "User not found",
  );
  await createUser(user);
  await createVote(vote);
  question.score++;

  assert.assertEquals(
    (await Array.fromAsync(listQuestionsVotedByUser(user.login))).map(
      (x) => x.value,
    ),
    [question],
  );
  await assert.assertRejects(async () => await createVote(vote));
});

Deno.test("[db] getAreVotedByUser()", async () => {
  const question = randomQuestion();
  const user = randomUser();
  const vote = {
    questionId: question.id,
    userLogin: user.login,
    createdAt: new Date(),
  };

  assert.assertEquals(await getQuestion(question.id), null);
  assert.assertEquals(await getUser(user.login), null);
  assert.assertEquals(await getAreVotedByUser([question], user.login), [false]);

  await createQuestion(question);
  await createUser(user);
  await createVote(vote);
  question.score++;

  assert.assertEquals(await getQuestion(question.id), question);
  assert.assertEquals(await getUser(user.login), user);
  assert.assertEquals(await getAreVotedByUser([question], user.login), [true]);
});
