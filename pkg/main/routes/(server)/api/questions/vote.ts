// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import * as ulid from "@std/ulid";
import * as httpStatus from "@std/http/status";
import { type Handlers } from "$fresh/server.ts";
import { BadRequestError } from "@/pkg/main/library/http/bad-request-error.ts";
import { assertLoggedIn, type State } from "@/pkg/main/plugins/session.ts";
import { questionRepository } from "@/pkg/main/data/question/repository.ts";

export const handler: Handlers<undefined, State> = {
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
