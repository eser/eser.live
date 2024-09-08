// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { type Handlers } from "$fresh/server.ts";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";
import { type State } from "@/pkg/main/plugins/session.ts";
import { questionRepository } from "@/pkg/main/data/question/repository.ts";

const PAGE_SIZE = 10;

type QuestionItem = Awaited<
  ReturnType<typeof questionRepository.findAllWithScores>
>["items"][number];

const anonymize = (question: QuestionItem) => {
  if (question.isAnonymous) {
    return { ...question, user: null };
  }

  return question;
};

export const handler: Handlers<undefined, State> = {
  async GET(req, ctx) {
    const cursor = getCursor(req.url, PAGE_SIZE);
    const result = await questionRepository.findAllWithScores(
      cursor,
      ctx.state.sessionUser?.id ?? null,
    );

    result.items.forEach((x) => anonymize(x));

    return Response.json(result);
  },
};
