// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { Status } from "std/http/status.ts";
import { type Handlers } from "$fresh/server.ts";
import { type LoggedInState } from "@/plugins/session.ts";
import { hideQuestion } from "@/utils/db.ts";
import { BadRequestError } from "@/utils/http.ts";

export const handler: Handlers<undefined, LoggedInState> = {
  async POST(req, _ctx) {
    const questionId = new URL(req.url).searchParams.get("question_id");
    if (questionId === null) {
      throw new BadRequestError("`question_id` URL parameter missing");
    }

    await hideQuestion(questionId);

    return new Response(null, { status: Status.Created });
  },
};
