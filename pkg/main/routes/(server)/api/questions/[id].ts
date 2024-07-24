// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { type Handlers } from "$fresh/server.ts";
import { type LoggedInState } from "@/pkg/main/plugins/session.ts";
import { questionRepository } from "@/pkg/main/data/repositories/questions.ts";

type QuestionItem = Exclude<
  Awaited<
    ReturnType<typeof questionRepository.findById>
  >,
  undefined
>;

const anonymize = (question: QuestionItem) => {
  if (question.isAnonymous) {
    return { ...question, userId: null };
  }

  return question;
};

export const handler: Handlers<undefined, LoggedInState> = {
  async GET(_req, ctx) {
    const item = await questionRepository.findById(ctx.params.id);

    if (item === undefined) {
      throw new Deno.errors.NotFound("Question not found");
    }

    return Response.json(
      anonymize(item),
    );
  },
};
