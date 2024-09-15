// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { Handlers } from "$fresh/server.ts";
import { questionRepository } from "@/pkg/main/data/question/repository.ts";
import { ensureMediaTypes, ensurePathParameter, type State } from "@/pkg/main/plugins/session.ts";

type QuestionItem = Exclude<Awaited<ReturnType<typeof questionRepository.findById>>, null>;

const anonymize = (question: QuestionItem) => {
  if (question.isAnonymous) {
    return { ...question, userId: null };
  }

  return question;
};

export const handler: Handlers<undefined, State> = {
  async GET(req, ctx) {
    ensureMediaTypes(req, ["application/json"]);
    const questionId = ensurePathParameter("questionId", ctx.params.id);

    const item = await questionRepository.findById(questionId);

    if (item === null) {
      throw new Deno.errors.NotFound("Question not found");
    }

    return Response.json(anonymize(item));
  },
};
