// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
/**
 * This script copies all entries in the KV database to the drizzle database.
 *
 * @example
 * ```bash
 * deno task kv:copy
 * ```
 */
import * as ulid from "@std/ulid";
import { kv } from "@/pkg/main/services/kv-connection.ts";
import { userRepository } from "@/pkg/main/data/repositories/users.ts";

const mapping: Record<string, string> = {};
const translateMap = (uuid: string) => {
  if (mapping[uuid]) {
    return mapping[uuid];
  }

  const id = ulid.ulid();
  mapping[uuid] = id;
  return id;
};

const processOauthSession = async (
  _oauthSessionId: string,
  _values: Record<string, string>,
) => {
};

const processQuestion = async (
  _questionId: string,
  _values: Record<string, string>,
) => {
};

const processQuestionByUser = async (
  _login: string,
  _questionId: string,
  _values: Record<string, string>,
) => {
};

const processQuestionVotedByUser = async (
  _login: string,
  _questionId: string,
  _values: Record<string, string>,
) => {
};

const processSiteSession = async (
  _siteSessionId: string,
  _values: Record<string, string>,
) => {
};

const processUser = async (
  login: string,
  _values: Record<string, string>,
) => {
  await userRepository.create({
    id: ulid.ulid(),
    kind: "regular",
    name: login,
    email: null,
    phone: null,
    githubHandle: login,
    createdAt: new Date(),
    updatedAt: null,
  });
};

const processUserBySession = async (
  _sessionId: string,
  _values: Record<string, string>,
) => {
};

const processUserVote = async (
  _questionId: string,
  _login: string,
  _values: Record<string, string>,
) => {
};

for await (const entry of kv.list<Record<string, string>>({ prefix: [] })) {
  if (entry.key[0] === "oauth_sessions") {
    const oauthSessionId = translateMap(entry.key[1].toString());

    await processOauthSession(oauthSessionId, entry.value);
    continue;
  }

  if (entry.key[0] === "questions") {
    const questionId = entry.key[1].toString();

    await processQuestion(questionId, {
      ...entry.value,
    });
    continue;
  }

  if (entry.key[0] === "questions_by_user") {
    const login = entry.key[1].toString();
    const questionId = entry.key[2].toString();

    await processQuestionByUser(login, questionId, entry.value);
    continue;
  }

  if (entry.key[0] === "questions_voted_by_user") {
    const login = entry.key[1].toString();
    const questionId = entry.key[2].toString();

    await processQuestionVotedByUser(login, questionId, entry.value);
    continue;
  }

  if (entry.key[0] === "site_sessions") {
    const siteSessionId = translateMap(entry.key[1].toString());

    await processSiteSession(siteSessionId, entry.value);
    continue;
  }

  if (entry.key[0] === "users") {
    const login = entry.key[1].toString();

    await processUser(login, {
      ...entry.value,
      sessionId: translateMap(entry.value.sessionId),
    });
    continue;
  }

  if (entry.key[0] === "users_by_session") {
    const sessionId = translateMap(entry.key[1].toString());

    await processUserBySession(sessionId, {
      ...entry.value,
      sessionId: sessionId,
    });
    continue;
  }

  if (entry.key[0] === "users_voted_for_question") {
    const questionId = entry.key[1].toString();
    const login = entry.key[2].toString();

    await processUserVote(questionId, login, {
      ...entry.value,
      sessionId: translateMap(entry.value.sessionId),
    });
    continue;
  }

  console.log(`unable to process key: ${entry.key.join(":")}`);
}

kv.close();
