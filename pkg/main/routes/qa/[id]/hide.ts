// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import * as httpStatus from "@std/http/status";
import type { Handlers } from "$fresh/server.ts";
import { questionRepository } from "@/pkg/main/data/question/repository.ts";
import {
  assertIsEditor,
  ensureMediaTypes,
  ensurePathParameter,
  type LoggedInState,
} from "@/pkg/main/plugins/session.ts";

export const handler: Handlers<undefined, LoggedInState> = {
  async POST(req, ctx) {
    ensureMediaTypes(req, ["application/json"]);
    const questionId = ensurePathParameter("questionId", ctx.params.id);
    assertIsEditor(ctx);

    await questionRepository.update(questionId, { isHidden: true });

    return new Response(null, { status: httpStatus.STATUS_CODE.Created });
  },
};
