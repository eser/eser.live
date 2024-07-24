// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { type Handlers } from "$fresh/server.ts";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";
import { type LoggedInState } from "@/pkg/main/plugins/session.ts";
import { userRepository } from "@/pkg/main/data/repositories/users.ts";
import { questionRepository } from "@/pkg/main/data/repositories/questions.ts";

const PAGE_SIZE = 10;

export const handler: Handlers<undefined, LoggedInState> = {
  async GET(req, ctx) {
    const cursor = getCursor(req.url, PAGE_SIZE);
    const user = await userRepository.findById(ctx.params.id);

    if (user === undefined) {
      throw new Deno.errors.NotFound("User not found");
    }

    const items = await questionRepository.findAllByUserIdWithScores(
      cursor,
      user.id,
      ctx.state.sessionUser?.id,
    );

    return Response.json({
      items: items,
      cursor: items.at(-1)?.id ?? null,
    });
  },
};
