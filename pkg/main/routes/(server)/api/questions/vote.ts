// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { STATUS_CODE } from "std/http/status.ts";
import { type Handlers } from "$fresh/server.ts";
import { type LoggedInState } from "@/pkg/main/plugins/session.ts";
import { createVote } from "@/pkg/main/services/db.ts";
import { BadRequestError } from "@/pkg/main/library/http/bad-request-error.ts";

export const handler: Handlers<undefined, LoggedInState> = {
  async POST(req, ctx) {
    const questionId = new URL(req.url).searchParams.get("question_id");
    if (questionId === null) {
      throw new BadRequestError("`question_id` URL parameter missing");
    }

    await createVote({
      questionId,
      userLogin: ctx.state.sessionUser.login,
    });

    return new Response(null, { status: STATUS_CODE.Created });
  },
};
