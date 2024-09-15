// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { Handlers } from "$fresh/server.ts";
import { questionRepository } from "@/pkg/main/data/question/repository.ts";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";
import { assertLoggedIn, type LoggedInState } from "@/pkg/main/plugins/session.ts";

const PAGE_SIZE = 10;

export const handler: Handlers<undefined, LoggedInState> = {
  async GET(req, ctx) {
    assertLoggedIn(ctx);

    const cursor = getCursor(req.url, PAGE_SIZE);
    const result = await questionRepository.findAllByUserIdWithScores(
      cursor,
      ctx.state.sessionUser.id,
      ctx.state.sessionUser.id,
    );

    return Response.json(result);
  },
};
