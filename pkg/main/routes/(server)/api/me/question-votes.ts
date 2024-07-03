// Copyright 2024-present the Deno authors. All rights reserved. MIT license.
import { type Handlers } from "$fresh/server.ts";
import { type LoggedInState } from "@/pkg/main/plugins/session.ts";
import { questionVoteRepository } from "@/pkg/main/data/repositories/question-votes.ts";

export const handler: Handlers<undefined, LoggedInState> = {
  async GET(_req, ctx) {
    const items = await questionVoteRepository.findAllByUserId(
      ctx.state.sessionUser.id,
    );

    return Response.json({
      items: items,
      cursor: null,
    });
  },
};
