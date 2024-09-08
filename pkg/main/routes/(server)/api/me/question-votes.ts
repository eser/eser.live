// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { type Handlers } from "$fresh/server.ts";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";
import { type LoggedInState } from "@/pkg/main/plugins/session.ts";
import { questionRepository } from "@/pkg/main/data/question/repository.ts";

const PAGE_SIZE = 10;

// this endpoint is executed after ensureLoggedIn middleware has allowed it to pass
export const handler: Handlers<undefined, LoggedInState> = {
  async GET(req, ctx) {
    const cursor = getCursor(req.url, PAGE_SIZE);
    const result = await questionRepository.findAllVotesByUserId(
      cursor,
      ctx.state.sessionUser.id,
    );

    return Response.json(result);
  },
};
