// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import * as ulid from "@std/ulid";
import * as httpStatus from "@std/http/status";
import { type Handlers } from "$fresh/server.ts";
import {
  assertLoggedIn,
  type LoggedInState,
} from "@/pkg/main/plugins/session.ts";
import { questionRepository } from "@/pkg/main/data/repositories/questions.ts";
import { BadRequestError } from "@/pkg/main/library/http/bad-request-error.ts";

export const handler: Handlers<undefined, LoggedInState> = {
  async POST(req, ctx) {
    assertLoggedIn(ctx);

    const questionId = new URL(req.url).searchParams.get("questionId");
    if (questionId === null) {
      throw new BadRequestError("`questionId` URL parameter missing");
    }

    await questionRepository.upsertVote({
      id: ulid.ulid(),
      questionId: questionId,
      userId: ctx.state.sessionUser.id,
      score: 1,
    });

    return new Response(null, { status: httpStatus.STATUS_CODE.Created });
  },
};
