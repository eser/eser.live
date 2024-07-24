// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import * as httpStatus from "@std/http/status";
import { type Handlers } from "$fresh/server.ts";
import {
  assertIsEditor,
  type LoggedInState,
} from "@/pkg/main/plugins/session.ts";
import { questionRepository } from "@/pkg/main/data/repositories/questions.ts";
import { BadRequestError } from "@/pkg/main/library/http/bad-request-error.ts";

export const handler: Handlers<undefined, LoggedInState> = {
  async POST(req, ctx) {
    assertIsEditor(ctx);

    const questionId = new URL(req.url).searchParams.get("questionId");
    if (questionId === null) {
      throw new BadRequestError("`questionId` URL parameter missing");
    }

    await questionRepository.update(questionId, { isHidden: true });

    return new Response(null, { status: httpStatus.STATUS_CODE.Created });
  },
};
