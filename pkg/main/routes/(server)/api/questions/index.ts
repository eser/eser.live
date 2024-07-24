// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { type Handlers } from "$fresh/server.ts";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";
import { type LoggedInState } from "@/pkg/main/plugins/session.ts";
import { questionRepository } from "@/pkg/main/data/repositories/questions.ts";

const PAGE_SIZE = 10;

type QuestionItem = Awaited<
  ReturnType<typeof questionRepository.findAllWithScores>
>[0];

const anonymize = (question: QuestionItem) => {
  if (question.isAnonymous) {
    return { ...question, user: null };
  }

  return question;
};

export const handler: Handlers<undefined, LoggedInState> = {
  async GET(req, ctx) {
    const cursor = getCursor(req.url, PAGE_SIZE);
    const items = await questionRepository.findAllWithScores(
      cursor,
      ctx.state.sessionUser?.id,
    );

    return Response.json({
      items: items.map((x) => anonymize(x)),
      cursor: items.at(-1)?.id ?? null,
    });
  },
};
