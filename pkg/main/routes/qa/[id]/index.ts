// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { Handlers } from "$fresh/server.ts";
import { questionRepository } from "@/pkg/main/data/question/repository.ts";
import { InvalidContentTypeError } from "@/pkg/main/library/http/invalid-content-type.ts";
import type { State } from "@/pkg/main/plugins/session.ts";
import { accepts } from "@std/http/negotiation";

type QuestionItem = Exclude<Awaited<ReturnType<typeof questionRepository.findById>>, null>;

const anonymize = (question: QuestionItem) => {
  if (question.isAnonymous) {
    return { ...question, userId: null };
  }

  return question;
};

export const handler: Handlers<undefined, State> = {
  async GET(req, ctx) {
    const mediaTypes = accepts(req);
    if (!mediaTypes.includes("application/json")) {
      throw new InvalidContentTypeError(["application/json"]);
    }

    const item = await questionRepository.findById(ctx.params.id);

    if (item === null) {
      throw new Deno.errors.NotFound("Question not found");
    }

    return Response.json(anonymize(item));
  },
};
