// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { type Handlers } from "$fresh/server.ts";
import { listQuestionsVotedByUser } from "@/pkg/main/utils/db.ts";
import { LoggedInState } from "@/pkg/main/plugins/session.ts";

export const handler: Handlers<undefined, LoggedInState> = {
  async GET(_req, ctx) {
    const iter = listQuestionsVotedByUser(ctx.state.sessionUser.login);
    const questions = (await Array.fromAsync(iter)).map((x) => x.value);

    return Response.json(questions);
  },
};
