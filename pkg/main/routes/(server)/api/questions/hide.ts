// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import * as httpStatus from "@std/http/status";
import { type Handlers } from "$fresh/server.ts";
import { type LoggedInState } from "@/pkg/main/plugins/session.ts";
import { hideQuestion } from "@/pkg/main/services/questions.ts";
import { BadRequestError } from "@/pkg/main/library/http/bad-request-error.ts";

export const handler: Handlers<undefined, LoggedInState> = {
  async POST(req, _ctx) {
    const questionId = new URL(req.url).searchParams.get("question_id");
    if (questionId === null) {
      throw new BadRequestError("`question_id` URL parameter missing");
    }

    await hideQuestion(questionId);

    return new Response(null, { status: httpStatus.STATUS_CODE.Created });
  },
};
